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
import { createDevisProduct } from "services/devisPurchaseService";
import { getSuppliers } from "services/supplierApi";
import { getProducts } from "services/ProductApi";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import imageShamash from "images/imageShamash.png";

const CreerDevisProduit = () => {
  const [devisNumber, setDevisNumber] = useState("DEVIS-PRODUIT-");
  const [dateCreation, setDateCreation] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [items, setItems] = useState([
    { designation: "", quantite: 1, prixUnitaire: 0, tva: 0, productId: null },
  ]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [supplierError, setSupplierError] = useState("");
  const [productsError, setProductsError] = useState("");


  const navigate = useNavigate();

  // Fetch suppliers & products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSuppliers(true);
        setLoadingProducts(true);

        const [suppliersData, productsData] = await Promise.all([
          getSuppliers(),
          getProducts(),
        ]);

        // Suppliers
        let supplierData = [];
        if (suppliersData?.$values) supplierData = suppliersData.$values;
        else if (Array.isArray(suppliersData)) supplierData = suppliersData;

        const transformedSuppliers = supplierData
          .map((supplier) => ({
            id: supplier.supplierID || supplier.id,
            name:
              supplier.name ||
              supplier.companyName ||
              `Fournisseur ${supplier.supplierID || supplier.id}`,
          }))
          .filter((supplier) => supplier.id);

        setSuppliers(transformedSuppliers);
        setSupplierError(
          transformedSuppliers.length === 0
            ? "Aucun fournisseur disponible"
            : ""
        );

        // Products
        let productData = [];
        if (productsData?.$values) productData = productsData.$values;
        else if (Array.isArray(productsData)) productData = productsData;

        const transformedProducts = productData
          .map((product) => ({
            id: product.productID || product.id,
            name: product.name,
            price: product.price || 0,
            tvaRate: product.tvaRate || 0,
            description: product.description || "",
          }))
          .filter((product) => product.id);

        setProducts(transformedProducts);
        setProductsError(
          transformedProducts.length === 0 ? "Aucun produit disponible" : ""
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setSupplierError("Échec du chargement des fournisseurs");
        setProductsError("Échec du chargement des produits");
      } finally {
        setLoadingSuppliers(false);
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, []);

// Générer un numéro automatique au montage du composant
useEffect(() => {
  const annee = new Date().getFullYear();

  // Simule un compteur (dans une vraie app ça viendrait du backend)
  const lastNumber = localStorage.getItem("lastDevisNumber") || 0;
  const newNumber = parseInt(lastNumber) + 1;

  // Format type : DEVIS-2025-001
  const formatted = `DEVIS-${annee}-${String(newNumber).padStart(3, "0")}`;

  setDevisNumber(formatted);
  localStorage.setItem("lastDevisNumber", newNumber);
}, []);



  // Helpers totals
  const calculateTotals = (arr) => {
    const tHT = arr.reduce(
      (total, item) => total + (item.quantite || 0) * (item.prixUnitaire || 0),
      0
    );
    const tTVA = arr.reduce(
      (total, item) =>
        total +
        (item.quantite || 0) *
          (item.prixUnitaire || 0) *
          ((item.tva || 0) / 100),
      0
    );
    const tTTC = tHT + tTVA;

    setTotalHT(tHT.toFixed(2));
    setTotalTVA(tTVA.toFixed(2));
    setTotalTTC(tTTC.toFixed(2));
  };

  // Add / remove / change items
  const handleAddItem = () => {
    const newItems = [
      ...items,
      { designation: "", quantite: 1, prixUnitaire: 0, tva: 0, productId: null },
    ];
    setItems(newItems);
    calculateTotals(newItems);
  };

  const handleDeleteItem = (index) => {
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      calculateTotals(updated);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    if (field === "designation") {
      newItems[index][field] = value;
    } else {
      const numericValue = Math.max(0, Number(value) || 0);
      newItems[index][field] = numericValue;
    }

    setItems(newItems);
    calculateTotals(newItems);
  };

  const handleProductChange = (index, productId) => {
    if (productId) {
      const selectedProduct = products.find((p) => p.id === productId);
      if (selectedProduct) {
        const newItems = [...items];
        newItems[index] = {
          ...newItems[index],
          productId: selectedProduct.id,
          designation: selectedProduct.name,
          prixUnitaire: selectedProduct.price,
          tva: selectedProduct.tvaRate,
        };
        setItems(newItems);
        calculateTotals(newItems);
      }
    } else {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        productId: null,
        designation: "",
        prixUnitaire: 0,
        tva: 0,
      };
      setItems(newItems);
      calculateTotals(newItems);
    }
  };

  // Supplier select
  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  // Submit
  const onSubmit = async () => {
    if (!selectedSupplier) {
      alert("Veuillez sélectionner un fournisseur.");
      return;
    }

    const devisProduitData = {
      supplierId: selectedSupplier,
      devisNumber,
      dateCreation,
      description,
      totalHT: parseFloat(totalHT),
      totalTVA: parseFloat(totalTVA),
      totalTTC: parseFloat(totalTTC),
      items: items.map((item) => ({
        designation: item.designation,
        quantite: item.quantite,
        prixUnitaire: item.prixUnitaire,
        tva: item.tva,
        productId: item.productId,
      })),
    };

    try {
      const response = await createDevisProduct(devisProduitData);
      console.log("Devis produit created successfully:", response);
      setModalOpen(true);
      setTimeout(() => {
        navigate("/devis/produitTable");
      }, 3000);
    } catch (error) {
      console.error("Error creating devis produit:", error);
      alert("Erreur lors de la création du devis. Veuillez réessayer.");
    }
  };

  const handleModalClose = () => setModalOpen(false);

  // PDF
  const generatePDFBlob = () => {
    if (!selectedSupplier) {
      alert("Veuillez sélectionner un fournisseur avant de générer le PDF");
      return null;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Logo
      if (imageShamash) {
        doc.addImage(imageShamash, "PNG", 10, 10, 30, 30);
      }

      // Titre
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`DEVIS N° ${devisNumber}`, pageWidth / 2, 20, { align: "center" });

      // Info société
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Société Shamash IT", 140, 15);
      doc.text(
        "Adresse: étage B03,Centre Urbain Nord, Imm cercle des bureaux",
        140,
        20
      );
      doc.text("Tél: +216  29 511 251", 140, 25);
      doc.text("Email: contact@shamash-it.com", 140, 30);

      // Fournisseur + Description
      const selectedSupplierObj = suppliers.find((s) => s.id === selectedSupplier);
      const supplierInfo = [
        ["Fournisseur:", selectedSupplierObj?.name || "Non spécifié"],
        ["Date création:", new Date().toLocaleDateString()],
        ["Référence:", `DEV-${devisNumber}`],
        ["Description:", description || "Aucune description"],
      ];

      doc.autoTable({
        startY: 40,
        body: supplierInfo,
        theme: "plain",
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 40 },
          1: { cellWidth: 60 },
        },
        styles: { fontSize: 10 },
      });

      const yPosition = doc.lastAutoTable.finalY + 10;

      // Tableau articles
      const headers = [["N°", "Désignation", "Qté", "P.U. HT", "TVA", "Total HT"]];
      const data = items.map((item, index) => [
        index + 1,
        item.designation || "-",
        Number(item.quantite || 0).toFixed(2),
        `${Number(item.prixUnitaire || 0).toFixed(3)} TND`,
        `${Number(item.tva || 0).toFixed(2)}%`,
        `${(
          Number(item.quantite || 0) * Number(item.prixUnitaire || 0)
        ).toFixed(3)} TND`,
      ]);

      doc.autoTable({
        startY: yPosition,
        head: headers,
        body: data,
        theme: "grid",
        margin: { horizontal: 10 },
        styles: { fontSize: 8 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 65 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 },
        },
      });

      // Totaux
      const totalsY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      const totals = [
        { label: "Total HT:", value: totalHT },
        { label: "Total TVA:", value: totalTVA },
        { label: "Total TTC:", value: totalTTC },
      ];

      totals.forEach((total, index) => {
        doc.text(
          `${total.label} ${Number(total.value).toFixed(3)} TND`,
          140,
          totalsY + index * 7
        );
      });

      // Footer
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

  const handlePreviewPDF = () => {
    const blob = generatePDFBlob();
    if (blob) {
      setPdfBlob(blob);
      setPdfPreviewOpen(true);
    }
  };

  const handleDownloadPDF = () => {
    const blob = generatePDFBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Devis_${devisNumber.replace(/[/]/g, "_")}.pdf`;
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
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Créer un Nouveau Devis de Produit
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
                  const selected = suppliers.find((s) => s.id === value);
                  return selected ? selected.name : "Sélectionnez un fournisseur";
                }}
              >
                {loadingSuppliers ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Chargement des fournisseurs...
                    </Typography>
                  </MenuItem>
                ) : (
                  suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span>{supplier.name}</span>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          ID: {supplier.id}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {supplierError && (
                <FormHelperText
                  error
                  sx={{ display: "flex", alignItems: "center" }}
                >
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
              onChange={(e) => setDevisNumber(e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Date Creation */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de création"
              fullWidth
              type="date"
              value={dateCreation}
              onChange={(e) => setDateCreation(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Description */}
          <Grid item  xs={12} md={12}>
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
        </Grid>

        {/* ----- TABLEAU HTML ----- */}
        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
              border: "1px solid #e0e0e0",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Produit
                </th>
                <th
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "120px",
                  }}
                >
                  Quantité
                </th>
                <th
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "180px",
                  }}
                >
                  Prix Unitaire (TND)
                </th>
                <th
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "140px",
                  }}
                >
                  TVA (%)
                </th>
                <th
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "160px",
                  }}
                >
                  Total HT
                </th>
                <th
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "100px",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <Select
                        value={item.productId || ""}
                        onChange={(e) =>
                          handleProductChange(index, e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Sélectionner un produit</em>
                        </MenuItem>
                        {loadingProducts ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              Chargement...
                            </Typography>
                          </MenuItem>
                        ) : (
                          products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td style={{ padding: 8, textAlign: "center" }}>
                    <TextField
                      fullWidth
                      type="number"
                      value={item.quantite}
                      onChange={(e) =>
                        handleItemChange(index, "quantite", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </td>

                  <td style={{ padding: 8, textAlign: "center" }}>
                    <TextField
                      fullWidth
                      type="number"
                      value={item.prixUnitaire}
                      onChange={(e) =>
                        handleItemChange(index, "prixUnitaire", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </td>

                  <td style={{ padding: 8, textAlign: "center" }}>
                    <TextField
                      fullWidth
                      type="number"
                      value={item.tva}
                      onChange={(e) =>
                        handleItemChange(index, "tva", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </td>

                  <td
                    style={{
                      padding: 8,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {((item.quantite || 0) * (item.prixUnitaire || 0)).toFixed(
                      2
                    )}{" "}
                    TND
                  </td>

                  <td style={{ padding: 8, textAlign: "center" }}>
                    <IconButton
                      onClick={() => handleDeleteItem(index)}
                      color="error"
                      disabled={items.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bouton ajouter */}
        <Grid container justifyContent="flex-start" sx={{ my: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{ borderRadius: "8px" }}
          >
            Ajouter un produit
          </Button>
        </Grid>

        {/* Totaux */}
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Total HT: {totalHT} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Total TVA: {totalTVA} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              Total TTC: {totalTTC} TND
            </Typography>
          </Grid>
        </Grid>

        {/* Actions */}
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
          <Typography
            id="success-modal-title"
            variant="h4"
            component="h2"
            sx={{ mb: 2 }}
          >
            🎉 Devis créé avec succès!
          </Typography>
          <Typography id="success-modal-description" variant="h6" sx={{ mb: 4 }}>
            Vous serez redirigé vers la page des devis dans quelques secondes.
          </Typography>
          <Button variant="contained" color="success" size="large" onClick={handleModalClose}>
            Fermer
          </Button>
        </Box>
      </Modal>

      {/* Aperçu PDF */}
      <Dialog
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Aperçu du devis</DialogTitle>
        <DialogContent sx={{ height: "80vh" }}>
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="100%"
              style={{ border: "none" }}
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

export default CreerDevisProduit;
