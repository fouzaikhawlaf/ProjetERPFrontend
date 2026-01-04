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

const formatPercent = (value) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("fr-FR");
};

const DeliveryNoteDetailsDialog = ({ open, onClose, deliveryNote }) => {
  const note = deliveryNote || {};

  // ✅ items: accepte plusieurs noms + .NET $values
  let items =
    note.items ||
    note.Items ||
    note.deliveryNoteItems ||
    note.DeliveryNoteItems ||
    [];
  if (items && !Array.isArray(items) && items.$values) items = items.$values;
  if (!Array.isArray(items)) items = [];

  // ✅ Totaux du backend (si dispo)
  const totalHTApi = Number(note.totalHT ?? note.TotalHT ?? NaN);
  const totalTVAApi = Number(note.totalTVA ?? note.TotalTVA ?? NaN);
  const totalTTCApi = Number(note.totalTTC ?? note.TotalTTC ?? NaN);

  // ✅ Calculs depuis items
  const computed = items.reduce(
    (acc, item) => {
      const qty = Number(item.quantity ?? item.Quantity ?? 0);
      const unitPrice = Number(item.unitPrice ?? item.price ?? item.Price ?? 0);
      const discount = Number(item.discount ?? item.Discount ?? 0); // %
      const tvaRate = Number(item.tvaRate ?? item.TvaRate ?? item.TVARate ?? 0); // %

      const brutHT = qty * unitPrice;

      const lineHT = Number(
        item.lineTotalHT ??
          item.LineTotalHT ??
          brutHT * (1 - discount / 100)
      );

      const lineTVA = Number(
        item.lineTotalTVA ?? item.LineTotalTVA ?? lineHT * (tvaRate / 100)
      );

      const lineTTC = Number(
        item.lineTotalTTC ?? item.LineTotalTTC ?? lineHT + lineTVA
      );

      const discountAmount = brutHT - lineHT;

      acc.totalBrutHT += Number.isFinite(brutHT) ? brutHT : 0;
      acc.totalHT += Number.isFinite(lineHT) ? lineHT : 0;
      acc.totalTVA += Number.isFinite(lineTVA) ? lineTVA : 0;
      acc.totalTTC += Number.isFinite(lineTTC) ? lineTTC : 0;
      acc.totalDiscount += Number.isFinite(discountAmount) ? discountAmount : 0;

      // ✅ Remise moyenne pondérée: somme(brutHT * remise%) / somme(brutHT)
      acc.discountWeightedSum +=
        Number.isFinite(brutHT) && Number.isFinite(discount)
          ? brutHT * discount
          : 0;

      // ✅ Groupement par taux
      const rateKey = Number.isFinite(tvaRate) ? tvaRate.toFixed(2) : "0.00";

      // Base HT par taux (HT après remise)
      acc.htByRate[rateKey] = (acc.htByRate[rateKey] || 0) + (Number.isFinite(lineHT) ? lineHT : 0);

      // TVA par taux
      acc.tvaByRate[rateKey] = (acc.tvaByRate[rateKey] || 0) + (Number.isFinite(lineTVA) ? lineTVA : 0);

      return acc;
    },
    {
      totalBrutHT: 0,
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0,
      totalDiscount: 0,
      discountWeightedSum: 0,
      htByRate: {},
      tvaByRate: {},
    }
  );

  // ✅ Totaux affichés : API si présents, sinon calculés
  const totalHT = Number.isFinite(totalHTApi) ? totalHTApi : computed.totalHT;
  const totalTVA = Number.isFinite(totalTVAApi) ? totalTVAApi : computed.totalTVA;
  const totalTTC = Number.isFinite(totalTTCApi) ? totalTTCApi : computed.totalTTC;

  // ✅ Remise moyenne pondérée
  const avgDiscountPct =
    computed.totalBrutHT > 0 ? computed.discountWeightedSum / computed.totalBrutHT : 0;

  // ✅ HT par taux triée
  const htByRateEntries = Object.entries(computed.htByRate)
    .map(([rate, amount]) => ({ rate: Number(rate), amount }))
    .sort((a, b) => a.rate - b.rate);

  // ✅ TVA par taux triée
  const tvaByRateEntries = Object.entries(computed.tvaByRate)
    .map(([rate, amount]) => ({ rate: Number(rate), amount }))
    .sort((a, b) => a.rate - b.rate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { height: "80vh" } }}
    >
      <DialogTitle>
        Détails du bon de livraison #{note.deliveryNumber || note.id}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Box sx={{ flex: "1 1 260px" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Informations générales
            </Typography>
            <Typography variant="body2">
              <strong>N° BL :</strong> {note.deliveryNumber || note.id}
            </Typography>
            <Typography variant="body2">
              <strong>Commande client :</strong> {note.orderClientId}
            </Typography>
            <Typography variant="body2">
              <strong>Date de livraison :</strong> {formatDate(note.deliveryDate)}
            </Typography>
            {note.deliveryMode && (
              <Typography variant="body2">
                <strong>Mode de livraison :</strong> {note.deliveryMode}
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
              {note.isArchived && <Chip label="Archivé" color="default" size="small" />}
              {note.status && <Chip label={note.status} color="info" size="small" />}
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
            maxHeight: 450,
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
            <>
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
                    <th style={{ ...cellHeader, width: "8%" }}>Qté</th>
                    <th style={{ ...cellHeader, width: "12%" }}>PU HT</th>
                    <th style={{ ...cellHeader, width: "10%" }}>Remise</th>
                    <th style={{ ...cellHeader, width: "10%" }}>TVA</th>
                    <th style={{ ...cellHeader, width: "14%" }}>Total HT</th>
                    <th style={{ ...cellHeader, width: "14%" }}>Total TVA</th>
                    <th style={{ ...cellHeader, width: "14%" }}>Total TTC</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, idx) => {
                    const qty = Number(item.quantity ?? item.Quantity ?? 0);
                    const unitPrice = Number(item.unitPrice ?? item.price ?? item.Price ?? 0);
                    const discount = Number(item.discount ?? item.Discount ?? 0); // %
                    const tvaRate = Number(item.tvaRate ?? item.TvaRate ?? item.TVARate ?? 0); // %

                    const brutHT = qty * unitPrice;

                    const lineHT = Number(
                      item.lineTotalHT ??
                        item.LineTotalHT ??
                        brutHT * (1 - discount / 100)
                    );

                    const lineTVA = Number(
                      item.lineTotalTVA ?? item.LineTotalTVA ?? lineHT * (tvaRate / 100)
                    );

                    const lineTTC = Number(
                      item.lineTotalTTC ?? item.LineTotalTTC ?? lineHT + lineTVA
                    );

                    return (
                      <tr key={idx}>
                        <td style={cellBody}>
                          {item.productName ||
                            item.ProductName ||
                            item.designation ||
                            `Produit #${item.productId || item.ProductId || ""}`}
                        </td>

                        <td style={{ ...cellBody, textAlign: "center" }}>{qty}</td>

                        <td style={{ ...cellBody, textAlign: "right" }}>
                          {formatCurrency(unitPrice)}
                        </td>

                        <td style={{ ...cellBody, textAlign: "right" }}>
                          {discount ? `${formatPercent(discount)}%` : "—"}
                        </td>

                        <td style={{ ...cellBody, textAlign: "right" }}>
                          {tvaRate ? `${formatPercent(tvaRate)}%` : "—"}
                        </td>

                        <td style={{ ...cellBody, textAlign: "right" }}>
                          {formatCurrency(lineHT)}
                        </td>

                        <td style={{ ...cellBody, textAlign: "right" }}>
                          {formatCurrency(lineTVA)}
                        </td>

                        <td style={{ ...cellBody, textAlign: "right", fontWeight: 700 }}>
                          {formatCurrency(lineTTC)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ✅ Résumé: HT par taux + TVA par taux + Totaux */}
              <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                {/* Base HT par taux */}
                <Box sx={{ minWidth: 280 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    Base HT par taux TVA
                  </Typography>

                  {htByRateEntries.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Aucune base HT.
                    </Typography>
                  ) : (
                    htByRateEntries.map((x) => (
                      <Typography
                        key={x.rate}
                        variant="body2"
                        sx={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span>{formatPercent(x.rate)}%</span>
                        <span>{formatCurrency(x.amount)} TND</span>
                      </Typography>
                    ))
                  )}
                </Box>

                {/* TVA par taux */}
                <Box sx={{ minWidth: 280 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    TVA par taux
                  </Typography>

                  {tvaByRateEntries.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Aucune TVA.
                    </Typography>
                  ) : (
                    tvaByRateEntries.map((x) => (
                      <Typography
                        key={x.rate}
                        variant="body2"
                        sx={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span>{formatPercent(x.rate)}%</span>
                        <span>{formatCurrency(x.amount)} TND</span>
                      </Typography>
                    ))
                  )}
                </Box>

                {/* Totaux */}
                <Box
                  sx={{
                    minWidth: 320,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    pt: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span><strong>Total brut HT :</strong></span>
                    <span>{formatCurrency(computed.totalBrutHT)} TND</span>
                  </Typography>

                  <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span><strong>Total remise :</strong></span>
                    <span>{formatCurrency(computed.totalDiscount)} TND</span>
                  </Typography>

                  <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span><strong>Remise moyenne :</strong></span>
                    <span>{formatPercent(avgDiscountPct)}%</span>
                  </Typography>

                  <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span><strong>Total HT :</strong></span>
                    <span>{formatCurrency(totalHT)} TND</span>
                  </Typography>

                  <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span><strong>Total TVA :</strong></span>
                    <span>{formatCurrency(totalTVA)} TND</span>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}
                  >
                    <span><strong>Total TTC :</strong></span>
                    <span>{formatCurrency(totalTTC)} TND</span>
                  </Typography>
                </Box>
              </Box>
            </>
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
