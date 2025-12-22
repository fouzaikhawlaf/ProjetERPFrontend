// src/layouts/clientDeliveryNotes/DeliveryNotesPage.jsx
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
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useSnackbar } from "notistack";

import {
  getAllDeliveryNotes,
  markOrderAsDelivered,
  deleteDeliveryNote,
  downloadDeliveryNotePdf,
  markDeliveryNoteAsArchived,
} from "services/deliveryNoteService";

import { getAllOrders } from "services/orderClientService";

import CreateDeliveryNoteFromOrderDialog from "../components/CreateDeliveryNoteFromOrderDialog";
import DeliveryNoteDetailsDialog from "../components/DeliveryNoteDetailsDialog";

const DeliveryNotesPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notes = await getAllDeliveryNotes();
      setDeliveryNotes(notes);
      setFilteredNotes(notes);
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
      const delivered = (orders || []).filter(
        (o) => Number(o.status) === 2
      );
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
      Object.values(note).some(
        (v) => v && v.toString().toLowerCase().includes(q)
      )
    );
    setFilteredNotes(result);
  };

  const handleMarkAsDelivered = async (note) => {
    try {
      setIsLoading(true);
      await markOrderAsDelivered(note.orderClientId);
      enqueueSnackbar("Commande marquée comme livrée", { variant: "success" });

      setDeliveryNotes((prev) =>
        prev.map((n) =>
          n.id === note.id ? { ...n, isDelivered: true } : n
        )
      );
      setFilteredNotes((prev) =>
        prev.map((n) =>
          n.id === note.id ? { ...n, isDelivered: true } : n
        )
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

  const handleDelete = async (note) => {
    try {
      setIsLoading(true);
      await deleteDeliveryNote(note.id);
      enqueueSnackbar("Bon de livraison supprimé", { variant: "success" });
      setDeliveryNotes((prev) => prev.filter((n) => n.id !== note.id));
      setFilteredNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (err) {
      console.error("Erreur suppression BL :", err);
      enqueueSnackbar("Erreur lors de la suppression du bon de livraison", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (note) => {
    try {
      setIsLoading(true);
      await markDeliveryNoteAsArchived(note.id);
      enqueueSnackbar("Bon de livraison archivé", { variant: "success" });

      setDeliveryNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, isArchived: true } : n))
      );
      setFilteredNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, isArchived: true } : n))
      );
    } catch (err) {
      console.error("Erreur archivage BL :", err);
      enqueueSnackbar("Erreur lors de l'archivage du bon de livraison", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetails = (note) => {
    setSelectedNote(note);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedNote(null);
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
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
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

        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
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
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f5f7fa", height: "60px" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>N° Bon</th>
                    <th style={thStyle}>Commande client</th>
                    <th style={thStyle}>Date de livraison</th>
                    <th style={thStyle}>Statut</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note, index) => (
                      <tr
                        key={note.id}
                        style={{
                          borderBottom: "1px solid #eee",
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#fafafa",
                        }}
                      >
                        <td style={tdStyle}>{index + 1}</td>
                        <td style={tdStyle}>
                          {note.deliveryNumber || note.id}
                        </td>
                        <td style={tdStyle}>{note.orderClientId}</td>
                        <td style={tdStyle}>{formatDate(note.deliveryDate)}</td>
                        <td style={tdStyle}>
                          {note.isDelivered ? (
                            <Chip label="Livré" color="success" size="small" />
                          ) : (
                            <Chip
                              label="En préparation"
                              color="warning"
                              size="small"
                            />
                          )}
                          {note.isArchived && (
                            <Chip
                              label="Archivé"
                              color="default"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Tooltip title="Détails du bon de livraison">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDetails(note)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Télécharger PDF">
                              <IconButton
                                size="small"
                                onClick={() => downloadDeliveryNotePdf(note.id)}
                              >
                                <PictureAsPdf fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {!note.isDelivered && (
                              <Tooltip title="Marquer comme livrée">
                                <IconButton
                                  size="small"
                                  onClick={() => handleMarkAsDelivered(note)}
                                >
                                  <LocalShipping fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {!note.isArchived && (
                              <Tooltip title="Archiver le BL">
                                <IconButton
                                  size="small"
                                  onClick={() => handleArchive(note)}
                                >
                                  <Archive fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip title="Supprimer">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(note)}
                                sx={{
                                  color: "#ef5350",
                                  "&:hover": { backgroundColor: "#ffebee" },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          padding: "24px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
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

        <DeliveryNoteDetailsDialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          deliveryNote={selectedNote}
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
