import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  TextField,
  Alert,
  Chip,
  Grid,
  InputAdornment
} from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete,
  Visibility,
  Search,
  Refresh,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import {
  getAllDevis,
  deleteDevis,
  getDevisByStatus,
  searchDevis,
  acceptDevis,
  rejectDevis
} from "services/DevisClientService";
import { useSnackbar } from "notistack";
import ViewDevisDialog from "../components/viewDialogDevisClient";
import EditDevisClientDialog from "../components/EditDevisClientDialog";
import ConfirmAcceptDevisDialog from "../components/ConfirmAcceptDevisDialog";
import ConfirmRejectDevisDialog from "../components/ConfirmRejectDevisDialog";

const statusOptions = [
  { value: "Tous", label: "Tous", color: "default" },
  { value: 0, label: "Brouillon", color: "primary" },
  { value: 1, label: "Envoyé", color: "warning" },
  { value: 2, label: "Validé", color: "success" },
  { value: 3, label: "Annulé", color: "error" }
];

// 🔥 Boutons Accepter / Refuser avec consumption API + dialogs
const DevisDecisionButtons = ({ devisId, currentStatus, onStatusChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const handleAcceptConfirm = async () => {
    setLoadingAccept(true);
    try {
      // Appel API d’acceptation
      await acceptDevis(devisId);

      // Mise à jour du statut en local (2 = validé/accepté)
      onStatusChange(devisId, 2);

      enqueueSnackbar("Devis accepté avec succès", { variant: "success" });
      setOpenAcceptDialog(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erreur lors de l'acceptation du devis", {
        variant: "error"
      });
    } finally {
      setLoadingAccept(false);
    }
  };

  const handleRejectConfirm = async () => {
    setLoadingReject(true);
    try {
      // Appel API de refus
      await rejectDevis(devisId);

      // Mise à jour du statut en local (3 = refusé)
      onStatusChange(devisId, 3);

      enqueueSnackbar("Devis refusé", { variant: "info" });
      setOpenRejectDialog(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erreur lors du refus du devis", {
        variant: "error"
      });
    } finally {
      setLoadingReject(false);
    }
  };

  // Si déjà accepté ou refusé, afficher juste un Chip
  if (currentStatus === 2) {
    return (
      <Chip
        icon={<CheckCircle />}
        label="Accepté"
        color="success"
        size="small"
      />
    );
  }

  if (currentStatus === 3) {
    return (
      <Chip
        icon={<Cancel />}
        label="Refusé"
        color="error"
        size="small"
      />
    );
  }

  return (
    <>
      {/* Icône Accepter */}
      <Tooltip title="Accepter le devis">
        <span>
          <IconButton
            size="small"
            onClick={() => setOpenAcceptDialog(true)}
            disabled={loadingAccept || loadingReject}
            sx={{
              color: "#2e7d32",
              "&:hover": { backgroundColor: "#e8f5e9" }
            }}
          >
            <CheckCircle fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Icône Refuser */}
      <Tooltip title="Refuser le devis">
        <span>
          <IconButton
            size="small"
            onClick={() => setOpenRejectDialog(true)}
            disabled={loadingAccept || loadingReject}
            sx={{
              color: "#c62828",
              "&:hover": { backgroundColor: "#ffebee" }
            }}
          >
            <Cancel fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Dialog ACCEPTATION */}
      <ConfirmAcceptDevisDialog
        open={openAcceptDialog}
        loading={loadingAccept}
        onClose={() => setOpenAcceptDialog(false)}
        onConfirm={handleAcceptConfirm}
      />

      {/* Dialog REFUS */}
      <ConfirmRejectDevisDialog
        open={openRejectDialog}
        loading={loadingReject}
        onClose={() => setOpenRejectDialog(false)}
        onConfirm={handleRejectConfirm}
      />
    </>
  );
};

