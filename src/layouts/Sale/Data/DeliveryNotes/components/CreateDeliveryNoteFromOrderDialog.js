// src/components/CreateDeliveryNoteFromOrderDialog.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { createDeliveryNoteFromOrder } from "services/deliveryNoteService";

const CreateDeliveryNoteFromOrderDialog = ({
  open,
  onClose,
  deliveredOrders,
  onCreated,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value || 0);

  const formatDate = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("fr-FR");
  };

  const safeOrders = Array.isArray(deliveredOrders) ? deliveredOrders : [];

  const selectedOrder =
    selectedOrderId && safeOrders.length > 0
      ? safeOrders.find((o) => Number(o.id) === Number(selectedOrderId))
      : null;

  const getOrderItems = (order) => {
    if (!order) return [];

    let items =
      order.orderClientItems ||
      order.OrderClientItems ||
      order.items ||
      order.Items;

    if (items && !Array.isArray(items) && items.$values) {
      items = items.$values;
    }

    return Array.isArray(items) ? items : [];
  };

  const orderItems = getOrderItems(selectedOrder);

  const computedItems = orderItems.map((item) => {
    const qty = item.quantity ?? item.Quantity ?? 0;
    const unitPrice = item.unitPrice ?? item.price ?? item.Price ?? 0;
    const discount = item.discount ?? item.Discount ?? 0;
    const tvaRate = item.tvaRate ?? item.TvaRate ?? item.TVARate ?? 0;

    const brutHT = qty * unitPrice;
    const htAfterDiscount = brutHT * (1 - discount / 100.0);
    const tva = htAfterDiscount * (tvaRate / 100.0);
    const ttc = htAfterDiscount + tva;

    return {
      raw: item,
      qty,
      unitPrice,
      discount,
      tvaRate,
      lineHT: htAfterDiscount,
      lineTVA: tva,
      lineTTC: ttc,
    };
  });

  const totals = computedItems.reduce(
    (acc, it) => {
      acc.totalHT += it.lineHT;
      acc.totalTVA += it.lineTVA;
      acc.totalTTC += it.lineTTC;
      return acc;
    },
    { totalHT: 0, totalTVA: 0, totalTTC: 0 }
  );

  const handleSubmit = async () => {
    if (!selectedOrderId || !deliveryDate || !deliveryMode) {
      enqueueSnackbar(
        "Veuillez sélectionner une commande, un mode et une date de livraison",
        { variant: "warning" }
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "[CreateDeliveryNoteFromOrderDialog] Appel API createDeliveryNoteFromOrder...",
        { selectedOrderId, deliveryDate }
      );

      const note = await createDeliveryNoteFromOrder(
        Number(selectedOrderId),
        deliveryDate
      );

      console.log(
        "[CreateDeliveryNoteFromOrderDialog] Réponse API OK",
        note
      );

      enqueueSnackbar("Bon de livraison créé avec succès", {
        variant: "success",
      });

      setSelectedOrderId("");
      setDeliveryDate("");
      setDeliveryMode("");

      if (onCreated) onCreated(note);
      if (onClose) onClose();
    } catch (error) {
      console.error("Erreur création BL depuis commande :", error);
      enqueueSnackbar("Erreur lors de la création du bon de livraison", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Créer un bon de livraison</DialogTitle>

      <DialogContent dividers>
        {/* Informations générales */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Informations générales
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              select
              label="Commande livrée"
              fullWidth
              size="small"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              helperText={
                safeOrders.length === 0
                  ? "Aucune commande livrée disponible"
                  : "Sélectionnez une commande livrée"
              }
            >
              {safeOrders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  {(order.orderNumber || `Cmd #${order.id}`) +
                    " - " +
                    (order.clientName ||
                      order.customerName ||
                      `Client ${
                        order.clientId || order.customerId || ""
                      }`)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date de livraison"
              type="date"
              size="small"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />

            <TextField
              select
              label="Mode de livraison"
              size="small"
              value={deliveryMode}
              onChange={(e) => setDeliveryMode(e.target.value)}
              sx={{ minWidth: 220 }}
              helperText="Ex: Livraison standard, Express, Retrait sur place"
            >
              <MenuItem value="Standard">Livraison standard</MenuItem>
              <MenuItem value="Express">Livraison express</MenuItem>
              <MenuItem value="Retrait">Retrait sur place</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Détails commande + montants + articles */}
        {selectedOrder && (
          <>
            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              <Box sx={{ flex: "1 1 260px" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Détails de la commande
                </Typography>
                <Typography variant="body2">
                  <strong>N° commande :</strong>{" "}
                  {selectedOrder.orderNumber || selectedOrder.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Client :</strong>{" "}
                  {selectedOrder.clientName ||
                    selectedOrder.customerName ||
                    `Client ${
                      selectedOrder.clientId ||
                      selectedOrder.customerId ||
                      ""
                    }`}
                </Typography>
                <Typography variant="body2">
                  <strong>Date commande :</strong>{" "}
                  {formatDate(selectedOrder.orderDate)}
                </Typography>
              </Box>

              <Box sx={{ flex: "1 1 260px" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Montants estimés du bon de livraison
                </Typography>
                <Typography variant="body2">
                  <strong>Total HT :</strong>{" "}
                  {formatCurrency(totals.totalHT)} TND
                </Typography>
                <Typography variant="body2">
                  <strong>Total TVA :</strong>{" "}
                  {formatCurrency(totals.totalTVA)} TND
                </Typography>
                <Typography variant="body2">
                  <strong>Total TTC :</strong>{" "}
                  {formatCurrency(totals.totalTTC)} TND
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2,
                maxHeight: 260,
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Articles de la commande
              </Typography>

              {computedItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun article disponible pour cette commande.
                </Typography>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.8rem",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f5f7fa" }}>
                      <th style={{ ...cellHeader, width: "26%" }}>
                        Désignation
                      </th>
                      <th style={{ ...cellHeader, width: "8%" }}>Qté</th>
                      <th style={{ ...cellHeader, width: "12%" }}>
                        PU HT
                      </th>
                      <th style={{ ...cellHeader, width: "10%" }}>
                        Remise %
                      </th>
                      <th style={{ ...cellHeader, width: "10%" }}>
                        TVA %
                      </th>
                      <th style={{ ...cellHeader, width: "14%" }}>
                        Total HT
                      </th>
                      <th style={{ ...cellHeader, width: "14%" }}>
                        Total TTC
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedItems.map((it, idx) => (
                      <tr key={idx}>
                        <td style={cellBody}>
                          {it.raw.designation ||
                            it.raw.productName ||
                            it.raw.serviceName ||
                            `Produit #${it.raw.productId || ""}`}
                        </td>
                        <td
                          style={{
                            ...cellBody,
                            textAlign: "center",
                          }}
                        >
                          {it.qty}
                        </td>
                        <td
                          style={{
                            ...cellBody,
                            textAlign: "right",
                          }}
                        >
                          {formatCurrency(it.unitPrice)}
                        </td>
                        <td
                          style={{
                            ...cellBody,
                            textAlign: "center",
                          }}
                        >
                          {it.discount}
                        </td>
                        <td
                          style={{
                            ...cellBody,
                            textAlign: "center",
                          }}
                        >
                          {it.tvaRate}
                        </td>
                        <td
                          style={{
                            ...cellBody,
                            textAlign: "right",
                          }}
                        >
                          {formatCurrency(it.lineHT)}
                        </td>
                        <td
                          style={{
                            ...cellBody,
                            textAlign: "right",
                          }}
                        >
                          {formatCurrency(it.lineTTC)}
                        </td>
                      </tr>
                    ))}

                    <tr style={{ backgroundColor: "#fafafa" }}>
                      <td
                        colSpan={5}
                        style={{
                          ...cellBody,
                          fontWeight: 600,
                          textAlign: "right",
                        }}
                      >
                        Totaux :
                      </td>
                      <td
                        style={{
                          ...cellBody,
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(totals.totalHT)}
                      </td>
                      <td
                        style={{
                          ...cellBody,
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(totals.totalTTC)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AddCircle />}
          disabled={
            loading ||
            !selectedOrderId ||
            !deliveryDate ||
            !deliveryMode ||
            safeOrders.length === 0
          }
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            "Créer le bon de livraison"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const cellHeader = {
  padding: "6px 8px",
  fontWeight: 600,
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

const cellBody = {
  padding: "6px 8px",
  borderBottom: "1px solid #f0f0f0",
};

CreateDeliveryNoteFromOrderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deliveredOrders: PropTypes.array.isRequired,
  onCreated: PropTypes.func,
};

export default CreateDeliveryNoteFromOrderDialog;
