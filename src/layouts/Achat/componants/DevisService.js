import React, { useState, useEffect } from "react";


import {
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Box,
  CircularProgress,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { createDevisService } from "services/devisPurchaseService";
import { getSuppliers } from "services/supplierApi";
import { getServices } from "services/ServiceApi";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import imageShamash from 'images/imageShamash.png';

const CreerDevisService = () => {
  const [devisNumber, setDevisNumber] = useState("DEVIS-SERVICE-");
  const [validityDate, setValidityDate] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [items, setItems] = useState([
    { designation: "", quantite: 0, prixUnitaire: 0, tva: 0, serviceId: null },
  ]);
  const [suppliers, setSuppliers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [supplierError, setSupplierError] = useState("");
  const [servicesError, setServicesError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const navigate = useNavigate();

  // Fetch suppliers and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSuppliers(true);
        setLoadingServices(true);
        
        const [suppliersData, servicesData] = await Promise.all([
          getSuppliers(),
          getServices()
        ]);
        
        // Traitement des fournisseurs
        let supplierData = [];
        if (suppliersData?.$values) supplierData = suppliersData.$values;
        else if (Array.isArray(suppliersData)) supplierData = suppliersData;

        const transformedSuppliers = supplierData
          .map(supplier => ({
            id: supplier.supplierID || supplier.id,
            name: supplier.name || supplier.companyName || `Fournisseur ${supplier.supplierID || supplier.id}`
          }))
          .filter(supplier => supplier.id);

        setSuppliers(transformedSuppliers);
        setSupplierError(transformedSuppliers.length === 0 ? "Aucun fournisseur disponible" : "");

        // Traitement des services
        let serviceData = [];
        if (servicesData?.$values) serviceData = servicesData.$values;
        else if (Array.isArray(servicesData)) serviceData = servicesData;

        const transformedServices = serviceData
          .map(service => ({
            id: service.serviceID || service.id,
            name: service.name,
            price: service.price || 0,
            tvaRate: service.tvaRate || 0
          }))
          .filter(service => service.id);

        setServices(transformedServices);
        setServicesError(transformedServices.length === 0 ? "Aucun service disponible" : "");

      } catch (error) {
        console.error("Error fetching data:", error);
        setSupplierError("Échec du chargement des fournisseurs");
        setServicesError("Échec du chargement des services");
      } finally {
        setLoadingSuppliers(false);
        setLoadingServices(false);
      }
    };

    fetchData();
  }, []);

  // Add a new item to the items list
  const handleAddItem = () => {
    setItems([...items, { designation: "", quantite: 0, prixUnitaire: 0, tva: 0, serviceId: null }]);
  };

  // Delete an item from the items list
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle changes in item fields
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    
    if (field === 'designation' || field === 'serviceId') {
      newItems[index][field] = value;
    } else {
      // Pour les champs numériques, s'assurer que c'est un nombre valide
      const numericValue = Math.max(0, Number(value) || 0);
      newItems[index][field] = numericValue;
    }
    
    setItems(newItems);
  };

  // Handle service selection
  const handleServiceChange = (index, serviceId) => {
    if (serviceId) {
      const selectedService = services.find(service => service.id === serviceId);
      if (selectedService) {
        const newItems = [...items];
        newItems[index] = {
          ...newItems[index], // Conserver les valeurs existantes (comme la quantité)
          serviceId: selectedService.id,
          designation: selectedService.name,
          prixUnitaire: selectedService.price,
          tva: selectedService.tvaRate
        };
        setItems(newItems);
      }
    } else {
      // Si aucun service n'est sélectionné, réinitialiser seulement les champs du service
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index], // Conserver la quantité
        serviceId: null,
        designation: "",
        prixUnitaire: 0,
        tva: 0
      };
      setItems(newItems);
    }
  };

  // Calculate total HT (excluding taxes)
  const calculateTotalHT = () =>
    items.reduce((total, item) => total + (item.quantite || 0) * (item.prixUnitaire || 0), 0).toFixed(3);

  // Calculate total VAT
  const calculateTotalVAT = () =>
    items.reduce((total, item) => total + (item.quantite || 0) * (item.prixUnitaire || 0) * ((item.tva || 0) / 100), 0).toFixed(3);

  // Calculate total TTC (including taxes)
  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT() || 0) + parseFloat(calculateTotalVAT() || 0)).toFixed(3);

  // Calculate duration in hours
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return ((end - start) / (1000 * 60 * 60)).toFixed(2);
  };

  // Handle changes in the devis number field
  const handleDevisNumberChange = (e) => {
    const value = e.target.value;
    if (value.startsWith("DEVIS-")) {
      setDevisNumber(value);
    } else {
      setDevisNumber(`DEVIS-${value}`);
    }
  };

  // Handle supplier selection
  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  // Handle form submission
  const onSubmit = async () => {
    if (!selectedSupplier) {
      alert("Veuillez sélectionner un fournisseur.");
      return;
    }

    const devisServiceData = {
      supplierId: selectedSupplier,
      devisNumber,
      totalHT: parseFloat(calculateTotalHT()),
      totalTVA: parseFloat(calculateTotalVAT()),
      totalTTC: parseFloat(calculateTotalTTC()),
      items: items.map(item => ({
        designation: item.designation,
        quantite: item.quantite,
        prixUnitaire: item.prixUnitaire,
        tva: item.tva,
        serviceId: item.serviceId
      })),
      validityDate,
      description,
      startDate,
      endDate,
    };

    try {
      const response = await createDevisService(devisServiceData);
      console.log("Devis service created successfully:", response);

      // Show the success modal
      setModalOpen(true);

      // Navigate to the DevisService page after 3 seconds
      setTimeout(() => {
        navigate("/DevisService");
      }, 3000);
    } catch (error) {
      console.error("Error creating devis service:", error);
      alert("Erreur lors de la création du devis. Veuillez réessayer.");
    }
  };

  // Close the modal
  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Navigate to the supplier creation page
  const handleCreateNewSupplier = () => {
    navigate("/supplier-form-steps");
  };

  const generatePDFBlob = () => {
  if (!selectedSupplier) {
    alert("Veuillez sélectionner un fournisseur avant de générer le PDF");
    return null;
  }

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;

    // En-tête avec logo
    if (imageShamash) {
      doc.addImage(imageShamash, 'PNG', 10, 10, 30, 30);
    }

    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`DEVIS N° ${devisNumber}`, pageWidth / 2, 20, { align: "center" });

    // Informations société
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Société Shamash IT", 140, 15);
    doc.text("Adresse: étage B03,Centre Urbain Nord, Imm cercle des bureaux", 140, 20);
    doc.text("Tél: +216  29 511 251", 140, 25);
    doc.text("Email: contact@shamash-it.com", 140, 30);

    // Informations fournisseur
    const selectedSupplierObj = suppliers.find(s => s.id === selectedSupplier);
    
    doc.setFont("helvetica", "bold");
    doc.text("Fournisseur:", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.text(selectedSupplierObj?.name || "Non spécifié", 40, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text("Date création:", 10, 47);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString(), 40, 47);
    
    doc.setFont("helvetica", "bold");
    doc.text("Validité:", 10, 54);
    doc.setFont("helvetica", "normal");
    doc.text(validityDate || "Non spécifiée", 40, 54);
    
    doc.setFont("helvetica", "bold");
    doc.text("Référence:", 10, 61);
    doc.setFont("helvetica", "normal");
    doc.text(`DEV-${devisNumber}`, 40, 61);

    yPosition = 70;

    // Description
    doc.setFontSize(12);
    doc.text("Description du service:", 10, yPosition);
    doc.setFontSize(10);
    const splitDescription = doc.splitTextToSize(description || "Aucune description", 180);
    doc.text(splitDescription, 10, yPosition + 7);

    // Tableau des articles - version manuelle
    yPosition += splitDescription.length * 5 + 15;
    
    // En-têtes du tableau
    doc.setFont("helvetica", "bold");
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.rect(10, yPosition, 190, 8, 'F');
    doc.text("N°", 15, yPosition + 5);
    doc.text("Désignation", 30, yPosition + 5);
    doc.text("Qté", 110, yPosition + 5);
    doc.text("P.U. HT", 130, yPosition + 5);
    doc.text("TVA", 160, yPosition + 5);
    doc.text("Total HT", 175, yPosition + 5);

    yPosition += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    // Lignes du tableau
    items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text((index + 1).toString(), 15, yPosition + 5);
      doc.text(item.designation || "-", 30, yPosition + 5);
      doc.text(Number(item.quantite || 0).toFixed(2), 110, yPosition + 5);
      doc.text(`${Number(item.prixUnitaire || 0).toFixed(3)} TND`, 130, yPosition + 5);
      doc.text(`${Number(item.tva || 0).toFixed(2)}%`, 160, yPosition + 5);
      doc.text(`${(Number(item.quantite || 0) * Number(item.prixUnitaire || 0)).toFixed(3)} TND`, 175, yPosition + 5);
      
      // Ligne séparatrice
      doc.line(10, yPosition + 8, 200, yPosition + 8);
      yPosition += 10;
    });

    // Totaux
    const totalsY = yPosition + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    
    doc.text(`Total HT: ${calculateTotalHT()} TND`, 140, totalsY);
    doc.text(`Total TVA: ${calculateTotalVAT()} TND`, 140, totalsY + 7);
    doc.text(`Total TTC: ${calculateTotalTTC()} TND`, 140, totalsY + 14);

    // Pied de page
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Société XYZ - RCS Tunis B123456 - TVA FR40123456789",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    return doc.output("blob");
  } catch (error) {
    console.error("Erreur de génération PDF:", error);
    alert("Erreur lors de la génération du PDF : " + error.message);
    return null;
  }
};
  // Handle PDF preview
  const handlePreviewPDF = () => {
    const blob = generatePDFBlob();
    if (blob) {
      setPdfBlob(blob);
      setPdfPreviewOpen(true);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    const blob = generatePDFBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Devis_${devisNumber.replace(/[/]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <DashboardLayout>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "90%",
          maxWidth: "1200px",
          margin: "auto",
          mt: 4,
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3, fontWeight: 600 }}>
          Créer un Nouveau Devis de Service
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          {/* Fournisseur */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" error={!!supplierError}>
              <InputLabel>Fournisseur</InputLabel>
              <Select
                value={selectedSupplier}
                onChange={handleSupplierChange}
                label="Fournisseur"
                disabled={loadingSuppliers || supplierError}
                renderValue={(value) => {
                  const selected = suppliers.find(s => s.id === value);
                  return selected ? selected.name : "Sélectionnez un fournisseur";
                }}
              >
                {loadingSuppliers ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>Chargement des fournisseurs...</Typography>
                  </MenuItem>
                ) : suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{supplier.name}</span>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        ID: {supplier.id}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {supplierError && (
                <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 8 }}>❌</span>
                  {supplierError}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Devis Number */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Numéro de devis"
              fullWidth
              value={devisNumber}
              onChange={handleDevisNumberChange}
              variant="outlined"
            />
          </Grid>

          {/* Date de Création */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de création"
              fullWidth
              value={new Date().toLocaleDateString()}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>

          {/* Validity Date */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de validité"
              fullWidth
              type="date"
              value={validityDate}
              onChange={(e) => setValidityDate(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de début"
              fullWidth
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de fin"
              fullWidth
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Durée */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Durée (heures)"
              fullWidth
              value={calculateDuration()}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Items Table */}
        <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", margin: "24px 0" }}>
          <thead>
            <tr>
              <th style={{ width: "25%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Désignation</th>
              <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Quantité</th>
              <th style={{ width: "20%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Prix Unitaire (TND)</th>
              <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>TVA (%)</th>
              <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ width: "25%", padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <Select
                        value={item.serviceId || ""}
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Sélectionner un service</em>
                        </MenuItem>
                        {loadingServices ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            <Typography variant="body2" sx={{ ml: 1 }}>Chargement...</Typography>
                          </MenuItem>
                        ) : services.map((service) => (
                          <MenuItem key={service.id} value={service.id}>
                            {service.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TextField
                      fullWidth
                      type="number"
                      value={item.quantite}
                      onChange={(e) => handleItemChange(index, "quantite", e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, step: 1 }}
                    />
                  </div>
                </td>
                <td style={{ width: "20%", padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TextField
                      fullWidth
                      type="number"
                      value={item.prixUnitaire}
                      onChange={(e) => handleItemChange(index, "prixUnitaire", e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </div>
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TextField
                      fullWidth
                      type="number"
                      value={item.tva}
                      onChange={(e) => handleItemChange(index, "tva", e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </div>
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <IconButton onClick={() => handleDeleteItem(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Item Button */}
        <Grid container justifyContent="flex-start" sx={{ my: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{ borderRadius: "8px" }}
          >
            Ajouter un article
          </Button>
        </Grid>

        {/* Totals */}
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Total HT: {calculateTotalHT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Total TVA: {calculateTotalVAT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              Total TTC: {calculateTotalTTC()} TND
            </Typography>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid container justifyContent="flex-end" sx={{ mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePreviewPDF}
            disabled={!selectedSupplier}
          >
            Prévisualiser PDF
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={onSubmit}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            Approuver
          </Button>
        </Grid>
      </Paper>

      {/* Success Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
          }}
        >
          <Typography id="success-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>
            🎉 Devis créé avec succès!
          </Typography>
          <Typography id="success-modal-description" variant="h6" sx={{ mb: 4 }}>
            Vous serez redirigé vers la page des devis dans quelques secondes.
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleModalClose}
          >
            Fermer
          </Button>
        </Box>
      </Modal>

      {/* PDF Preview Dialog */}
      <Dialog open={pdfPreviewOpen} onClose={() => setPdfPreviewOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Aperçu du devis</DialogTitle>
        <DialogContent sx={{ height: '80vh' }}>
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Aperçu PDF"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfPreviewOpen(false)}>Fermer</Button>
          <Button onClick={handleDownloadPDF} variant="contained" color="primary">
            Télécharger
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default CreerDevisService;