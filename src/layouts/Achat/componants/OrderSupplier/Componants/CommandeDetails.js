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
  Chip,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Description,
  AttachMoney,
  Person,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
  PictureAsPdf,
  Edit,
  Delete,
  Clear,
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import orderSupplierService from "services/orderSupplierService";

// 0 Draft | 1 Validated | 2 Delivered | 3 Invoiced | 4 Cancelled | 5 Pending | 6 Confirmed | 7 Approved | 8 Rejected
const ORDER_STATUS = {
  DRAFT: 0,
  VALIDATED: 1,
  DELIVERED: 2,
  INVOICED: 3,
  CANCELLED: 4,
  PENDING: 5,
  CONFIRMED: 6,
  APPROVED: 7,
  REJECTED: 8,

  getLabel: (s) => {
    switch (Number(s)) {
      case 0: return "Brouillon";
      case 1: return "Validée";
      case 2: return "Livrée";
      case 3: return "Facturée";
      case 4: return "Annulée";
      case 5: return "En attente";
      case 6: return "Confirmée";
      case 7: return "Approuvée";
      case 8: return "Rejetée";
      default: return `Statut ${s}`;
    }
  },
  getColor: (s) => {
    switch (Number(s)) {
      case 0: return "default";
      case 1: return "info";
      case 2: return "info";
      case 3: return "primary";
      case 4: return "default";
      case 5: return "warning";
      case 6: return "info";
      case 7: return "success";
      case 8: return "error";
      default: return "default";
    }
  },
  getIcon: (s) => {
    switch (Number(s)) {
      case 2:
      case 3:
      case 7:
        return <CheckCircle />;
      case 4:
      case 8:
        return <Cancel />;
      case 0:
      case 1:
      case 5:
      case 6:
      default:
        return <Schedule />;
    }
  },
};

const nf3 = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const nf2 = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function unwrapDotNetList(maybe) {
  if (!maybe) return [];
  if (Array.isArray(maybe)) return maybe;
  if (maybe.$values) return maybe.$values;
  return [];
}

