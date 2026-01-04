// src/components/CreateDeliveryNoteFromOrderDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import { AddCircle, Clear } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { createDeliveryNoteFromOrder } from "services/deliveryNoteService";

// --- helpers ---
const fmt3 = (value) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(Number(value || 0));

const formatDateFR = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("fr-FR");
};

const unwrapDotNetList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data?.$values && Array.isArray(data.$values)) return data.$values;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
};

const getOrderItems = (order) => {
  if (!order) return [];
  const raw =
    order.orderClientItems ||
    order.OrderClientItems ||
    order.items ||
    order.Items ||
    order.orderItems ||
    order.OrderItems;

  return unwrapDotNetList(raw);
};

const getItemDesignation = (raw) =>
  raw.designation ||
  raw.productName ||
  raw.ProductName ||
  raw.serviceName ||
  raw.ServiceName ||
  raw.name ||
  raw.Name ||
  `Produit #${raw.productId || raw.ProductId || ""}`;

const CreateDeliveryNoteFromOrderDialog = ({ open, onClose, deliveredOrders, onCreated }) => {
  const { enqueueSnackbar } = useSnackbar();

  const safeOrders = Array.isArray(deliveredOrders) ? deliveredOrders : [];

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [deliveryNumber, setDeliveryNumber] = useState(""); // ✅ NEW (frontend -> backend)
  const [loading, setLoading] = useState(false);

  // reset when open
  useEffect(() => {
    if (!open) return;
    setSelectedOrderId("");
    setDeliveryDate("");
    setDeliveryMode("");
    setDeliveryNumber("");
    setLoading(false);
  }, [open]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return safeOrders.find((o) => Number(o.id) === Number(selectedOrderId)) || null;
  }, [safeOrders, selectedOrderId]);

  const orderItems = useMemo(() => getOrderItems(selectedOrder), [selectedOrder]);

  // compute items (remise + tva) + totals
  const computed = useMemo(() => {
    const rows = orderItems.map((raw) => {
      const qty = Number(raw.quantity ?? raw.Quantity ?? 0);
      const unitPrice = Number(raw.unitPrice ?? raw.UnitPrice ?? raw.price ?? raw.Price ?? 0);
      const discount = Number(raw.discount ?? raw.Discount ?? 0); // %
      const tvaRate = Number(raw.tvaRate ?? raw.TvaRate ?? raw.TVARate ?? 0); // %

      const brutHT = qty * unitPrice;
      const htAfterDiscount = brutHT * (1 - discount / 100);
      const tva = htAfterDiscount * (tvaRate / 100);
      const ttc = htAfterDiscount + tva;

      return {
        raw,
        designation: getItemDesignation(raw),
        qty,
        unitPrice,
        discount,
        tvaRate,
        brutHT,
        lineHT: htAfterDiscount,
        lineTVA: tva,
        lineTTC: ttc,
      };
    });

    const totals = rows.reduce(
      (acc, r) => {
        acc.totalHT += r.lineHT;
        acc.totalTVA += r.lineTVA;
        acc.totalTTC += r.lineTTC;
        return acc;
      },
      { totalHT: 0, totalTVA: 0, totalTTC: 0 }
    );

    // TVA par taux + base HT par taux
    const byRate = {};
    rows.forEach((r) => {
      const rateKey = Number(r.tvaRate || 0).toFixed(2);
      if (!byRate[rateKey]) byRate[rateKey] = { rate: Number(r.tvaRate || 0), baseHT: 0, tva: 0, ttc: 0 };
      byRate[rateKey].baseHT += r.lineHT;
      byRate[rateKey].tva += r.lineTVA;
      byRate[rateKey].ttc += r.lineTTC;
    });

    const tvaByRate = Object.values(byRate).sort((a, b) => a.rate - b.rate);

    return { rows, totals, tvaByRate };
  }, [orderItems]);

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!selectedOrderId || !deliveryDate || !deliveryMode) {
      enqueueSnackbar("Veuillez sélectionner une commande, un mode et une date de livraison", {
        variant: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ on envoie deliveryMode + deliveryNumber si ton backend les accepte
      const note = await createDeliveryNoteFromOrder(
        Number(selectedOrderId),
        deliveryDate,
        deliveryMode,
        deliveryNumber || null
      );

      enqueueSnackbar(`Bon de livraison créé : ${note?.deliveryNumber || "N/A"}`, {
        variant: "success",
      });

      // reset
      setSelectedOrderId("");
      setDeliveryDate("");
      setDeliveryMode("");
      setDeliveryNumber("");

      onCreated?.(note);
      onClose?.();
    } catch (error) {
      console.error("Erreur création BL depuis commande :", error);
      enqueueSnackbar("Erreur lors de la création du bon de livraison", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          width: "95%",
          maxWidth: "1200px",
          height: "95vh",
          maxHeight: "900px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // removed purple background/color per request
          py: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          🚚 Créer un Bon de Livraison
        </Typography>
        <IconButton onClick={handleClose}>
           <Clear />
         </IconButton>
       </DialogTitle>

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        {/* Informations générales */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: "text.primary", mb: 3 }}>
              Informations Générales
            </Typography>
            {/* removed primary.main (violet) color */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Commande livrée *"
                  fullWidth
                  size="small"
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  helperText={
                    safeOrders.length === 0
                      ? "Aucune commande livrée disponible"
                      : "Sélectionnez une commande"
                  }
                  disabled={loading}
                >
                  {safeOrders.length === 0 ? (
                    <MenuItem disabled>Aucune commande livrée</MenuItem>
                  ) : (
                    safeOrders.map((order) => (
                      <MenuItem key={order.id} value={order.id}>
                        {(order.orderNumber || `Cmd #${order.id}`) +
                          " - " +
                          (order.clientName ||
                            order.customerName ||
                            `Client ${order.clientId || order.customerId || ""}`)}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Date de livraison *"
                  type="date"
                  fullWidth
                  size="small"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Mode de livraison *"
                  fullWidth
                  size="small"
                  value={deliveryMode}
                  onChange={(e) => setDeliveryMode(e.target.value)}
                  helperText="Standard / Express / Retrait"
                  disabled={loading}
                >
                  <MenuItem value="Standard">Livraison standard</MenuItem>
                  <MenuItem value="Express">Livraison express</MenuItem>
                  <MenuItem value="Retrait">Retrait sur place</MenuItem>
                </TextField>
              </Grid>

              {/* ✅ DeliveryNumber (si tu veux le saisir, sinon laisse vide et backend le génère) */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="N° Bon de livraison (optionnel)"
                  fullWidth
                  size="small"
                  value={deliveryNumber}
                  onChange={(e) => setDeliveryNumber(e.target.value)}
                  disabled={loading}
                  helperText="Laisse vide si le backend génère automatiquement"
                />
              </Grid>

              {selectedOrder && (
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "grey.50",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>N° commande :</strong> {selectedOrder.orderNumber || selectedOrder.id}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Client :</strong>{" "}
                      {selectedOrder.clientName ||
                        selectedOrder.customerName ||
                        `Client ${selectedOrder.clientId || selectedOrder.customerId || ""}`}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date commande :</strong> {formatDateFR(selectedOrder.orderDate)}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Détails commande + montants + articles */}
        {selectedOrder && (
          <>
            <Divider sx={{ mb: 2 }} />

            {/* Totaux */}
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: "text.primary", mb: 2 }}>
                  Montants estimés
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Chip label={`Total HT : ${fmt3(computed.totals.totalHT)} TND`} variant="outlined" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Chip label={`Total TVA : ${fmt3(computed.totals.totalTVA)} TND`} color="info" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Chip label={`Total TTC : ${fmt3(computed.totals.totalTTC)} TND`} color="success" variant="outlined" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* TVA par taux */}
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: "text.primary", mb: 2 }}>
                  TVA par taux
                </Typography>

                {computed.tvaByRate.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Aucun taux TVA trouvé.
                  </Typography>
                ) : (
                  <Box sx={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f5f7fa" }}>
                          <th style={cellHeader}>Taux</th>
                          <th style={{ ...cellHeader, textAlign: "right" }}>Base HT</th>
                          <th style={{ ...cellHeader, textAlign: "right" }}>TVA</th>
                          <th style={{ ...cellHeader, textAlign: "right" }}>TTC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {computed.tvaByRate.map((r) => (
                          <tr key={r.rate}>
                            <td style={cellBody}>{r.rate.toFixed(2)}%</td>
                            <td style={{ ...cellBody, textAlign: "right" }}>{fmt3(r.baseHT)} TND</td>
                            <td style={{ ...cellBody, textAlign: "right" }}>{fmt3(r.tva)} TND</td>
                            <td style={{ ...cellBody, textAlign: "right" }}>{fmt3(r.ttc)} TND</td>
                          </tr>
                        ))}
                        <tr style={{ backgroundColor: "#fafafa" }}>
                          <td style={{ ...cellBody, fontWeight: 700 }}>Totaux</td>
                          <td style={{ ...cellBody, textAlign: "right", fontWeight: 700 }}>{fmt3(computed.totals.totalHT)} TND</td>
                          <td style={{ ...cellBody, textAlign: "right", fontWeight: 700 }}>{fmt3(computed.totals.totalTVA)} TND</td>
                          <td style={{ ...cellBody, textAlign: "right", fontWeight: 700 }}>{fmt3(computed.totals.totalTTC)} TND</td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Articles */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: "text.primary", mb: 2 }}>
                  Articles de la commande ({computed.rows.length})
                </Typography>

                {computed.rows.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Aucun article disponible pour cette commande.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 330, overflowY: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                    <Box sx={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f5f7fa" }}>
                            <th style={{ ...cellHeader, width: "28%" }}>Désignation</th>
                            <th style={{ ...cellHeader, width: "8%" }}>Qté</th>
                            <th style={{ ...cellHeader, width: "12%" }}>PU HT</th>
                            <th style={{ ...cellHeader, width: "10%" }}>Remise %</th>
                            <th style={{ ...cellHeader, width: "10%" }}>TVA %</th>
                            <th style={{ ...cellHeader, width: "12%" }}>Total HT</th>
                            <th style={{ ...cellHeader, width: "12%" }}>TVA</th>
                            <th style={{ ...cellHeader, width: "12%" }}>Total TTC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {computed.rows.map((it, idx) => (
                            <tr key={idx}>
                              <td style={cellBody}>{it.designation}</td>
                              <td style={{ ...cellBody, textAlign: "center" }}>{it.qty}</td>
                              <td style={{ ...cellBody, textAlign: "right" }}>{fmt3(it.unitPrice)}</td>
                              <td style={{ ...cellBody, textAlign: "center" }}>{it.discount}</td>
                              <td style={{ ...cellBody, textAlign: "center" }}>{it.tvaRate}</td>
                              <td style={{ ...cellBody, textAlign: "right" }}>{fmt3(it.lineHT)}</td>
                              <td style={{ ...cellBody, textAlign: "right" }}>{fmt3(it.lineTVA)}</td>
                              <td style={{ ...cellBody, textAlign: "right" }}>{fmt3(it.lineTTC)}</td>
                            </tr>
                          ))}

                          <tr style={{ backgroundColor: "#fafafa" }}>
                            <td colSpan={5} style={{ ...cellBody, fontWeight: 700, textAlign: "right" }}>
                              Totaux :
                            </td>
                            <td style={{ ...cellBody, textAlign: "right", fontWeight: 700 }}>
                              {fmt3(computed.totals.totalHT)}
                            </td>
                            <td style={{ ...cellBody, textAlign: "right", fontWeight: 700 }}>
                              {fmt3(computed.totals.totalTVA)}
                            </td>
                            <td style={{ ...cellBody, textAlign: "right", fontWeight: 700 }}>
                              {fmt3(computed.totals.totalTTC)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 2, backgroundColor: "grey.50" }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined" sx={{ borderRadius: "8px", px: 3 }}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AddCircle />}
          disabled={loading || !selectedOrderId || !deliveryDate || !deliveryMode || safeOrders.length === 0}
          sx={{ borderRadius: "8px", px: 4 }}
        >
          {loading ? <CircularProgress size={20} /> : "Créer le bon de livraison"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const cellHeader = {
  padding: "10px 10px",
  fontWeight: 700,
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

const cellBody = {
  padding: "10px 10px",
  borderBottom: "1px solid #f0f0f0",
};

CreateDeliveryNoteFromOrderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deliveredOrders: PropTypes.array.isRequired,
  onCreated: PropTypes.func,
};

export default CreateDeliveryNoteFromOrderDialog;
