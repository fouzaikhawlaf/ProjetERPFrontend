// src/components/DeliveryNoteDetailsDialog.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";

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

const DeliveryNoteDetailsDialog = ({ open, onClose, deliveryNote }) => {
  const note = deliveryNote || {};

  let items = note.items || note.Items || [];
  if (items && !Array.isArray(items) && items.$values) {
    items = items.$values;
  }
  if (!Array.isArray(items)) {
    items = [];
  }

  const totalHT = note.totalHT ?? note.TotalHT ?? 0;
  const totalTVA = note.totalTVA ?? note.TotalTVA ?? 0;
  const totalTTC = note.totalTTC ?? note.TotalTTC ?? 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Détails du bon de livraison #{note.deliveryNumber || note.id}
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <Box sx={{ flex: "1 1 260px" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Informations générales
            </Typography>
            <Typography variant="body2">
              <strong>N° BL :</strong>{" "}
              {note.deliveryNumber || note.id}
            </Typography>
            <Typography variant="body2">
              <strong>Commande client :</strong>{" "}
              {note.orderClientId}
            </Typography>
            <Typography variant="body2">
              <strong>Date de livraison :</strong>{" "}
              {formatDate(note.deliveryDate)}
            </Typography>
            {note.deliveryMode && (
              <Typography variant="body2">
                <strong>Mode de livraison :</strong>{" "}
                {note.deliveryMode}
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: "1 1 260px" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Statut
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={note.isDelivered ? "Livré" : "En préparation"}
                color={note.isDelivered ? "success" : "warning"}
                size="small"
              />
              {note.isArchived && (
                <Chip
                  label="Archivé"
                  color="default"
                  size="small"
                />
              )}
              {note.status && (
                <Chip
                  label={note.status}
                  color="info"
                  size="small"
                />
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Montants
              </Typography>
              <Typography variant="body2">
                <strong>Total HT :</strong> {formatCurrency(totalHT)} TND
              </Typography>
              <Typography variant="body2">
                <strong>Total TVA :</strong> {formatCurrency(totalTVA)} TND
              </Typography>
              <Typography variant="body2">
                <strong>Total TTC :</strong> {formatCurrency(totalTTC)} TND
              </Typography>
            </Box>
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Articles livrés
          </Typography>

          {items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucun article pour ce bon de livraison.
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
                  <th style={cellHeader}>Désignation</th>
                  <th style={{ ...cellHeader, width: "10%" }}>Qté</th>
                  <th style={{ ...cellHeader, width: "18%" }}>PU HT</th>
                  <th style={{ ...cellHeader, width: "18%" }}>Total HT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const qty = item.quantity ?? item.Quantity ?? 0;
                  const unitPrice =
                    item.unitPrice ?? item.price ?? item.Price ?? 0;
                  const lineHT =
                    item.lineTotalHT ??
                    item.LineTotalHT ??
                    qty * unitPrice;

                  return (
                    <tr key={idx}>
                      <td style={cellBody}>
                        {item.productName ||
                          item.ProductName ||
                          item.designation ||
                          `Produit #${item.productId || item.ProductId || ""}`}
                      </td>
                      <td
                        style={{
                          ...cellBody,
                          textAlign: "center",
                        }}
                      >
                        {qty}
                      </td>
                      <td
                        style={{
                          ...cellBody,
                          textAlign: "right",
                        }}
                      >
                        {formatCurrency(unitPrice)}
                      </td>
                      <td
                        style={{
                          ...cellBody,
                          textAlign: "right",
                        }}
                      >
                        {formatCurrency(lineHT)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
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

DeliveryNoteDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deliveryNote: PropTypes.object,
};

export default DeliveryNoteDetailsDialog;