const CommandeDetailsDialog = ({ open, onClose, commandeId, onCommandeUpdated }) => {
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (open && commandeId != null) loadCommande();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, commandeId]);

  const loadCommande = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderSupplierService.getOrderById(commandeId);
      setCommande(data);
    } catch (err) {
      setError(err?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!commande) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      `COMMANDE FOURNISSEUR — ${commande.orderNumber || commande.id}`,
      pageWidth / 2,
      18,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Fournisseur: ${commande.supplierName || "Non spécifié"} (ID: ${commande.supplierId ?? "-"})`,
      14,
      30
    );
    doc.text(
      `Date commande: ${
        commande.orderDate ? new Date(commande.orderDate).toLocaleDateString("fr-FR") : "-"
      }`,
      14,
      36
    );
    doc.text(
      `Date livraison: ${
        commande.expectedDeliveryDate
          ? new Date(commande.expectedDeliveryDate).toLocaleDateString("fr-FR")
          : "-"
      }`,
      14,
      42
    );
    doc.text(`Statut: ${ORDER_STATUS.getLabel(commande.status)}`, 14, 48);

    // Lignes du tableau (items)
    const rows = unwrapDotNetList(commande.items).map((it, idx) => [
      idx + 1,
      it.productName || "-",
      nf2.format(Number(it.quantity || 0)),
      nf3.format(Number(it.price || 0)),
      `${nf2.format(Number(it.tva ?? it.tvaRate ?? 0))}%`,
      nf3.format(Number(it.quantity || 0) * Number(it.price || 0)),
    ]);

    doc.autoTable({
      startY: 56,
      head: [["#", "Désignation", "Qté", "P.U. HT", "TVA", "Total HT"]],
      body: rows,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    let y = doc.lastAutoTable?.finalY || 56;
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text(`Total HT: ${nf3.format(commande.purchaseAmount ?? 0)} TND`, 140, y);
    y += 6;
    doc.text(`Total TVA: ${nf3.format(commande.totalTVA ?? 0)} TND`, 140, y);
    y += 6;
    doc.text(`Total TTC: ${nf3.format(commande.totalAmount ?? 0)} TND`, 140, y);

    doc.save(`Commande_${commande.orderNumber || commande.id}.pdf`);
  };

  const handleDelete = () => setDeleteDialogOpen(true);

  const confirmDelete = async () => {
    try {
      await orderSupplierService.deleteOrder(commandeId);
      setDeleteDialogOpen(false);
      onCommandeUpdated?.();
      onClose?.();
    } catch (err) {
      setError(err?.message || "Suppression impossible");
    }
  };

  const openStatusDialog = () => {
    setStatus(Number(commande?.status ?? 0));
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    try {
      await orderSupplierService.updateOrderStatus(commandeId, Number(status));
      setStatusDialogOpen(false);
      await loadCommande();
      onCommandeUpdated?.();
    } catch (err) {
      setError(err?.message || "Mise à jour du statut impossible");
    }
  };

  const getChipColor = (s) => ORDER_STATUS.getColor(s);
  const getChipIcon = (s) => ORDER_STATUS.getIcon(s);
  const getStatusLabel = (s) => ORDER_STATUS.getLabel(s);

  if (!open) return null;

  const items = unwrapDotNetList(commande?.items);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
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
          <Avatar
            sx={{
              bgcolor: "#fff",
              mr: 2,
              width: 40,
              height: 40,
              border: "2px solid #e0e0e0",
            }}
          >
            {getChipIcon(commande?.status)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Commande {commande?.orderNumber || commande?.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getStatusLabel(commande?.status)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !commande ? (
          <Alert severity="warning">Commande non trouvée</Alert>
        ) : (
          <Grid container spacing={2}>
            {/* Informations générales */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <Description sx={{ mr: 1 }} /> Informations générales
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Numéro de commande:</strong> {commande.orderNumber || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Date de commande:</strong>{" "}
                      {commande.orderDate ? new Date(commande.orderDate).toLocaleDateString("fr-FR") : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Date de livraison prévue:</strong>{" "}
                      {commande.expectedDeliveryDate
                        ? new Date(commande.expectedDeliveryDate).toLocaleDateString("fr-FR")
                        : "Non spécifiée"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Fournisseur:</strong>{" "}
                      {commande.supplierName || `Fournisseur ${commande.supplierId ?? ""}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Statut:</strong>
                      <Chip
                        label={getStatusLabel(commande.status)}
                        size="small"
                        color={getChipColor(commande.status)}
                        sx={{ ml: 1 }}
                        icon={getChipIcon(commande.status)}
                        onClick={openStatusDialog}
                        style={{ cursor: "pointer" }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Notes */}
            {commande.notes && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1, display: "flex", alignItems: "center" }}
                  >
                    <Person sx={{ mr: 1 }} /> Notes
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#f9f9f9",
                      p: 2,
                      borderRadius: 1,
                      borderLeft: "3px solid #1976d2",
                    }}
                  >
                    <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                      {commande.notes}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Articles */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <Receipt sx={{ mr: 1 }} /> Articles ({items.length})
                </Typography>
                {items.length > 0 ? (
                  <List dense>
                    {items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ flexDirection: "column", alignItems: "flex-start", py: 1 }}>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography fontWeight="medium">
                              {item.productName || "Article sans nom"}
                            </Typography>
                            <Typography fontWeight="bold">
                              {nf3.format((Number(item.quantity) || 0) * (Number(item.price) || 0))} TND
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
                              {nf2.format(Number(item.quantity || 0))} x {nf3.format(Number(item.price || 0))} TND
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              TVA: {nf2.format(Number(item.tva ?? item.tvaRate ?? 0))}%
                            </Typography>
                          </Box>
                        </ListItem>
                        {index < items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                    Aucun article dans cette commande
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Totaux */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <AttachMoney sx={{ mr: 1 }} /> Totaux
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography>Total HT:</Typography>
                      <Typography fontWeight="bold">
                        {nf3.format(Number(commande.purchaseAmount ?? 0))} TND
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography>Total TVA:</Typography>
                      <Typography fontWeight="bold">{nf3.format(Number(commande.totalTVA ?? 0))} TND</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1,
                        borderTop: "2px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="h6">Total TTC:</Typography>
                      <Typography variant="h6" color="primary">
                        {nf3.format(Number(commande.totalAmount ?? commande.totalTTC ?? 0))} TND
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 1 }}>
          Fermer
        </Button>
        <Button
          startIcon={<PictureAsPdf />}
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1 }}
        >
          Télécharger PDF
        </Button>
        <Button
          startIcon={<Edit />}
          onClick={() => {
            onClose?.(); // laisse le parent gérer l'édition
          }}
          variant="outlined"
          sx={{ borderRadius: 1 }}
        >
          Modifier
        </Button>
        <Button
          startIcon={<Delete />}
          onClick={handleDelete}
          variant="outlined"
          color="error"
          sx={{ borderRadius: 1 }}
        >
          Supprimer
        </Button>
      </DialogActions>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f7fa",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          Confirmer la suppression
          <IconButton onClick={() => setDeleteDialogOpen(false)}>
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          Êtes-vous sûr de vouloir supprimer la commande {commande?.orderNumber || commande?.id} ?
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" sx={{ borderRadius: 1 }}>
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" sx={{ borderRadius: 1 }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de changement de statut */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f7fa",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          Changer le statut
          <IconButton onClick={() => setStatusDialogOpen(false)}>
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <TextField
            select
            fullWidth
            label="Statut"
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            sx={{ mt: 2 }}
          >
            <MenuItem value={0}>Brouillon</MenuItem>
            <MenuItem value={1}>Validée</MenuItem>
            <MenuItem value={2}>Livrée</MenuItem>
            <MenuItem value={3}>Facturée</MenuItem>
            <MenuItem value={4}>Annulée</MenuItem>
            <MenuItem value={5}>En attente</MenuItem>
            <MenuItem value={6}>Confirmée</MenuItem>
            <MenuItem value={7}>Approuvée</MenuItem>
            <MenuItem value={8}>Rejetée</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button onClick={() => setStatusDialogOpen(false)} variant="outlined" sx={{ borderRadius: 1 }}>
            Annuler
          </Button>
          <Button onClick={confirmStatusChange} color="primary" variant="contained" sx={{ borderRadius: 1 }}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

CommandeDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commandeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onCommandeUpdated: PropTypes.func,
};

export default CommandeDetailsDialog;