DevisDecisionButtons.propTypes = {
  devisId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentStatus: PropTypes.number.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

const DevisClient = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [devis, setDevis] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState(null);

  const handleDotNetResponse = (response) => {
    if (response && response.$values) return response.$values;
    if (Array.isArray(response)) return response;
    return [];
  };

  const fetchDevis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response =
        activeFilter === "Tous"
          ? await getAllDevis()
          : await getDevisByStatus(activeFilter);

      const devisData = handleDotNetResponse(response);
      setDevis(devisData);
      setFilteredDevis(devisData);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Erreur de chargement des devis");
      enqueueSnackbar("Erreur de chargement", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      setFilteredDevis(devis);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchDevis(query);
      setFilteredDevis(handleDotNetResponse(response));
    } catch (error) {
      console.error("Search error:", error);
      enqueueSnackbar("Erreur de recherche", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (devisItem) => {
    setSelectedDevis(devisItem);
    setViewDialogOpen(true);
  };

  const handleEdit = (devisItem) => {
    setSelectedDevis(devisItem);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression?")) return;
    try {
      await deleteDevis(id);
      setDevis((prev) => prev.filter((d) => d.id !== id));
      setFilteredDevis((prev) => prev.filter((d) => d.id !== id));
      enqueueSnackbar("Devis supprimé", { variant: "success" });
    } catch (error) {
      console.error("Delete error:", error);
      enqueueSnackbar("Erreur de suppression", { variant: "error" });
    }
  };

  // 🔁 Mise à jour locale du statut après accept/refus
  const handleStatusChange = (id, newStatus) => {
    setDevis((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    setFilteredDevis((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const handleUpdateSuccess = () => {
    fetchDevis();
    enqueueSnackbar("Devis modifié avec succès", { variant: "success" });
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des Devis Clients
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredDevis.length} devis trouvés
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => (window.location.href = "/Vente/Nouveau/Devis")}
              sx={{ mr: 2 }}
            >
              Nouveau Devis
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchDevis}
            >
              Actualiser
            </Button>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher par référence, client..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 1 }}>
                {statusOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={`${option.label} (${devis.filter((d) =>
                      option.value === "Tous" ? true : d.status === option.value
                    ).length})`}
                    onClick={() => setActiveFilter(option.value)}
                    color={option.color}
                    variant={
                      activeFilter === option.value ? "filled" : "outlined"
                    }
                    sx={{
                      minWidth: 100,
                      fontWeight:
                        activeFilter === option.value ? "bold" : "normal"
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Content Section */}
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
              overflow: "hidden"
            }}
          >
            <Box sx={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px"
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f5f7fa",
                      height: "60px"
                    }}
                  >
                    <th
                      style={{
                        width: "50px",
                        padding: "0 16px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textAlign: "left",
                        borderBottom: "2px solid #e0e0e0",
                        color: "#333"
                      }}
                    >
                      #
                    </th>

                    <th
                      style={{
                        width: "200px",
                        padding: "0 16px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textAlign: "left",
                        borderBottom: "2px solid #e0e0e0",
                        color: "#333"
                      }}
                    >
                      Référence
                    </th>

                    <th
                      style={{
                        width: "200px",
                        padding: "0 16px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textAlign: "left",
                        borderBottom: "2px solid #e0e0e0",
                        color: "#333"
                      }}
                    >
                      Client
                    </th>

                    <th
                      style={{
                        width: "150px",
                        padding: "0 16px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textAlign: "left",
                        borderBottom: "2px solid #e0e0e0",
                        color: "#333"
                      }}
                    >
                      Date Création
                    </th>

                    <th
                      style={{
                        width: "150px",
                        padding: "0 16px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textAlign: "left",
                        borderBottom: "2px solid #e0e0e0",
                        color: "#333"
                      }}
                    >
                      Statut
                    </th>

                    <th
                      style={{
                        width: "150px",
                        padding: "0 16px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textAlign: "right",
                        borderBottom: "2px solid #e0e0e0",
                        color: "#333"
                      }}
                    >
                      Total TTC
                    </th>

                    <th
                      style={{
                        width: "200px",
                        padding: "0 16px",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textAlign: "center",
                        borderBottom: "2px solid #e0e0e0",
                        color: "#333"
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDevis.length > 0 ? (
                    filteredDevis.map((devisItem, index) => (
                      <tr
                        key={devisItem.id}
                        style={{
                          borderBottom: "1px solid #eee"
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#555",
                            fontSize: "0.875rem",
                            verticalAlign: "middle"
                          }}
                        >
                          {index + 1}
                        </td>

                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#333",
                            fontSize: "0.875rem",
                            verticalAlign: "middle"
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "block",
                              maxWidth: "180px",
                              color: "#1976d2"
                            }}
                          >
                            {devisItem.reference || "N/A"}
                          </Box>
                        </td>

                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#555",
                            fontSize: "0.875rem",
                            verticalAlign: "middle"
                          }}
                        >
                          {devisItem.clientName || "N/A"}
                        </td>

                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#555",
                            fontSize: "0.875rem",
                            verticalAlign: "middle"
                          }}
                        >
                          {devisItem.creationDate
                            ? new Date(
                                devisItem.creationDate
                              ).toLocaleDateString("fr-FR")
                            : "N/A"}
                        </td>

                        <td
                          style={{
                            padding: "12px 16px",
                            verticalAlign: "middle"
                          }}
                        >
                          <Chip
                            label={
                              devisItem.status === 0
                                ? "Brouillon"
                                : devisItem.status === 1
                                ? "Envoyé"
                                : devisItem.status === 2
                                ? "Validé"
                                : "Annulé"
                            }
                            size="small"
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              backgroundColor:
                                devisItem.status === 0
                                  ? "#e3f2fd"
                                  : devisItem.status === 1
                                  ? "#fff8e1"
                                  : devisItem.status === 2
                                  ? "#e8f5e9"
                                  : "#ffebee",
                              color:
                                devisItem.status === 0
                                  ? "#1565c0"
                                  : devisItem.status === 1
                                  ? "#ff8f00"
                                  : devisItem.status === 2
                                  ? "#2e7d32"
                                  : "#c62828"
                            }}
                          />
                        </td>

                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#333",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            textAlign: "right",
                            verticalAlign: "middle"
                          }}
                        >
                          {devisItem.totalTTC
                            ? `${devisItem.totalTTC.toFixed(2)} TND`
                            : "0.00 TND"}
                        </td>

                        <td
                          style={{
                            padding: "12px 16px",
                            textAlign: "center",
                            verticalAlign: "middle"
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "6px",
                              flexWrap: "wrap"
                            }}
                          >
                            <Tooltip title="Voir">
                              <IconButton
                                size="small"
                                onClick={() => handleView(devisItem)}
                                sx={{
                                  color: "#5c6bc0",
                                  "&:hover": { backgroundColor: "#e8eaf6" }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Modifier">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(devisItem)}
                                sx={{
                                  color: "#26a69a",
                                  "&:hover": { backgroundColor: "#e0f2f1" }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* ✅ Acceptation / Refus avec dialogs + API */}
                            <DevisDecisionButtons
                              devisId={devisItem.id}
                              currentStatus={devisItem.status}
                              onStatusChange={handleStatusChange}
                            />

                            <Tooltip title="Supprimer">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(devisItem.id)}
                                sx={{
                                  color: "#ef5350",
                                  "&:hover": { backgroundColor: "#ffebee" }
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
                        colSpan="7"
                        style={{
                          padding: "24px",
                          textAlign: "center",
                          color: "#666"
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body1">
                            Aucun devis trouvé
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Essayez de modifier vos critères de recherche
                          </Typography>
                        </Box>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
        )}

        {/* Dialog pour visualiser un devis */}
        <ViewDevisDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          devis={selectedDevis}
        />

        {/* Dialog pour modifier un devis */}
        <EditDevisClientDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          devis={selectedDevis}
          onUpdate={handleUpdateSuccess}
        />
      </Box>
    </DashboardLayout>
  );
};

export default DevisClient;
