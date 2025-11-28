import React, { useState, useEffect } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import OrderPDF from "../pdf/OrderPDF";
import { createOrder } from "services/orderClientService";
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
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import DevisClientService from "services/DevisClientService";

// 🔹 Helper pour normaliser les items (.NET / $values)
const normalizeItems = (itemsData) => {
  if (!itemsData) return [];
  if (Array.isArray(itemsData)) return itemsData;
  if (itemsData && typeof itemsData === "object" && itemsData.$values) {
    return itemsData.$values;
  }
  return [];
};

// 🔹 Helpers date au format YYYY-MM-DD
function getTodayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getISOPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const CreateClientOrder = () => {
  const navigate = useNavigate();

  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState("");
  const [clientName, setClientName] = useState("");
  const [orderNumber, setOrderNumber] = useState("CMD-CLIENT-");
  const [deliveryDate, setDeliveryDate] = useState(getISOPlusDays(7));
  const [paymentTerms, setPaymentTerms] = useState("30j");
  const [orderDate] = useState(getTodayISO());
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [notes, setNotes] = useState("");
  const [orderClientItems, setOrderClientItems] = useState([]);
  const [loading, setLoading] = useState({
    quotations: true,
    submission: false,
  });
  const [error, setError] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // 🔹 Charger les devis VALIDÉS / ACCEPTÉS (status = 2)
  const fetchAcceptedQuotations = async () => {
    try {
      const data = await DevisClientService.getDevisByStatus(2);

      const list = Array.isArray(data) ? data : data?.$values || [];

      const normalized = list.map((d) => ({
        ...d,
        items: normalizeItems(d.items),
      }));

      console.log("Devis ACCEPTÉS côté front :", normalized);
      setAcceptedQuotations(normalized);
    } catch (err) {
      console.error(err);
      setError("Échec du chargement des devis acceptés");
      setAcceptedQuotations([]);
    } finally {
      setLoading((prev) => ({ ...prev, quotations: false }));
    }
  };

  useEffect(() => {
    fetchAcceptedQuotations();
  }, []);

  // 🔹 Quand tu sélectionnes un devis → recharge le devis complet par ID
  const handleQuotationSelect = async (quotationId) => {
    setSelectedQuotationId(quotationId);
    setOrderClientItems([]); // reset temporaire
    setClientName(""); // reset client name

    if (!quotationId) return;

    try {
      const fullDevis = await DevisClientService.getDevisById(quotationId);
      console.log("Devis complet chargé :", fullDevis);

      setOrderNumber(`CMD-CLIENT-${fullDevis.reference || quotationId}`);
      
      // 🔹 Récupérer le nom du client depuis le devis
      setClientName(fullDevis.clientName || fullDevis.client?.name || "Client non spécifié");

      const itemsArray = normalizeItems(fullDevis.items);
      console.log("Items du devis complet :", itemsArray);

      const mappedItems = itemsArray.map((item) => ({
        productId: item.productId || item.serviceId || item.projectId || null,
        productName: item.designation || "Ligne devis",
        quantity: item.quantity || 1,
        unitPrice: item.price || 0,
        discount: 0,
      }));

      setOrderClientItems(mappedItems);
    } catch (err) {
      console.error("Erreur lors du chargement du devis complet :", err);
      setError("Impossible de charger les détails du devis sélectionné.");
    }
  };

  const handlePreviewPDF = () => {
    setShowPDFPreview(true);
  };

  const handleAddItem = () => {
    setOrderClientItems((prev) => [
      ...prev,
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
      },
    ]);
  };

  const handleDeleteItem = (index) => {
    setOrderClientItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderClientItems];
    newItems[index][field] = value;
    setOrderClientItems(newItems);
  };

  // 🔹 Calcul du montant HT (Hors Taxes)
  const calculateHT = () =>
    orderClientItems
      .reduce(
        (total, item) =>
          total +
          item.quantity *
            item.unitPrice *
            (1 - (item.discount || 0) / 100),
        0
      )
      .toFixed(2);

  // 🔹 Calcul de la TVA (19% par défaut)
  const calculateTVA = () => {
    const ht = parseFloat(calculateHT());
    return (ht * 0.19).toFixed(2); // 19% de TVA
  };

  // 🔹 Calcul du montant TTC (Toutes Taxes Comprises)
  const calculateTTC = () => {
    const ht = parseFloat(calculateHT());
    const tva = parseFloat(calculateTVA());
    return (ht + tva).toFixed(2);
  };

  const onSubmit = async () => {
    setLoading((prev) => ({ ...prev, submission: true }));
    setError(null);

    try {
      if (!selectedQuotationId) {
        setError("Veuillez sélectionner un devis accepté.");
        setLoading((prev) => ({ ...prev, submission: false }));
        return;
      }

      if (orderClientItems.length === 0) {
        setError("La commande doit contenir au moins un produit.");
        setLoading((prev) => ({ ...prev, submission: false }));
        return;
      }

      const orderDto = {
        orderNumber,
        orderDate,
        deliveryDate,
        paymentTerms,
        notes,
        clientName,
        quotationId: selectedQuotationId,
        orderClientItems,
        ht: parseFloat(calculateHT()),
        tva: parseFloat(calculateTVA()),
        ttc: parseFloat(calculateTTC()),
      };

      const createdOrder = await createOrder(orderDto);

      if (createdOrder) {
        setSuccessModalOpen(true);
        setTimeout(() => navigate("/client-orders"), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Échec de la création de la commande"
      );
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  return (
    <DashboardLayout>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "90%",
          maxWidth: 1200,
          margin: "auto",
          mt: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Création de Commande Client
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {loading.quotations ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Devis Accepté</InputLabel>
                <Select
                  value={selectedQuotationId}
                  onChange={(e) => handleQuotationSelect(e.target.value)}
                  label="Devis Accepté"
                >
                  <MenuItem value="">
                    <em>Sélectionner un devis</em>
                  </MenuItem>
                  {acceptedQuotations.map((quotation) => (
                    <MenuItem key={quotation.id} value={quotation.id}>
                      {quotation.reference} -{" "}
                      {quotation.clientName || "Client inconnu"} -{" "}
                      {quotation.totalTTC
                        ? `${quotation.totalTTC.toFixed(2)} TND`
                        : "0.00 TND"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 🔹 Nouveau champ pour le nom du client */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Client"
                fullWidth
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nom du client"
              />
            </Grid>

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
                label="Date de livraison"
                type="date"
                fullWidth
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getTodayISO() }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Conditions de paiement</InputLabel>
                <Select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  label="Conditions de paiement"
                >
                  <MenuItem value="30j">30 jours fin de mois</MenuItem>
                  <MenuItem value="45j">45 jours fin de mois</MenuItem>
                  <MenuItem value="60j">60 jours fin de mois</MenuItem>
                  <MenuItem value="comptant">Paiement comptant</MenuItem>
                  <MenuItem value="acompte">Acompte + solde</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 🧾 Tableau custom <table>/<th>/<td> */}
            <Grid item xs={12}>
              <Box
                component={Paper}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  mt: 1,
                }}
              >
                <Box sx={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: "900px",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f5f7fa",
                          height: "56px",
                        }}
                      >
                        <th style={thStyle}>Service</th>
                        <th style={thStyle}>Quantité</th>
                        <th style={thStyle}>Prix Unitaire</th>
                        <th style={thStyle}>Remise (%)</th>
                        <th style={thStyle}>Total HT</th>
                        <th style={{ ...thStyle, textAlign: "center" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderClientItems.length > 0 ? (
                        orderClientItems.map((item, index) => (
                          <tr
                            key={index}
                            style={{
                              borderBottom: "1px solid #eee",
                              backgroundColor:
                                index % 2 === 0 ? "#ffffff" : "#fafbfc",
                            }}
                          >
                            <td style={tdStyle}>
                              <TextField
                                fullWidth
                                size="small"
                                value={item.productName}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "productName",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td style={tdStyle}>
                              <TextField
                                type="number"
                                fullWidth
                                size="small"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                                inputProps={{ min: 0 }}
                              />
                            </td>
                            <td style={tdStyle}>
                              <TextField
                                type="number"
                                fullWidth
                                size="small"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "unitPrice",
                                    Number(e.target.value)
                                  )
                                }
                                inputProps={{ min: 0, step: "0.01" }}
                              />
                            </td>
                            <td style={tdStyle}>
                              <TextField
                                type="number"
                                fullWidth
                                size="small"
                                value={item.discount}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "discount",
                                    Number(e.target.value)
                                  )
                                }
                                inputProps={{ min: 0, max: 100 }}
                              />
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                fontWeight: 600,
                                textAlign: "right",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {(
                                item.quantity *
                                item.unitPrice *
                                (1 - (item.discount || 0) / 100)
                              ).toFixed(2)}{" "}
                              TND
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "center",
                              }}
                            >
                              <Tooltip title="Supprimer">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleDeleteItem(index)}
                                  aria-label="supprimer"
                                  sx={{ ml: 0.5 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            style={{
                              padding: "20px",
                              textAlign: "center",
                              color: "#777",
                              fontSize: "0.9rem",
                            }}
                          >
                            Aucun article dans la commande. Sélectionnez un
                            devis ou ajoutez un service.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Box>
              </Box>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                sx={{ mt: 2 }}
              >
                Ajouter un service
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* 🔹 NOUVEAU : Section des totaux HT, TVA, TTC */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={12} md={3}>
                  <Typography variant="h6" align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Total HT: {calculateHT()} TND
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="h6" align="right" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    TVA (19%): {calculateTVA()} TND
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="h5" align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Total TTC: {calculateTTC()} TND
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right", mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={onSubmit}
                disabled={loading.submission}
                sx={{ mr: 2 }}
              >
                {loading.submission ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Valider la commande"
                )}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePreviewPDF}
              >
                Prévisualiser PDF
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Modal de prévisualisation PDF */}
        <Modal
          open={showPDFPreview}
          onClose={() => setShowPDFPreview(false)}
          aria-labelledby="pdf-preview-modal"
        >
          <Box sx={previewModalStyle}>
            <Typography variant="h5" gutterBottom>
              Aperçu du PDF de la commande
            </Typography>
            <PDFViewer width="100%" height="90%">
              <OrderPDF
                orderData={{
                  orderNumber,
                  orderDate,
                  deliveryDate,
                  paymentTerms,
                  notes,
                  clientName,
                  items: orderClientItems,
                  ht: calculateHT(),
                  tva: calculateTVA(),
                  ttc: calculateTTC(),
                }}
              />
            </PDFViewer>
            <Button
              variant="contained"
              onClick={() => setShowPDFPreview(false)}
              sx={{ mt: 2 }}
            >
              Fermer
            </Button>
          </Box>
        </Modal>

        {/* Modal de confirmation de succès */}
        <Modal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          aria-labelledby="success-modal"
        >
          <Box sx={confirmationModalStyle}>
            <Typography variant="h6" gutterBottom align="center">
              Commande créée avec succès !
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              Redirection vers la liste des commandes...
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          </Box>
        </Modal>
      </Paper>
    </DashboardLayout>
  );
};

const thStyle = {
  padding: "0 16px",
  fontWeight: 600,
  fontSize: "0.875rem",
  textAlign: "left",
  borderBottom: "2px solid #e0e0e0",
  color: "#333",
};

const tdStyle = {
  padding: "10px 16px",
  fontSize: "0.85rem",
  color: "#444",
  verticalAlign: "middle",
};

const previewModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  height: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: "none",
};

const confirmationModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: "none",
};

export default CreateClientOrder;