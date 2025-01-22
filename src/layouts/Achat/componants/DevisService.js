import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { createDevisService } from 'services/devisPurchaseService';
import { getSuppliers } from 'services/supplierApi';
import { useNavigate } from 'react-router-dom';

const CreerDevisService = () => {
  const [devisNumber, setDevisNumber] = useState("DEVIS-SERVICE-");
  const [validityDate, setValidityDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [duree, setDuree] = useState(0);
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [items, setItems] = useState([
    { designation: "", quantite: 0, prixUnitaire: 0, tva: 0 },
  ]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const navigate = useNavigate();

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        console.log("Suppliers data:", data); // Debugging line
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
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
  };

  // Calculate total HT (excluding taxes)
  const calculateTotalHT = () =>
    items.reduce((total, item) => total + item.quantite * item.prixUnitaire, 0).toFixed(2);

  // Calculate total VAT
  const calculateTotalVAT = () =>
    items.reduce((total, item) => total + item.quantite * item.prixUnitaire * (item.tva / 100), 0).toFixed(2);

  // Calculate total TTC (including taxes)
  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(2);

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
    const selectedSupplier = suppliers.find((supplier) => supplier.supplierID === selectedId);

    if (selectedSupplier) {
      setSelectedSupplier(selectedId); // Save the supplier ID
      setSelectedSupplierName(selectedSupplier.name); // Save the supplier name
    } else {
      setSelectedSupplier(""); // Reset if no supplier is selected
      setSelectedSupplierName("");
    }
  };

  // Handle form submission
  const onSubmit = async () => {
    console.log("Selected Supplier ID:", selectedSupplier); // Debugging line

    if (!selectedSupplier) {
      alert('Please select a supplier.');
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
      duree,
      serviceType,
      startDate,
      endDate,
    };

    console.log('Payload being sent:', devisServiceData); // Debugging line

    try {
      const response = await createDevisService(devisServiceData);
      console.log('Devis service created successfully:', response);
      alert('Devis service created successfully!');
      navigate('/DevisService');
    } catch (error) {
      console.error('Error creating devis service:', error);
      alert('Error creating devis service. Please try again.');
    }
  };

  // Navigate to the supplier creation page
  const handleCreateNewSupplier = () => {
    navigate('/supplier-form-steps');
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
              onChange={handleDevisNumberChange}
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

          {/* Durée */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Durée (heures)"
              fullWidth
              type="number"
              value={duree}
              onChange={(e) => setDuree(parseFloat(e.target.value))}
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
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={onSubmit}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            Approuver
          </Button>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
};

export default CreerDevisService;