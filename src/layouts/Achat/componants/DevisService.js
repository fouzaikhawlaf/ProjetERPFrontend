import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const CreerDevisService = () => {
  const [client, setClient] = useState("");
  const [devisNumber, setDevisNumber] = useState("");
  const [date, setDate] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [description, setDescription] = useState("");
  const [tarifHoraire, setTarifHoraire] = useState(0);
  const [duree, setDuree] = useState(0);
  const [items, setItems] = useState([
    { designation: "", quantite: 0, unite: "h", prixUnitaire: 0, tva: 0, montant: 0 },
  ]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { designation: "", quantite: 0, unite: "h", prixUnitaire: 0, tva: 0, montant: 0 }]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "quantite" || field === "prixUnitaire" || field === "tva") {
      newItems[index].montant = newItems[index].quantite * newItems[index].prixUnitaire * (1 + newItems[index].tva / 100);
    }
    setItems(newItems);
  };

  const calculateTotalHT = () =>
    items.reduce((total, item) => total + item.quantite * item.prixUnitaire, 0).toFixed(2);

  const calculateTotalVAT = () =>
    items.reduce((total, item) => total + item.quantite * item.prixUnitaire * (item.tva / 100), 0).toFixed(2);

  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(2);

  const onSubmit = async () => {
    const devisServiceData = {
      client,
      devisNumber,
      date,
      validityDate,
      description,
      tarifHoraire,
      duree,
      items,
      totalHT: parseFloat(calculateTotalHT()),
      totalTVA: parseFloat(calculateTotalVAT()),
      totalTTC: parseFloat(calculateTotalTTC()),
    };

    try {
      const response = await createDevisService(devisServiceData);
      console.log('Devis service created successfully:', response);
      // Vous pouvez ajouter ici une redirection ou un message de succès
    } catch (error) {
      console.error('Error creating devis service:', error);
      // Vous pouvez ajouter ici un message d'erreur à l'utilisateur
    }
  };

  const handleCreateNewSupplier = () => {
    navigate('/supplier-form-steps'); // Navigate to the create supplier page
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
                value={suppliers}
                onChange={(e) => setSuppliers(e.target.value)}
                label="Fournisseur"
              >
                {Array.isArray(suppliers) && suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem >
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
              onChange={(e) => setDevisNumber(e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Date */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date"
              fullWidth
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
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

          {/* Tarif Horaire */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Tarif Horaire (TND)"
              fullWidth
              type="number"
              value={tarifHoraire}
              onChange={(e) => setTarifHoraire(parseFloat(e.target.value))}
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
        </Grid>

        {/* Items Table */}
        <Table sx={{ my: 3, tableLayout: "fixed", width: "100%", overflowX: "auto" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "25%", textAlign: "center" }}>Désignation</TableCell>
              <TableCell sx={{ width: "10%", textAlign: "center" }}>Quantité</TableCell>
              <TableCell sx={{ width: "10%", textAlign: "center" }}>Unité</TableCell>
              <TableCell sx={{ width: "15%", textAlign: "center" }}>Prix Unitaire (TND)</TableCell>
              <TableCell sx={{ width: "10%", textAlign: "center" }}>TVA (%)</TableCell>
              <TableCell sx={{ width: "15%", textAlign: "center" }}>Montant (TND)</TableCell>
              <TableCell sx={{ width: "15%", textAlign: "center" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: "25%" }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <TextField
                      fullWidth
                      value={item.designation}
                      onChange={(e) => handleItemChange(index, "designation", e.target.value)}
                      variant="standard"
                    />
                  </Box>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <TextField
                      type="number"
                      fullWidth
                      value={item.quantite}
                      onChange={(e) => handleItemChange(index, "quantite", parseFloat(e.target.value))}
                      variant="standard"
                    />
                  </Box>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <FormControl fullWidth variant="standard">
                      <Select
                        value={item.unite}
                        onChange={(e) => handleItemChange(index, "unite", e.target.value)}
                      >
                        <MenuItem value="h">h</MenuItem>
                        <MenuItem value="u">u</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: "15%" }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <TextField
                      type="number"
                      fullWidth
                      value={item.prixUnitaire}
                      onChange={(e) => handleItemChange(index, "prixUnitaire", parseFloat(e.target.value))}
                      variant="standard"
                    />
                  </Box>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <TextField
                      type="number"
                      fullWidth
                      value={item.tva}
                      onChange={(e) => handleItemChange(index, "tva", parseFloat(e.target.value))}
                      variant="standard"
                    />
                  </Box>
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  {item.montant.toFixed(2)}
                </TableCell>
                <TableCell sx={{ width: "15%", textAlign: "center" }}>
                  <IconButton color="error" onClick={() => handleDeleteItem(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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