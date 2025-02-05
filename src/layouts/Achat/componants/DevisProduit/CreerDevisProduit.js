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
import { createDevisProduct } from "services/devisPurchaseService";
import { getSuppliers } from "services/supplierApi";
import { useNavigate } from "react-router-dom";

const CreerDevisProduit = () => {
  const [devisNumber, setDevisNumber] = useState("DEVIS-PRODUIT-");
  const [dateCreation, setDateCreation] = useState(new Date().toISOString().split("T")[0]);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [items, setItems] = useState([
    { designation: "", quantite: 0, prixUnitaire: 0, tva: 0 },
  ]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // State for the success modal
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
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    calculateTotals(newItems);
  };

  // Calculate total HT, TVA, and TTC
  const calculateTotals = (items) => {
    const totalHT = items.reduce((total, item) => total + item.quantite * item.prixUnitaire, 0);
    const totalTVA = items.reduce((total, item) => total + item.quantite * item.prixUnitaire * (item.tva / 100), 0);
    const totalTTC = totalHT + totalTVA;

    setTotalHT(totalHT.toFixed(2));
    setTotalTVA(totalTVA.toFixed(2));
    setTotalTTC(totalTTC.toFixed(2));
  };

  // Handle supplier selection
  const handleSupplierChange = (e) => {
    const selectedId = e.target.value;
    const selectedSupplier = suppliers.find((supplier) => supplier.supplierID === selectedId);

    if (selectedSupplier) {
      setSelectedSupplier(selectedId);
      setSelectedSupplierName(selectedSupplier.name);
    } else {
      setSelectedSupplier("");
      setSelectedSupplierName("");
    }
  };

  // Handle form submission
  const onSubmit = async () => {
    if (!selectedSupplier) {
      alert("Please select a supplier.");
      return;
    }

    const devisProduitData = {
      supplierId: selectedSupplier,
      devisNumber,
      dateCreation,
      totalHT: parseFloat(totalHT),
      totalTVA: parseFloat(totalTVA),
      totalTTC: parseFloat(totalTTC),
      items: items.map((item) => ({
        designation: item.designation,
        quantite: item.quantite,
        prixUnitaire: item.prixUnitaire,
        tva: item.tva,
      })),
    };

    try {
      const response = await createDevisProduct(devisProduitData);
      console.log("Devis produit created successfully:", response);

      // Show the success modal
      setModalOpen(true);

      // Redirect to the Devis Produit table after 3 seconds
      setTimeout(() => {
        navigate("/devis/produitTable");
      }, 3000);
    } catch (error) {
      console.error("Error creating devis produit:", error);
      alert("Error creating devis produit. Please try again.");
    }
  };

  // Close the success modal
  const handleModalClose = () => {
    setModalOpen(false);
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
          Créer un Nouveau Devis de Produit
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          {/* Fournisseur */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Fournisseur</InputLabel>
              <Select value={selectedSupplier} onChange={handleSupplierChange} label="Fournisseur">
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.supplierID} value={supplier.supplierID}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Display Selected Supplier Name */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Nom du Fournisseur"
              fullWidth
              value={selectedSupplierName}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          sx={{ mt: 2 }}
        >
          Ajouter un article
        </Button>

        {/* Totals */}
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Total HT: {totalHT} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total TVA: {totalTVA} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total TTC: {totalTTC} TND</Typography>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
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

export default CreerDevisProduit;