import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  Paper,
  Divider,
  Avatar,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";
import {
  Clear,
  Receipt,
  Person,
  CalendarToday,
  AttachMoney,
  Inventory,
  PictureAsPdf,
} from "@mui/icons-material";
import {
  getOrderById,
  generateOrderPdf, // ✅ important
} from "services/orderClientService";

const ORDER_STATUS = {
  0: { label: "Brouillon", color: "default" },
  1: { label: "Validée", color: "info" },
  2: { label: "Livrée", color: "info" },
  3: { label: "Facturée", color: "primary" },
  4: { label: "Annulée", color: "default" },
  5: { label: "En attente", color: "warning" },
  6: { label: "Confirmée", color: "info" },
  7: { label: "Approuvée", color: "success" },
  8: { label: "Rejetée", color: "error" },
};

// 🔹 Normalisation générique des items (.NET / $values)
const normalizeItems = (itemsData) => {
  if (!itemsData) return [];
  if (Array.isArray(itemsData)) return itemsData;
  if (itemsData.$values && Array.isArray(itemsData.$values)) {
    return itemsData.$values;
  }
  if (typeof itemsData === "object") return [itemsData];
  return [];
};

const CommandeClientDetailsDialog = ({ open, onClose, commandeId }) => {
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!open || !commandeId) return;
      setLoading(true);
      try {
        const data = await getOrderById(commandeId);
        console.log("Détails commande client :", data);
        setCommande(data);
      } catch (e) {
        console.error("Erreur chargement commande client :", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, commandeId]);

  if (!open) return null;

  const handleDownloadPdf = async () => {
    try {
      await generateOrderPdf(commandeId);
    } catch (e) {
      console.error("Erreur génération PDF commande client :", e);
    }
  };

  const statusInfo = commande
    ? ORDER_STATUS[commande.status] || {
        label: `Statut ${commande.status}`,
        color: "default",
      }
    : null;

  // ✅ Utiliser orderClientItems / OrderClientItems / items
  const items = normalizeItems(
    commande?.orderClientItems ||
      commande?.OrderClientItems ||
      commande?.items
  );

  // 🔹 NOUVEAUX ATTRIBUTS BACKEND
  // SaleAmount = HT net, DiscountAmount = total remise, TotalTVA, TotalAmount = TTC
  const totalHT =
    commande?.saleAmount ??
    commande?.SaleAmount ??
    commande?.totalHT ??
    commande?.purchaseAmount ??
    0;

  const totalRemise =
    commande?.discountAmount ??
    commande?.DiscountAmount ??
    0;

  const totalTVA =
    commande?.totalTVA ??
    commande?.TotalTVA ??
    0;

  const totalTTC =
    commande?.totalTTC ??
    commande?.TotalAmount ??
    commande?.totalAmount ??
    0;

  const formatAmount = (value) =>
    Number(value || 0).toFixed(3) + " TND";

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("fr-FR")
      : "N/A";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f5f7fa",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
            <Receipt />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Commande Client{" "}
              {commande?.orderNumber ||
                commande?.OrderNumber ||
                commandeId}
            </Typography>
            {statusInfo && (
              <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        {loading ? (
          <Box
            sx={{
              minHeight: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : !commande ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography>Aucune donnée pour cette commande.</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {/* Infos générales */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <Person sx={{ mr: 1 }} /> Informations générales
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Client :</strong>{" "}
                      {commande.clientName ||
                        commande.customerName ||
                        commande.clientId ||
                        "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Numéro :</strong>{" "}
                      {commande.orderNumber ||
                        commande.OrderNumber ||
                        commande.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                      <strong>Date commande :</strong>{" "}
                      {formatDate(commande.orderDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                      <strong>Date livraison :</strong>{" "}
                      {formatDate(
                        commande.expectedDeliveryDate ||
                          commande.deliveryDate
                      )}
                    </Typography>
                  </Grid>
                  {commande.paymentTerms && (
                    <Grid item xs={12} md={6}>
                      <Typography>
                        <strong>Conditions de paiement :</strong>{" "}
                        {commande.paymentTerms}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Articles */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <Inventory sx={{ mr: 1 }} /> Articles ({items.length})
                </Typography>
                {items.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Aucun article dans cette commande.
                  </Typography>
                ) : (
                  <List dense>
                    {items.map((item, idx) => {
                      const quantity = item.quantity ?? 0;
                      const unitPrice =
                        item.unitPrice ?? item.price ?? 0;
                      const discount = item.discount ?? 0; // %
                      const lineTotal =
                        quantity *
                        unitPrice *
                        (1 - discount / 100);

                      return (
                        <React.Fragment key={idx}>
                          <ListItem
                            sx={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                              py: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography fontWeight="medium">
                                {item.designation ||
                                  item.productName ||
                                  `Ligne ${idx + 1}`}
                              </Typography>
                              <Typography fontWeight="bold">
                                {lineTotal.toFixed(3)} TND
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {quantity} x {unitPrice.toFixed(3)} TND
                                {discount > 0 &&
                                  ` (-${discount}% remise)`}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                TVA :{" "}
                                {item.tvaRate !== undefined
                                  ? `${item.tvaRate}%`
                                  : "0%"}
                              </Typography>
                            </Box>
                          </ListItem>
                          {idx < items.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Totaux */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <AttachMoney sx={{ mr: 1 }} /> Récapitulatif financier
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>Total HT :</Typography>
                    <Typography>{formatAmount(totalHT)}</Typography>
                  </Box>

                  {/* 🔹 Nouvelle ligne : Remise totale */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>Remise totale :</Typography>
                    <Typography>- {formatAmount(totalRemise)}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>Total TVA :</Typography>
                    <Typography>{formatAmount(totalTVA)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Total TTC :</Typography>
                    <Typography variant="h6" color="primary">
                      {formatAmount(totalTTC)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Notes éventuelles */}
            {commande.notes && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    Notes
                  </Typography>
                  <Typography variant="body2">
                    {commande.notes}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
        {commande && (
          <Button
            onClick={handleDownloadPdf}
            variant="contained"
            startIcon={<PictureAsPdf />}
          >
            Télécharger PDF
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

CommandeClientDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commandeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CommandeClientDetailsDialog;
