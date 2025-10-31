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
  InputAdornment,
} from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete,
  Visibility,
  Search,
  Refresh,
  CheckCircle,
  Cancel,
  PictureAsPdf,
  Inventory,
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import CommandeDetailsDialog from "../Componants/CommandeDetails";
import orderSupplierService from "services/orderSupplierService";

// 👇 Dialog d’édition
import EditCommandeFournisseurDialog from "../Componants/EditCommandeFournisseurDialog";
// 👇 Dialog de suppression (design comme DeleteDevisDialog)
import DeleteCommandeDialog from "../Componants/DeleteCommandeDialog"; // ⚠️ adapte le chemin si besoin

// ==========================
// Statuts des commandes
// ==========================
const ORDER_STATUS = {
  EN_ATTENTE: 0,
  APPROUVE: 1,
  REJETE: 2,
  LIVRE: 3,
  ANNULE: 4,

  getLabel: (status) => {
    switch (status) {
      case 0:
        return "En Attente";
      case 1:
        return "Approuvé";
      case 2:
        return "Rejeté";
      case 3:
        return "Livré";
      case 4:
        return "Annulé";
      default:
        return "Inconnu";
    }
  },

  getColor: (status) => {
    switch (status) {
      case 0:
        return "warning";
      case 1:
        return "success";
      case 2:
        return "error";
      case 3:
        return "info";
      case 4:
        return "default";
      default:
        return "default";
    }
  },
};

const statusOptions = [
  { value: "Tous", label: "Tous", color: "default" },
  { value: ORDER_STATUS.EN_ATTENTE, label: "En Attente", color: "warning" },
  { value: ORDER_STATUS.APPROUVE, label: "Approuvé", color: "success" },
  { value: ORDER_STATUS.REJETE, label: "Rejeté", color: "error" },
  { value: ORDER_STATUS.LIVRE, label: "Livré", color: "info" },
  { value: ORDER_STATUS.ANNULE, label: "Annulé", color: "default" },
];

// ==========================
// Boutons accepter / rejeter
// ==========================
const CommandeStatusButton = ({
  commandeId,
  currentStatus,
  onStatusChange,
  onApprove,
  onReject,
}) => {
  const [loading, setLoading] = useState(false);

  // Si c'est déjà approuvé → on montre juste le chip
  if (currentStatus === ORDER_STATUS.APPROUVE) {
    return (
      <Chip
        icon={<CheckCircle />}
        label={ORDER_STATUS.getLabel(currentStatus)}
        color={ORDER_STATUS.getColor(currentStatus)}
        size="small"
      />
    );
  }

  // Si c'est déjà rejeté → on montre juste le chip
  if (currentStatus === ORDER_STATUS.REJETE) {
    return (
      <Chip
        icon={<Cancel />}
        label={ORDER_STATUS.getLabel(currentStatus)}
        color={ORDER_STATUS.getColor(currentStatus)}
        size="small"
      />
    );
  }

  // Sinon → montrer les 2 icônes (actives)
  const handleApproveClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onApprove(commandeId);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onReject(commandeId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: "6px" }}>
      <Tooltip title="Approuver la commande">
        <IconButton
          size="small"
          onClick={handleApproveClick}
          color="success"
          disabled={loading}
        >
          <CheckCircle fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Rejeter la commande">
        <IconButton
          size="small"
          onClick={handleRejectClick}
          color="error"
          disabled={loading}
        >
          <Cancel fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

