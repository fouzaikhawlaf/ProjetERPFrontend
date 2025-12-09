import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { updateOrder } from "services/orderClientService";

// Même mapping de statuts que dans la liste
const ORDER_STATUS = [
  { value: 0, label: "Brouillon" },
  { value: 1, label: "Validée" },
  { value: 2, label: "Livrée" },
  { value: 3, label: "Facturée" },
  { value: 4, label: "Annulée" },
  { value: 5, label: "En attente" },
  { value: 6, label: "Confirmée" },
  { value: 7, label: "Approuvée" },
  { value: 8, label: "Rejetée" },
];

// Conditions de paiement (adapter si ton enum backend change)
const PAYMENT_TERMS_OPTIONS = [
  { value: 0, label: "30 jours fin de mois" },
  { value: 1, label: "45 jours fin de mois" },
  { value: 2, label: "60 jours fin de mois" },
  { value: 3, label: "Paiement comptant" },
];

const normalizeItems = (itemsData) => {
  if (!itemsData) return [];
  if (Array.isArray(itemsData)) return itemsData;
  if (itemsData && typeof itemsData === "object" && itemsData.$values)
    return itemsData.$values;
  return [];
};

const EditCommandeClientDialog = ({ open, onClose, commande, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Init formData + items à partir de la commande
  useEffect(() => {
    if (commande && open) {
      const normalizedItems = normalizeItems(commande.orderClientItems);

      setFormData({
        id: commande.id,
        orderNumber: commande.orderNumber || commande.OrderNumber || "",
        clientName:
          commande.clientName ||
          commande.customerName ||
          commande.clientId ||
          "",
        orderDate: commande.orderDate
          ? commande.orderDate.split("T")[0]
          : "",
        expectedDeliveryDate: commande.expectedDeliveryDate
          ? commande.expectedDeliveryDate.split("T")[0]
          : "",
        status:
          typeof commande.status === "number" ? commande.status : 0,
        paymentTerms:
          typeof commande.paymentTerms === "number"
            ? commande.paymentTerms
            : 0,
        discountAmount: commande.discountAmount || 0,
      });

      setItems(
        normalizedItems.map((item) => ({
          id: item.id,
          productId: item.productId ?? null,
          serviceId: item.serviceId ?? null,
          projectId: item.projectId ?? null,
          designation: item.designation || "",
          quantity: item.quantity || 1,
          price: item.price || 0,
          tvaRate: item.tvaRate || item.TVARate || 0,
          tva: item.tva || item.TVA || 0,
          totalHT: item.totalHT || item.TotalHT || null,
          totalTTC: item.totalTTC || item.TotalTTC || null,
        }))
      );
    }
  }, [commande, open]);

  if (!commande || !formData) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Calculs simples côté front (sans modifier les données envoyées)
  const calculateItemTotalHT = (item) => {
    if (item.totalHT != null) return Number(item.totalHT).toFixed(2);
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return (qty * price).toFixed(2);
  };

  const getTvaPercentage = (tvaRate) => {
    // Si ton enum TVAType est :
    // 0 = 0%, 1 = 5%, 2 = 7%, 3 = 19%
    switch (tvaRate) {
      case 1:
        return 0.05;
      case 2:
        return 0.07;
      case 3:
        return 0.19;
      default:
        return 0;
    }
  };

  const calculateItemTVA = (item) => {
    if (item.tva != null) return Number(item.tva).toFixed(2);
    const ht = Number(calculateItemTotalHT(item));
    const rate = getTvaPercentage(item.tvaRate);
    return (ht * rate).toFixed(2);
  };

  const calculateItemTotalTTC = (item) => {
    if (item.totalTTC != null) return Number(item.totalTTC).toFixed(2);
    const ht = Number(calculateItemTotalHT(item));
    const tva = Number(calculateItemTVA(item));
    return (ht + tva).toFixed(2);
  };

  const calculateTotalHT = () =>
    items
      .reduce((sum, item) => sum + Number(calculateItemTotalHT(item)), 0)
      .toFixed(2);

  const calculateTotalTVA = () =>
    items
      .reduce((sum, item) => sum + Number(calculateItemTVA(item)), 0)
      .toFixed(2);

  const calculateTotalTTC = () =>
    items
      .reduce((sum, item) => sum + Number(calculateItemTotalTTC(item)), 0)
      .toFixed(2);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // On part de la commande d’origine pour ne pas perdre de champs
      const payload = {
        ...commande,
        ...formData,
        status: Number(formData.status),
        paymentTerms: Number(formData.paymentTerms),
        discountAmount: Number(formData.discountAmount) || 0,
        // on ne touche PAS aux items, on garde ceux du backend
        orderClientItems: commande.orderClientItems,
      };

      await updateOrder(commande.id, payload);

      enqueueSnackbar("Commande client mise à jour avec succès", {
        variant: "success",
      });
      onUpdate && onUpdate();
      onClose();
    } catch (e) {
      console.error("Erreur update commande client :", e);
      enqueueSnackbar("Erreur lors de la mise à jour de la commande", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xl"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          width: "95vw",
          maxWidth: 1200,
          maxHeight: "95vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "white",
          py: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          ✏️ Modifier la commande client
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }} disabled={loading}>
          <Clear />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        <Grid container spacing={3}>
          {/* Informations générales */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main", mb: 3 }}
                >
                  Informations générales
                </Typography>
                <Grid container spacing={3}>
                  {/* Numéro commande */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Numéro commande"
                      fullWidth
                      value={formData.orderNumber}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  {/* Client */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Client"
                      fullWidth
                      value={formData.clientName}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  {/* Date de commande */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Date de commande"
                      fullWidth
                      type="date"
                      value={formData.orderDate || ""}
                      onChange={(e) =>
                        handleChange("orderDate", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Date de livraison prévue */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Date de livraison prévue"
                      fullWidth
                      type="date"
                      value={formData.expectedDeliveryDate || ""}
                      onChange={(e) =>
                        handleChange("expectedDeliveryDate", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Conditions de paiement */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Conditions de paiement</InputLabel>
                      <Select
                        label="Conditions de paiement"
                        value={formData.paymentTerms}
                        onChange={(e) =>
                          handleChange("paymentTerms", e.target.value)
                        }
                      >
                        {PAYMENT_TERMS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Statut */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Statut</InputLabel>
                      <Select
                        label="Statut"
                        value={formData.status ?? 0}
                        onChange={(e) =>
                          handleChange("status", e.target.value)
                        }
                      >
                        {ORDER_STATUS.map((s) => (
                          <MenuItem key={s.value} value={s.value}>
                            {s.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Remise éventuelle */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Remise (montant)"
                      fullWidth
                      type="number"
                      value={formData.discountAmount}
                      onChange={(e) =>
                        handleChange("discountAmount", e.target.value)
                      }
                      inputProps={{ min: 0, step: 0.001 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Articles de la commande (lecture seule) */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main" }}
                  >
                    Articles de la commande ({items.length})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Les lignes sont affichées en lecture seule.
                  </Typography>
                </Box>

                {items.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      Aucune ligne de commande.
                    </Typography>
                  </Box>
                ) : (
                  items.map((item, index) => (
                    <Card
                      key={item.id || index}
                      sx={{
                        mb: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2}>
                          {/* Désignation */}
                          <Grid item xs={12} md={4}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Désignation
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {item.designation || "N/A"}
                            </Typography>
                          </Grid>

                          {/* Quantité */}
                          <Grid item xs={4} md={2}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Quantité
                            </Typography>
                            <Typography variant="body1">
                              {item.quantity}
                            </Typography>
                          </Grid>

                          {/* Prix unitaire */}
                          <Grid item xs={4} md={2}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Prix unitaire
                            </Typography>
                            <Typography variant="body1">
                              {Number(item.price).toFixed(3)} TND
                            </Typography>
                          </Grid>

                          {/* TVA */}
                          <Grid item xs={4} md={2}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              TVA
                            </Typography>
                            <Typography variant="body1">
                              {calculateItemTVA(item)} TND
                            </Typography>
                          </Grid>

                          {/* Total HT / TTC */}
                          <Grid item xs={12} md={2}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: 0.5,
                              }}
                            >
                              <Chip
                                label={`HT: ${calculateItemTotalHT(item)} TND`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={`TTC: ${calculateItemTotalTTC(
                                  item
                                )} TND`}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Totaux */}
          {items.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Totaux de la commande
                  </Typography>
                  <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "grey.50",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body1">Total HT :</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {calculateTotalHT()} TND
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body1">Total TVA :</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {calculateTotalTVA()} TND
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="h6">Total TTC :</Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight="bold"
                          >
                            {calculateTotalTTC()} TND
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          justifyContent: "flex-end",
          gap: 2,
          backgroundColor: "grey.50",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: "8px", px: 3 }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: "8px", px: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : "Enregistrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditCommandeClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default EditCommandeClientDialog;
