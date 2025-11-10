import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { getClients } from "services/ApiClient";
import { getServices } from "services/ServiceApi";
import { createDevis } from "services/DevisClientService";
import { useNavigate } from "react-router-dom";
import generateDevisPDF from "../pdf/DevisPDF";

const unwrapDotNetList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values) return data.$values;
  if (data.items) return data.items;
  return [];
};

const CreerDevisClient = () => {
  const [devisNumber, setDevisNumber] = useState("DEVIS-CLIENT-SERVICE-");
  const [validityDate, setValidityDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [items, setItems] = useState([
    {
      type: 1,
      designation: "",
      quantite: 0,
      prixUnitaire: 0, // HT dans le devis
      tva: 0,          // taux TVA %
      serviceId: null,
    },
  ]);

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientError, setClientError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  // 🔔 Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "warning" | "info"
  });

  // ✅ Nouveau state pour la modal de confirmation
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { clients: clientsList } = await getClients(1, 100, false, false);
        const servicesData = await getServices();

        const transformedClients = unwrapDotNetList(clientsList)
          .map((client) => ({
            id: client.clientID || client.id,
            name:
              client.name ||
              client.companyName ||
              `Client ${client.clientID || client.id}`,
          }))
          .filter((client) => client.id);

        setClients(transformedClients);
        setClientError(
          transformedClients.length === 0 ? "Aucun client disponible" : ""
        );

        setServices(
          unwrapDotNetList(servicesData).map((s) => {
            const priceTTC = Number(s.price || 0);
            const taxRate = Number(s.taxRate || 0);

            const priceHT =
              priceTTC && taxRate >= 0
                ? priceTTC / (1 + taxRate / 100)
                : priceTTC;

            return {
              id: s.id,
              name: s.name || s.serviceName || `Service ${s.id}`,
              duration: s.duration || s.duree || "",
              priceTTC,
              taxRate,
              priceHT,
            };
          })
        );
      } catch (error) {
        console.error(error);
        setClientError("Échec du chargement des clients / services");
        handleOpenSnackbar("Erreur lors du chargement des données", "error");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        type: 1,
        designation: "",
        quantite: 0,
        prixUnitaire: 0,
        tva: 0,
        serviceId: null,
      },
    ]);
  };

  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const newItems = [...prev];

      if (field === "serviceId") {
        const selectedService = services.find((s) => s.id === value);
        const priceHT = selectedService?.priceHT ?? 0;
        const taxRate = selectedService?.taxRate ?? 0;

        newItems[index] = {
          ...newItems[index],
          serviceId: value,
          designation: selectedService?.name || "",
          prixUnitaire: Number(priceHT.toFixed(3)),
          tva: taxRate,
        };
      } else {
        const numericFields = ["quantite", "prixUnitaire", "tva"];
        const numericValue = numericFields.includes(field)
          ? Math.max(0, Number(value) || 0)
          : value;
        newItems[index] = { ...newItems[index], [field]: numericValue };
      }

      return newItems;
    });
  };

  const calculateTotalHT = () =>
    items
      .reduce(
        (total, item) =>
          total + Number(item.quantite) * Number(item.prixUnitaire),
        0
      )
      .toFixed(2);

  const calculateTotalVAT = () =>
    items
      .reduce(
        (total, item) =>
          total +
          Number(item.quantite) *
            Number(item.prixUnitaire) *
            (Number(item.tva) / 100),
        0
      )
      .toFixed(2);

  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(
      2
    );

  const handleDevisNumberChange = (e) => {
    const value = e.target.value;
    setDevisNumber(value.startsWith("DEVIS-") ? value : `DEVIS-${value}`);
  };

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
  };

  const handlePreviewPDF = () => {
    if (!selectedClient) return;

    const clientData = clients.find((c) => c.id === selectedClient);
    const devisData = {
      reference: devisNumber,
      creationDate: new Date().toISOString(),
      expirationDate: validityDate,
      totalHT: calculateTotalHT(),
      totalTVA: calculateTotalVAT(),
      totalTTC: calculateTotalTTC(),
    };

    const pdf = generateDevisPDF(devisData, clientData, items);
    const blob = pdf.output("blob");
    setPdfBlob(blob);
    setPdfPreviewOpen(true);
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${devisNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onSubmit = async () => {
    if (!selectedClient) {
      handleOpenSnackbar("Veuillez sélectionner un client", "warning");
      return;
    }

    if (items.length === 0 || items.every((i) => !i.designation)) {
      handleOpenSnackbar(
        "Veuillez ajouter au moins un service avec une désignation",
        "warning"
      );
      return;
    }

    const devisClientData = {
      clientId: selectedClient,
      creationDate: new Date().toISOString(),
      expirationDate: validityDate
        ? new Date(`${validityDate}T00:00:00`).toISOString()
        : null,
      reference: devisNumber,
      status: 0,
      items: items.map((item) => ({
        type: 1,
        productId: 0,
        serviceId: item.serviceId || 0,
        projectId: 0,
        designation: item.designation,
        price: Number(item.prixUnitaire || 0),
        tva: Number(item.tva || 0),
        quantity: Number(item.quantite || 0),
      })),
    };

    try {
      setLoadingSubmit(true);
      console.log("📤 Envoi devis client :", devisClientData);
      await createDevis(devisClientData);

      // ✅ Notification succès AVEC MODAL DE CONFIRMATION
      handleOpenSnackbar("Devis client créé avec succès", "success");
      
      // ✅ OUVERTURE DE LA MODAL DE CONFIRMATION
      setSuccessModalOpen(true);

    } catch (error) {
      console.error(error);
      handleOpenSnackbar(
        error?.response?.data?.message ||
          error.message ||
          "Erreur lors de la création du devis",
        "error"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ✅ FONCTION POUR LA REDIRECTION APRÈS CONFIRMATION
  const handleSuccessConfirm = () => {
    setSuccessModalOpen(false);
    navigate("/Vente/list/Devis");
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
          Créer un Devis Service
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Client + infos devis */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" error={!!clientError}>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                onChange={handleClientChange}
                label="Client"
                disabled={loadingClients || !!clientError}
                renderValue={(value) => {
                  const selected = clients.find((c) => c.id === value);
                  return selected ? selected.name : "Sélectionnez un client";
                }}
              >
                {loadingClients ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Chargement des clients...
                    </Typography>
                  </MenuItem>
                ) : (
                  clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span>{client.name}</span>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          ID: {client.id}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {clientError && (
                <FormHelperText
                  error
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <span style={{ marginRight: 8 }}>❌</span>
                  {clientError}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Numéro de devis"
              fullWidth
              value={devisNumber}
              onChange={handleDevisNumberChange}
              variant="outlined"
            />
          </Grid>

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
        </Grid>

        {/* Tableau des services */}
        <table
          style={{
            width: "100%",
            margin: "24px 0",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "30%",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Service
              </th>
              <th
                style={{
                  width: "15%",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Quantité
              </th>
              <th
                style={{
                  width: "20%",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Prix Unitaire HT (TND)
              </th>
              <th
                style={{
                  width: "15%",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                TVA (%)
              </th>
              <th
                style={{
                  width: "10%",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>
                  <Select
                    fullWidth
                    value={item.serviceId || ""}
                    onChange={(e) =>
                      handleItemChange(index, "serviceId", e.target.value)
                    }
                  >
                    <MenuItem value="">Sélectionnez un service</MenuItem>
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name} - {service.priceTTC.toFixed(2)} TND TTC -{" "}
                        {service.taxRate}% TVA
                      </MenuItem>
                    ))}
                  </Select>
                </td>

                <td style={{ padding: "8px" }}>
                  <TextField
                    fullWidth
                    type="number"
                    value={item.quantite}
                    onChange={(e) =>
                      handleItemChange(index, "quantite", e.target.value)
                    }
                    variant="outlined"
                  />
                </td>

                <td style={{ padding: "8px" }}>
                  <TextField
                    fullWidth
                    type="number"
                    value={item.prixUnitaire}
                    onChange={(e) =>
                      handleItemChange(index, "prixUnitaire", e.target.value)
                    }
                    variant="outlined"
                  />
                </td>

                <td style={{ padding: "8px" }}>
                  <TextField
                    fullWidth
                    type="number"
                    value={item.tva}
                    onChange={(e) =>
                      handleItemChange(index, "tva", e.target.value)
                    }
                    variant="outlined"
                  />
                </td>

                <td style={{ padding: "8px" }}>
                  <IconButton
                    onClick={() => handleDeleteItem(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          sx={{ mb: 2 }}
        >
          Ajouter un service
        </Button>

        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">
              Total HT: {calculateTotalHT()} TND
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Total TVA: {calculateTotalVAT()} TND
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Total TTC: {calculateTotalTTC()} TND
            </Typography>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" sx={{ mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePreviewPDF}
            disabled={!selectedClient}
          >
            Prévisualiser PDF
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            sx={{ borderRadius: "8px", px: 4, py: 1.5 }}
            size="large"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Enregistrement..." : "Valider Devis"}
          </Button>
        </Grid>

        {/* Modal d'aperçu PDF */}
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
            <Button
              onClick={handleDownloadPDF}
              variant="contained"
              color="primary"
            >
              Télécharger
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ NOUVELLE MODAL DE CONFIRMATION DE SUCCÈS */}
        <Dialog
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          aria-labelledby="success-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="success-dialog-title" sx={{ textAlign: "center" }}>
            🎉 Devis Créé avec Succès !
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {devisNumber}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Votre devis client service a été créé avec succès.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {calculateTotalTTC()} TND TTC
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setSuccessModalOpen(false)}
              sx={{ mr: 2 }}
            >
              Rester sur la page
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSuccessConfirm}
              color="success"
            >
              Voir la liste des devis
            </Button>
          </DialogActions>
        </Dialog>

        {/* 🔔 Snackbar global */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </DashboardLayout>
  );
};

export default CreerDevisClient;