CommandeStatusButton.propTypes = {
  commandeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  currentStatus: PropTypes.number.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

// ==========================
// Composant principal
// ==========================
const CommandeSupplierService = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // détails
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // édition
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [commandeToEdit, setCommandeToEdit] = useState(null);

  const handleDotNetResponse = (response) => {
    if (response && response.$values) {
      return response.$values;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  };

  const fetchCommandes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderSupplierService.getAllOrders();
      const commandesData = handleDotNetResponse(response);
      setCommandes(commandesData);
      setFilteredCommandes(commandesData);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      setError(`Erreur de chargement: ${error.message}`);
      enqueueSnackbar("Erreur de chargement", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredCommandes(commandes);
      return;
    }

    const filtered = commandes.filter((commande) =>
      Object.values(commande).some((value) =>
        value && value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredCommandes(filtered);
  };

  const handleStatusChange = (id, newStatus) => {
    setCommandes((prev) =>
      prev.map((commande) =>
        commande.id === id ? { ...commande, state: newStatus } : commande
      )
    );
    setFilteredCommandes((prev) =>
      prev.map((commande) =>
        commande.id === id ? { ...commande, state: newStatus } : commande
      )
    );
  };

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedCommande(null);
  };

  const handleEdit = (commande) => {
    setCommandeToEdit(commande);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCommandeToEdit(null);
    fetchCommandes(); // rafraîchir après édition
  };

  const handleDelete = (commande) => {
    setSelectedCommande(commande);
    setDeleteDialogOpen(true);
  };

  const handleApprove = async (commandeId) => {
    try {
      setIsLoading(true);
      await orderSupplierService.approveOrder(commandeId);
      handleStatusChange(commandeId, ORDER_STATUS.APPROUVE);
      enqueueSnackbar("Commande approuvée avec succès", {
        variant: "success",
      });
    } catch (error) {
      console.error("Approve error:", error);
      enqueueSnackbar("Erreur lors de l'approbation", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (commandeId) => {
    try {
      setIsLoading(true);
      await orderSupplierService.rejectOrder(commandeId);
      handleStatusChange(commandeId, ORDER_STATUS.REJETE);
      enqueueSnackbar("Commande rejetée avec succès", {
        variant: "success",
      });
    } catch (error) {
      console.error("Reject error:", error);
      enqueueSnackbar("Erreur lors du rejet", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async (commandeId) => {
    try {
      const pdfBlob = await orderSupplierService.generateOrderPdf([
        commandeId,
      ]);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `commande_${commandeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar("PDF généré avec succès", { variant: "success" });
    } catch (error) {
      console.error("PDF generation error:", error);
      enqueueSnackbar("Erreur lors de la génération du PDF", {
        variant: "error",
      });
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "Tous") {
      setFilteredCommandes(commandes);
    } else {
      const numericFilter = parseInt(filter);
      setFilteredCommandes(
        commandes.filter((commande) => commande.state === numericFilter)
      );
    }
  };

  const getStatusColor = (status) => ORDER_STATUS.getColor(status);
  const getStatusLabel = (status) => ORDER_STATUS.getLabel(status);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const handleExportPDF = async () => {
    if (filteredCommandes.length === 0) {
      enqueueSnackbar("Aucune commande à exporter", { variant: "warning" });
      return;
    }

    try {
      const commandeIds = filteredCommandes.map((commande) => commande.id);
      const pdfBlob = await orderSupplierService.generateOrderPdf(commandeIds);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `commandes_${new Date().toISOString().split("T")[0]}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar("PDF exporté avec succès", { variant: "success" });
    } catch (error) {
      console.error("PDF export error:", error);
      enqueueSnackbar("Erreur lors de l'export PDF", { variant: "error" });
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des Commandes Fournisseurs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredCommandes.length} commandes trouvées sur{" "}
              {commandes.length} total
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
            <Button
              component={Link}
              to="/achats/commandes"
              variant="contained"
              startIcon={<AddCircle />}
              sx={{ mr: 2 }}
            >
              Nouvelle Commande
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPDF}
              disabled={filteredCommandes.length === 0}
              sx={{ mr: 2 }}
            >
              Exporter PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchCommandes}
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
            boxShadow: 1,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher par numéro, fournisseur..."
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
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 1 }}>
                {statusOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={`${option.label} (${commandes.filter((commande) =>
                      option.value === "Tous"
                        ? true
                        : commande.state === option.value
                    ).length})`}
                    onClick={() => handleFilterClick(option.value)}
                    color={option.color}
                    variant={
                      activeFilter === option.value ? "filled" : "outlined"
                    }
                    sx={{
                      minWidth: 100,
                      fontWeight:
                        activeFilter === option.value ? "bold" : "normal",
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
              overflow: "hidden",
            }}
          >
            <Box sx={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1200px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f5f7fa",
                      height: "60px",
                    }}
                  >
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Numéro Commande</th>
                    <th style={thStyle}>Fournisseur</th>
                    <th style={thStyle}>Date Commande</th>
                    <th style={thStyle}>Date Livraison</th>
                    <th style={thStyle}>Statut</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>
                      Total TTC
                    </th>
                    <th style={{ ...thStyle, textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCommandes.length > 0 ? (
                    filteredCommandes.map((commande, index) => (
                      <tr
                        key={commande.id}
                        style={{
                          borderBottom: "1px solid #eee",
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#fafafa",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f7fa";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            index % 2 === 0 ? "#ffffff" : "#fafafa";
                        }}
                      >
                        <td style={tdStyle}>{index + 1}</td>

                        <td style={tdStyle}>
                          <Box
                            component="span"
                            sx={{
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "block",
                              maxWidth: "140px",
                              color: "#1976d2",
                            }}
                          >
                            {commande.orderNumber || "N/A"}
                          </Box>
                        </td>

                        <td style={tdStyle}>
                          {commande.supplierName ||
                            commande.supplierId ||
                            "N/A"}
                        </td>

                        <td style={tdStyle}>
                          {formatDate(commande.orderDate)}
                        </td>

                        <td style={tdStyle}>
                          {formatDate(commande.deliveryDate)}
                        </td>

                        <td style={tdStyle}>
                          <Chip
                            label={getStatusLabel(commande.state)}
                            size="small"
                            color={getStatusColor(commande.state)}
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          />
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                            fontWeight: 500,
                          }}
                        >
                          {commande.totalTTC
                            ? `${commande.totalTTC.toFixed(2)} TND`
                            : "0.00 TND"}
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
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >
                            {/* Voir détails */}
                            <Tooltip title="Voir détails">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(commande)}
                                sx={{
                                  color: "#5c6bc0",
                                  "&:hover": { backgroundColor: "#e8eaf6" },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <CommandeDetailsDialog
                              open={detailDialogOpen}
                              onClose={handleCloseDetailDialog}
                              commandeId={selectedCommande?.id}
                            />

                            {/* bouton modifier -> ouvre le dialog */}
                            <Tooltip title="Modifier">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(commande)}
                                sx={{
                                  color: "#26a69a",
                                  "&:hover": { backgroundColor: "#e0f2f1" },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* PDF */}
                            <Tooltip title="Générer PDF">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleGeneratePDF(commande.id)
                                }
                                sx={{
                                  color: "#d32f2f",
                                  "&:hover": { backgroundColor: "#ffebee" },
                                }}
                              >
                                <PictureAsPdf fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* ✅ Accepter / Rejeter avec icônes (actifs) */}
                            <CommandeStatusButton
                              commandeId={commande.id}
                              currentStatus={commande.state}
                              onStatusChange={handleStatusChange}
                              onApprove={handleApprove}
                              onReject={handleReject}
                            />

                            {/* Supprimer */}
                            <Tooltip title="Supprimer">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(commande)}
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
                        colSpan="8"
                        style={{
                          padding: "24px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Inventory
                            sx={{
                              fontSize: 60,
                              color: "#e0e0e0",
                              mb: 2,
                            }}
                          />
                          <Typography variant="body1">
                            Aucune commande fournisseur trouvée
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {commandes.length === 0
                              ? "Aucune commande n'a été créée. Créez une nouvelle commande ou convertissez un devis accepté."
                              : "Aucune commande ne correspond à vos critères de recherche."}
                          </Typography>
                          <Button
                            component={Link}
                            to="/achats/commandes"
                            variant="contained"
                            startIcon={<AddCircle />}
                            sx={{ mt: 2 }}
                          >
                            Créer une nouvelle commande
                          </Button>
                        </Box>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
        )}

        {/* ✅ Dialog de suppression */}
        <DeleteCommandeDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          commande={selectedCommande}
          onDelete={(id) => {
            setCommandes((prev) => prev.filter((c) => c.id !== id));
            setFilteredCommandes((prev) => prev.filter((c) => c.id !== id));
          }}
          redirectOnSuccess={false}
        />

        {/* ✅ Dialog d'édition de commande */}
        {commandeToEdit && (
          <EditCommandeFournisseurDialog
            open={editDialogOpen}
            onClose={handleCloseEditDialog}
            commande={commandeToEdit}
            onUpdate={fetchCommandes}
          />
        )}
      </Box>
    </DashboardLayout>
  );
};

// styles de la table
const thStyle = {
  width: "150px",
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

export default CommandeSupplierService;
