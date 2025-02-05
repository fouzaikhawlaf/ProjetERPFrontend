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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { createDevisService } from "services/devisPurchaseService";
import { getSuppliers } from "services/supplierApi";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Pour les tableaux formaté
import imageShamash from 'images/imageShamash.png'; // Ajustez le chemin

const CreerDevisService = () => {
  const [devisNumber, setDevisNumber] = useState("DEVIS-SERVICE-");
  const [validityDate, setValidityDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [items, setItems] = useState([
    { designation: "", quantite: 0, prixUnitaire: 0, tva: 0 },
  ]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // State for the modal
  const navigate = useNavigate();

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  // Add a new item to the items list
  const handleAddItem = () => {
    setItems([...items, { designation: "", quantite: 0, prixUnitaire: 0, tva: 0 }]);
  };

  // Delete an item from the items list
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle changes in item fields
 

  // Calculate total HT (excluding taxes)
  const calculateTotalHT = () =>
    items.reduce((total, item) => total + item.quantite * item.prixUnitaire, 0).toFixed(2);

  // Calculate total VAT
  const calculateTotalVAT = () =>
    items.reduce((total, item) => total + item.quantite * item.prixUnitaire * (item.tva / 100), 0).toFixed(2);

  // Calculate total TTC (including taxes)
  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(2);

  // Calculate duration in hours
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return ((end - start) / (1000 * 60 * 60)).toFixed(2); // Convert milliseconds to hours
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
    const selectedId = e.target.value;
    setSelectedSupplier(selectedId);
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
      items,
      validityDate,
      description,
      notes,
      serviceType,
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

 
 
 
  
  const generatePDF = () => {
    if (!selectedSupplier) {
      alert("Veuillez sélectionner un fournisseur avant de générer le PDF");
      return;
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
  
      // Informations client
      const selectedSupplierObj = suppliers.find(s => s.supplierID === selectedSupplier);
      const clientInfo = [
        ["Fournisseur:", selectedSupplierObj?.name || "Non spécifié"],
        ["Date création:", new Date().toLocaleDateString()],
        ["Validité:", validityDate || "Non spécifiée"],
        ["Référence:", `DEV-${devisNumber}`]
      ];
  
      doc.autoTable({
        startY: 40,
        body: clientInfo,
        theme: "plain",
        columnStyles: { 
          0: { fontStyle: "bold", cellWidth: 40 },
          1: { cellWidth: 60 } 
        },
        styles: { fontSize: 10 }
      });
  
      yPosition = doc.lastAutoTable.finalY + 10;
  
      // Description
      doc.setFontSize(12);
      doc.text("Description du service:", 10, yPosition);
      doc.setFontSize(10);
      const splitDescription = doc.splitTextToSize(description || "Aucune description", 180);
      doc.text(splitDescription, 10, yPosition + 7);
  
      // Tableau des articles
      const headers = [["N°", "Désignation", "Qté", "P.U. HT", "TVA", "Total HT"]];
      const data = items.map((item, index) => [
        index + 1,
        item.designation || "-",
        Number(item.quantite || 0).toFixed(2),
        `${Number(item.prixUnitaire || 0).toFixed(3)} TND`,
        `${Number(item.tva || 0).toFixed(2)}%`,
        `${(Number(item.quantite || 0) * Number(item.prixUnitaire || 0)).toFixed(3)} TND`
      ]);
  
      doc.autoTable({
        startY: yPosition + 15,
        head: headers,
        body: data,
        theme: "grid",
        margin: { horizontal: 10 },
        styles: { fontSize: 8 },
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontStyle: "bold" 
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 65 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 }
        }
      });
  
      // Totaux
      const totalsY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      
      const totals = [
        { label: "Total HT:", value: calculateTotalHT() },
        { label: "Total TVA:", value: calculateTotalVAT() },
        { label: "Total TTC:", value: calculateTotalTTC() }
      ];
  
      totals.forEach((total, index) => {
        doc.text(
          `${total.label} ${Number(total.value).toFixed(3)} TND`,
          140,
          totalsY + (index * 7)
        );
      });
  
      // Pied de page
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Société XYZ - RCS Tunis B123456 - TVA FR40123456789",
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
  
      doc.save(`Devis_${devisNumber.replace(/[/]/g, '_')}.pdf`);
    } catch (error) {
      console.error("Erreur de génération PDF:", error);
      alert("Erreur lors de la génération du PDF : " + error.message);
    }
  };
  
  // Corriger la fonction handleItemChange
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    const numericValue = field !== 'designation' ? 
      Math.max(0, Number(value) || 0) : 
      value;
    
    newItems[index][field] = numericValue;
    setItems(newItems);
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>Fournisseur</InputLabel>
              <Select
                value={selectedSupplier}
                onChange={handleSupplierChange}
                label="Fournisseur"
              >
                {Array.isArray(suppliers) && suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <MenuItem key={supplier.supplierID} value={supplier.supplierID}>
                      {supplier.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <Button onClick={handleCreateNewSupplier} variant="contained" color="primary">
                      Créer un nouveau fournisseur
                    </Button>
                  </MenuItem>
                )}
              </Select>
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

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Service Type */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Type de service"
              fullWidth
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
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
                    <input
                      type="text"
                      value={item.designation}
                      onChange={(e) => handleItemChange(index, "designation", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </div>
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <input
                      type="number"
                      value={item.quantite}
                      onChange={(e) => handleItemChange(index, "quantite", parseFloat(e.target.value))}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </div>
                </td>
                <td style={{ width: "20%", padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <input
                      type="number"
                      value={item.prixUnitaire}
                      onChange={(e) => handleItemChange(index, "prixUnitaire", parseFloat(e.target.value))}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </div>
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <input
                      type="number"
                      value={item.tva}
                      onChange={(e) => handleItemChange(index, "tva", parseFloat(e.target.value))}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </div>
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    style={{ background: "none", border: "none", color: "red", cursor: "pointer" }}
                  >
                    <DeleteIcon />
                  </button>
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
            <Typography>Total HT: {calculateTotalHT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total TVA: {calculateTotalVAT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total TTC: {calculateTotalTTC()} TND</Typography>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
    variant="contained"
    color="secondary"
    onClick={generatePDF}
    sx={{ borderRadius: "8px", px: 4, mr: 2 }}
  >
    Télécharger le PDF
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

      {/* Full-Screen Success Modal */}
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
    </DashboardLayout>
  );
};

export default CreerDevisService;