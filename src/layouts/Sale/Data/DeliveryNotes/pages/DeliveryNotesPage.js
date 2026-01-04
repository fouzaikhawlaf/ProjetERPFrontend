// src/layouts/Sale/Data/DeliveryNotes/pages/DeliveryNotesPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  PictureAsPdf,
  Delete,
  LocalShipping,
  Archive,
  AddCircle,
  Visibility,
  Edit,
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useSnackbar } from "notistack";

// ✅ PDF jsPDF
import { downloadDeliveryNotePdf as downloadDeliveryNotePdfJs } from "../pdf/DeliveryNotepdf";

import {
  getAllDeliveryNotes,
  getDeliveryNoteById,
  markOrderAsDelivered,
  deleteDeliveryNote,
  markDeliveryNoteAsArchived,
} from "services/deliveryNoteService";

import { getAllOrders } from "services/orderClientService";

import CreateDeliveryNoteFromOrderDialog from "../components/CreateDeliveryNoteFromOrderDialog";
import DeliveryNoteDetailsDialog from "../components/DeliveryNoteDetailsDialog";
import EditDeliveryNoteDialog from "../components/EditDeliveryNoteDialog";

// ✅ AJOUT dialogs confirm
import ConfirmDialog from "../components/ConfirmDialog";

const formatCurrency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value || 0);

const DeliveryNotesPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // ✅ Détails
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // ✅ Update
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ Confirm delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // ✅ Confirm archive
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [noteToArchive, setNoteToArchive] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const normalizeItems = (items) => {
    if (Array.isArray(items)) return items;
    if (Array.isArray(items?.$values)) return items.$values;
    if (Array.isArray(items?.items)) return items.items;
    if (typeof items === "string") {
      try {
        const parsed = JSON.parse(items);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const getNoteTotals = (note) => {
    const totalHT = Number(note?.totalHT ?? note?.TotalHT ?? NaN);
    const totalTVA = Number(note?.totalTVA ?? note?.TotalTVA ?? NaN);
    const totalTTC = Number(note?.totalTTC ?? note?.TotalTTC ?? NaN);

    const hasHT = Number.isFinite(totalHT);
    const hasTVA = Number.isFinite(totalTVA);
    const hasTTC = Number.isFinite(totalTTC);

    if (hasHT || hasTVA || hasTTC) {
      const ht = hasHT ? totalHT : 0;
      const tva = hasTVA ? totalTVA : 0;
      const ttc = hasTTC ? totalTTC : ht + tva;
      return { totalHT: ht, totalTVA: tva, totalTTC: ttc };
    }

    const items = normalizeItems(note?.items ?? note?.Items);
    let htSum = 0;
    let tvaSum = 0;

    items.forEach((item) => {
      const quantity = Number(item.quantity ?? item.Quantity ?? 0);
      const unitPrice = Number(item.unitPrice ?? item.price ?? item.Price ?? 0);
      const discount = Number(item.discount ?? item.Discount ?? 0);
      const tvaRate = Number(item.tvaRate ?? item.TvaRate ?? item.TVARate ?? 0);

      const lineHT = Number(
        item.lineTotalHT ??
          item.LineTotalHT ??
          quantity * unitPrice * (1 - discount / 100)
      );

      const lineTVA = (lineHT || 0) * (tvaRate / 100);

      htSum += Number.isFinite(lineHT) ? lineHT : 0;
      tvaSum += Number.isFinite(lineTVA) ? lineTVA : 0;
    });

    return { totalHT: htSum, totalTVA: tvaSum, totalTTC: htSum + tvaSum };
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notes = await getAllDeliveryNotes();
      setDeliveryNotes(notes || []);
      setFilteredNotes(notes || []);
    } catch (err) {
      console.error("Erreur chargement BL :", err);
      setError("Erreur lors du chargement des bons de livraison");
      enqueueSnackbar("Erreur lors du chargement des bons de livraison", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      const orders = await getAllOrders();
      const delivered = (orders || []).filter((o) => Number(o.status) === 2);
      setDeliveredOrders(delivered);
    } catch (err) {
      console.error("Erreur chargement commandes livrées :", err);
      enqueueSnackbar("Erreur lors du chargement des commandes livrées", {
        variant: "warning",
      });
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchDeliveredOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);

    if (!q) {
      setFilteredNotes(deliveryNotes);
      return;
    }

    const result = deliveryNotes.filter((note) =>
      Object.values(note).some((v) => v && v.toString().toLowerCase().includes(q))
    );
    setFilteredNotes(result);
  };

  const handleMarkAsDelivered = async (note) => {
    try {
      setIsLoading(true);
      await markOrderAsDelivered(note.orderClientId);
      enqueueSnackbar("Commande marquée comme livrée", { variant: "success" });

      setDeliveryNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, isDelivered: true } : n))
      );
      setFilteredNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, isDelivered: true } : n))
      );
    } catch (err) {
      console.error("Erreur markAsDelivered :", err);
      enqueueSnackbar("Erreur lors de la mise à jour de la livraison", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ OPEN delete confirm
  const handleAskDelete = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  // ✅ CONFIRM delete
  const handleConfirmDelete = async () => {
    if (!noteToDelete?.id) return;
    try {
      setIsLoading(true);
      await deleteDeliveryNote(noteToDelete.id);
      enqueueSnackbar("Bon de livraison supprimé", { variant: "success" });

      setDeliveryNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      setFilteredNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error("Erreur suppression BL :", err);
      enqueueSnackbar("Erreur lors de la suppression du bon de livraison", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ OPEN archive confirm
  const handleAskArchive = (note) => {
    setNoteToArchive(note);
    setArchiveDialogOpen(true);
  };

  // ✅ CONFIRM archive
  const handleConfirmArchive = async () => {
    if (!noteToArchive?.id) return;
    try {
      setIsLoading(true);
      await markDeliveryNoteAsArchived(noteToArchive.id);
      enqueueSnackbar("Bon de livraison archivé", { variant: "success" });

      setDeliveryNotes((prev) =>
        prev.map((n) => (n.id === noteToArchive.id ? { ...n, isArchived: true } : n))
      );
      setFilteredNotes((prev) =>
        prev.map((n) => (n.id === noteToArchive.id ? { ...n, isArchived: true } : n))
      );

      setArchiveDialogOpen(false);
      setNoteToArchive(null);
    } catch (err) {
      console.error("Erreur archivage BL :", err);
      enqueueSnackbar("Erreur lors de l'archivage du bon de livraison", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetails = async (note) => {
    try {
      setIsLoading(true);
      const fullNote = await getDeliveryNoteById(note.id);
      setSelectedNote(fullNote);
      setDetailsOpen(true);
    } catch (err) {
      console.error("Erreur chargement détails BL :", err);
      enqueueSnackbar("Erreur lors du chargement des détails du bon", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedNote(null);
  };

  const handleOpenEdit = (note) => {
    setEditId(note.id);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const handleDownloadPdf = async (note) => {
  try {
    setIsLoading(true);

    const fullNote = await getDeliveryNoteById(note.id);
    const items = normalizeItems(fullNote.items ?? fullNote.Items);

    // ✅ helper local
    const pick = (...vals) => {
      for (const v of vals) {
        const s = typeof v === "string" ? v.trim() : v;
        if (s) return s;
      }
      return "";
    };

    // ✅ client object possible (backend peut renvoyer OrderClient)
    const oc = fullNote.orderClient ?? fullNote.OrderClient ?? null;

    const clientName = pick(
      fullNote.clientName,
      fullNote.ClientName,
      note.clientName,
      note.ClientName,
      oc?.clientName,
      oc?.ClientName
    );

    const clientAddress = pick(
      fullNote.clientAddress,
      fullNote.ClientAddress,
      fullNote.address,
      fullNote.Address,
      oc?.address,
      oc?.Address,
      oc?.clientAddress,
      oc?.ClientAddress
    );

    const clientPhone = pick(
      fullNote.clientPhone,
      fullNote.ClientPhone,
      fullNote.phone,
      fullNote.Phone,
      oc?.phone,
      oc?.Phone
    );

    const clientEmail = pick(
      fullNote.clientEmail,
      fullNote.ClientEmail,
      fullNote.email,
      fullNote.Email,
      oc?.email,
      oc?.Email
    );

    const params = {
      deliveryNumber: pick(fullNote.deliveryNumber, fullNote.DeliveryNumber, note.deliveryNumber, note.DeliveryNumber),
      deliveryDate: pick(fullNote.deliveryDate, fullNote.DeliveryDate, note.deliveryDate, note.DeliveryDate),
      deliveryMode: pick(fullNote.deliveryMode, fullNote.DeliveryMode, note.deliveryMode, note.DeliveryMode),
      orderClientId: pick(fullNote.orderClientId, fullNote.OrderClientId, note.orderClientId, note.OrderClientId),

      // ✅ IMPORTANT: envoyer aussi address/phone/email
      clientName,
      clientAddress,
      clientPhone,
      clientEmail,

      items,
      totalHT: Number(fullNote.totalHT ?? fullNote.TotalHT ?? 0),
      totalTVA: Number(fullNote.totalTVA ?? fullNote.TotalTVA ?? 0),
      totalTTC: Number(fullNote.totalTTC ?? fullNote.TotalTTC ?? 0),
    };

    await downloadDeliveryNotePdfJs(params, `BL-${params.deliveryNumber || fullNote.id}.pdf`);
  } catch (err) {
    console.error("Erreur génération PDF :", err);
    enqueueSnackbar("Erreur lors de la génération du PDF", { variant: "error" });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des bons de livraison
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredNotes.length} bons de livraison trouvés
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => setCreateDialogOpen(true)}
              disabled={deliveredOrders.length === 0}
            >
              Nouveau bon de livraison
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ p: 2, mb: 3, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher par n° BL, n° commande..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1100px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f7fa", height: "60px" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>N° Bon</th>
                    <th style={thStyle}>Commande client</th>
                    <th style={thStyle}>Date de livraison</th>
                    <th style={thStyle}>Montant TTC</th>
                    <th style={thStyle}>Statut</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note, index) => {
                      const { totalTTC } = getNoteTotals(note);

                      return (
                        <tr key={note.id} style={{ borderBottom: "1px solid #eee", backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                          <td style={tdStyle}>{index + 1}</td>
                          <td style={tdStyle}>{note.deliveryNumber || note.id}</td>
                          <td style={tdStyle}>{note.orderClientId}</td>
                          <td style={tdStyle}>{formatDate(note.deliveryDate)}</td>

                          <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>
                            {formatCurrency(totalTTC)} TND
                          </td>

                          <td style={tdStyle}>
                            {note.isDelivered ? (
                              <Chip label="Livré" color="success" size="small" />
                            ) : (
                              <Chip label="En préparation" color="warning" size="small" />
                            )}
                            {note.isArchived && (
                              <Chip label="Archivé" color="default" size="small" sx={{ ml: 1 }} />
                            )}
                          </td>

                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                              <Tooltip title="Détails">
                                <IconButton size="small" onClick={() => handleOpenDetails(note)}>
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Modifier">
                                <IconButton size="small" onClick={() => handleOpenEdit(note)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="PDF">
                                <IconButton size="small" onClick={() => handleDownloadPdf(note)}>
                                  <PictureAsPdf fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {!note.isDelivered && (
                                <Tooltip title="Marquer livrée">
                                  <IconButton size="small" onClick={() => handleMarkAsDelivered(note)}>
                                    <LocalShipping fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {!note.isArchived && (
                                <Tooltip title="Archiver">
                                  <IconButton size="small" onClick={() => handleAskArchive(note)}>
                                    <Archive fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title="Supprimer">
                                <IconButton
                                  size="small"
                                  onClick={() => handleAskDelete(note)}
                                  sx={{ color: "#ef5350", "&:hover": { backgroundColor: "#ffebee" } }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                        <Typography>Aucun bon de livraison trouvé</Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
        )}

        <CreateDeliveryNoteFromOrderDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          deliveredOrders={deliveredOrders}
          onCreated={(note) => {
            setDeliveryNotes((prev) => [...prev, note]);
            setFilteredNotes((prev) => [...prev, note]);
          }}
        />

        <DeliveryNoteDetailsDialog open={detailsOpen} onClose={handleCloseDetails} deliveryNote={selectedNote} />

        <EditDeliveryNoteDialog
          open={editOpen}
          onClose={handleCloseEdit}
          deliveryNoteId={editId}
          onUpdated={() => fetchNotes()}
        />

        {/* ✅ CONFIRM DELETE */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Supprimer le bon de livraison"
          message={`Tu es sûr de vouloir supprimer le bon #${noteToDelete?.deliveryNumber || noteToDelete?.id} ? Cette action est irréversible.`}
          confirmText="Supprimer"
          confirmColor="error"
          loading={isLoading}
          onClose={() => {
            if (isLoading) return;
            setDeleteDialogOpen(false);
            setNoteToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        {/* ✅ CONFIRM ARCHIVE */}
        <ConfirmDialog
          open={archiveDialogOpen}
          title="Archiver le bon de livraison"
          message={`Tu es sûr de vouloir archiver le bon #${noteToArchive?.deliveryNumber || noteToArchive?.id} ?`}
          confirmText="Archiver"
          confirmColor="warning"
          loading={isLoading}
          onClose={() => {
            if (isLoading) return;
            setArchiveDialogOpen(false);
            setNoteToArchive(null);
          }}
          onConfirm={handleConfirmArchive}
        />
      </Box>
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
  padding: "12px 16px",
  color: "#555",
  fontSize: "0.875rem",
  verticalAlign: "middle",
};

export default DeliveryNotesPage;
