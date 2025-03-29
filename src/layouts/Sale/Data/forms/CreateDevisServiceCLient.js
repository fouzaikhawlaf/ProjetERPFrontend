import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  TextField,
  IconButton, // Ajoutez cette ligne
  Grid,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { getClients } from "services/ApiClient";
import { useNavigate } from "react-router-dom";

const CreerDevisClient = () => {
  const [devisNumber, setDevisNumber] = useState("DEVIS-CLIENT-");
  const [validityDate, setValidityDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [items, setItems] = useState([
    { designation: "", quantite: 0, prixUnitaire: 0, tva: 0 },
  ]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const navigate = useNavigate();

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
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
    const numericValue = field !== "designation" ? Math.max(0, Number(value) || 0) : value;
    newItems[index][field] = numericValue;
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

  // Handle client selection
  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    setSelectedClient(selectedId);
  };

  // Handle form submission
  const onSubmit = async () => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    const devisClientData = {
      clientId: selectedClient,
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
      // Appeler l'API pour créer le devis client
      console.log("Devis client data:", devisClientData);
      alert("Devis client créé avec succès !");
      navigate("/DevisClient"); // Rediriger vers la liste des devis clients
    } catch (error) {
      console.error("Error creating devis client:", error);
      alert("Erreur lors de la création du devis. Veuillez réessayer.");
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
          Créer un Nouveau Devis Client
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          {/* Client */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                onChange={handleClientChange}
                label="Client"
              >
                {Array.isArray(clients) && clients.length > 0 ? (
                  clients.map((client) => (
                    <MenuItem key={client.clientID} value={client.clientID}>
                      {client.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Aucun client disponible</MenuItem>
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
                  <TextField
                    fullWidth
                    value={item.designation}
                    onChange={(e) => handleItemChange(index, "designation", e.target.value)}
                    variant="outlined"
                  />
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <TextField
                    fullWidth
                    type="number"
                    value={item.quantite}
                    onChange={(e) => handleItemChange(index, "quantite", e.target.value)}
                    variant="outlined"
                  />
                </td>
                <td style={{ width: "20%", padding: "8px", textAlign: "center" }}>
                  <TextField
                    fullWidth
                    type="number"
                    value={item.prixUnitaire}
                    onChange={(e) => handleItemChange(index, "prixUnitaire", e.target.value)}
                    variant="outlined"
                  />
                </td>
                <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                  <TextField
                    fullWidth
                    type="number"
                    value={item.tva}
                    onChange={(e) => handleItemChange(index, "tva", e.target.value)}
                    variant="outlined"
                  />
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
            color="primary"
            onClick={onSubmit}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            Créer le Devis
          </Button>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
};

export default CreerDevisClient;