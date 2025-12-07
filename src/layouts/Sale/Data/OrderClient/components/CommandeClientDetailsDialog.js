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
  ListItemText,
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
import { getOrderById } from "services/orderClientService"; // ✅ Changé

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

const normalizeItems = (itemsData) => {
  if (!itemsData) return [];
  if (Array.isArray(itemsData)) return itemsData;
  if (itemsData.$values) return itemsData.$values;
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
    ? ORDER_STATUS[commande.status] || { label: `Statut ${commande.status}`, color: "default" }
    : null;

  const items = normalizeItems(commande?.items);

  const totalHT = commande?.totalHT ?? commande?.purchaseAmount ?? 0;
  const totalTVA = commande?.totalTVA ?? 0;
  const totalTTC = commande?.totalTTC ?? commande?.totalAmount ?? 0;

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
              Commande Client {commande?.orderNumber || commande?.OrderNumber || commandeId}
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
                      {commande.orderNumber || commande.OrderNumber || commande.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                      <strong>Date commande :</strong>{" "}
                      {commande.orderDate
                        ? new Date(commande.orderDate).toLocaleDateString("fr-FR")
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                      <strong>Date livraison :</strong>{" "}
                      {commande.expectedDeliveryDate
                        ? new Date(commande.expectedDeliveryDate).toLocaleDateString("fr-FR")
                        : "N/A"}
                    </Typography>
                  </Grid>
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
                    {items.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography fontWeight="medium">
                              {item.designation || item.productName || `Ligne ${idx + 1}`}
                            </Typography>
                            <Typography fontWeight="bold">
                              {((item.quantity || 0) * (item.price || 0)).toFixed(3)} TND
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
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity || 0} x {(item.price || 0).toFixed(3)} TND
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              TVA : {item.tvaRate ?? 0}%
                            </Typography>
                          </Box>
                        </ListItem>
                        {idx < items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Total HT :</Typography>
                    <Typography>{Number(totalHT).toFixed(3)} TND</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Total TVA :</Typography>
                    <Typography>{Number(totalTVA).toFixed(3)} TND</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Total TTC :</Typography>
                    <Typography variant="h6" color="primary">
                      {Number(totalTTC).toFixed(3)} TND
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
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
