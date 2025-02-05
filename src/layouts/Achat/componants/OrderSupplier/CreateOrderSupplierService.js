import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  TextField,
  Grid,
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
//import { createSupplierOrder, getOrderNumbers } from "services/orderSupplierService";
import { useNavigate } from "react-router-dom";

const CreateCommandeSupplier = () => {
  // États du formulaire
  const [orderNumber, setOrderNumber] = useState("CMD-FOURNISSEUR-");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ 
    productCode: "", 
    quantity: 0, 
    unitPrice: 0, 
    tva: 0 
  }]);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Récupération des numéros de commande existants
 

  // Gestion des articles
  const handleAddItem = () => {
    setItems([...items, { 
      productCode: "", 
      quantity: 0, 
      unitPrice: 0, 
      tva: 0 
    }]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Calculs des totaux
  const calculateTotalHT = () => 
    items.reduce((total, item) => total + item.quantity * item.unitPrice, 0).toFixed(2);

  const calculateTotalVAT = () =>
    items.reduce((total, item) => total + (item.quantity * item.unitPrice * (item.tva / 100)), 0).toFixed(2);

  const calculateTotalTTC = () => 
    (parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(2);

  // Sélection d'une commande existante
  const handleOrderChange = (e) => {
    const selectedNumber = e.target.value;
    const selectedOrder = orderList.find(order => order.orderNumber === selectedNumber);
    
    if (selectedOrder) {
      setSelectedOrder(selectedNumber);
      setDescription(selectedOrder.description || "");
      setOrderNumber(selectedOrder.orderNumber);
    }
  };

  // Soumission du formulaire
  const onSubmit = async () => {
    try {
      await createSupplierOrder({
        orderNumber,
        description,
        items: items.map(item => ({
          productCode: item.productCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tva: item.tva
        })),
        deliveryDate,
        totalHT: calculateTotalHT(),
        totalTVA: calculateTotalVAT(),
        totalTTC: calculateTotalTTC()
      });
      
      setModalOpen(true);
      setTimeout(() => navigate("/CommandesFournisseur"), 3000);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
    }
  };

  return (
    <DashboardLayout>
      <Paper elevation={4} sx={{ p: 4, width: "90%", maxWidth: 1200, margin: "auto", mt: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Création de Commande Fournisseur
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {/* Sélection de la commande existante */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Numéro de Devis</InputLabel>
              <Select
                value={selectedOrder}
                onChange={handleOrderChange}
                label="Numéro de Devis"
              >
                {orderList.map((order) => (
                  <MenuItem key={order.id} value={order.orderNumber}>
                    {order.orderNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Champs principaux */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Numéro de commande"
              fullWidth
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Date de livraison prévue"
              type="date"
              fullWidth
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Tableau des articles */}
          <Grid item xs={12}>
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
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={handleAddItem}
              sx={{ mt: 2 }}
            >
              Ajouter un produit
            </Button>
          </Grid>

          {/* Totaux */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h6">Total HT: {calculateTotalHT()} TND</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">Total TVA: {calculateTotalVAT()} TND</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">Total TTC: {calculateTotalTTC()} TND</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Validation */}
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={onSubmit}
            >
              Valider la commande
            </Button>
          </Grid>
        </Grid>

        {/* Modal de confirmation */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            width: 400, 
            bgcolor: "background.paper", 
            p: 4, 
            borderRadius: 2 
          }}>
            <Typography variant="h5" align="center" gutterBottom>
              🎉 Commande créée !
            </Typography>
            <Typography align="center">
              Redirection vers la liste des commandes...
            </Typography>
          </Box>
        </Modal>
      </Paper>
    </DashboardLayout>
  );
};

export default CreateCommandeSupplier;