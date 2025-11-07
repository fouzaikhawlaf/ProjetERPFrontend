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
  Switch,
  FormControlLabel,
  Divider,
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
  BugReport,
  ContentCopy,
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import CommandeDetailsDialog from "../Componants/CommandeDetails";
import orderSupplierService from "services/orderSupplierService";
import EditCommandeFournisseurDialog from "../Componants/EditCommandeFournisseurDialog";
import DeleteCommandeDialog from "../Componants/DeleteCommandeDialog";

// Mapping complet de l'énum backend OrderState
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
    switch (s) {
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
    switch (s) {
      case 0: return "default";   // Brouillon
      case 1: return "info";      // Validée
      case 2: return "info";      // Livrée
      case 3: return "primary";   // Facturée
      case 4: return "default";   // Annulée
      case 5: return "warning";   // En attente
      case 6: return "info";      // Confirmée
      case 7: return "success";   // Approuvée
      case 8: return "error";     // Rejetée
      default: return "default";
    }
  },
};

const statusOptions = [
  { value: "Tous", label: "Tous", color: "default" },
  { value: ORDER_STATUS.DRAFT,     label: "Brouillon",  color: "default" },
  { value: ORDER_STATUS.VALIDATED, label: "Validée",    color: "info" },
  { value: ORDER_STATUS.DELIVERED, label: "Livrée",     color: "info" },
  { value: ORDER_STATUS.INVOICED,  label: "Facturée",   color: "primary" },
  { value: ORDER_STATUS.CANCELLED, label: "Annulée",    color: "default" },
  { value: ORDER_STATUS.PENDING,   label: "En attente", color: "warning" },
  { value: ORDER_STATUS.CONFIRMED, label: "Confirmée",  color: "info" },
  { value: ORDER_STATUS.APPROVED,  label: "Approuvée",  color: "success" },
  { value: ORDER_STATUS.REJECTED,  label: "Rejetée",    color: "error" },
];

const CommandeStatusButton = ({ commandeId, currentStatus, onApprove, onReject }) => {
  const [loading, setLoading] = useState(false);

  // Si déjà approuvée ou rejetée, on affiche juste le chip
  if (currentStatus === ORDER_STATUS.APPROVED) {
    return (
      <Chip icon={<CheckCircle />} label={ORDER_STATUS.getLabel(currentStatus)} color={ORDER_STATUS.getColor(currentStatus)} size="small" />
    );
  }
  if (currentStatus === ORDER_STATUS.REJECTED) {
    return (
      <Chip icon={<Cancel />} label={ORDER_STATUS.getLabel(currentStatus)} color={ORDER_STATUS.getColor(currentStatus)} size="small" />
    );
  }

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
        <IconButton size="small" onClick={handleApproveClick} color="success" disabled={loading}>
          <CheckCircle fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Rejeter la commande">
        <IconButton size="small" onClick={handleRejectClick} color="error" disabled={loading}>
          <Cancel fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

CommandeStatusButton.propTypes = {
  commandeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentStatus: PropTypes.number.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

const CommandeSupplierService = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCommande, setSelectedCommande] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [commandeToEdit, setCommandeToEdit] = useState(null);

  // Debug / console-like
  const [debugOpen, setDebugOpen] = useState(false);
  const [lastRawResponse, setLastRawResponse] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(amount || 0);
  };

  // Unwrap des listes .NET ($values)
  const handleDotNetResponse = (response) => {
    if (response && response.$values) return response.$values;
    if (Array.isArray(response)) return response;
    return [];
  };

  const copyToClipboard = async (obj) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
      enqueueSnackbar("JSON copié dans le presse-papiers", { variant: "success" });
    } catch (_) {
      enqueueSnackbar("Impossible de copier le JSON", { variant: "error" });
    }
  };

  const fetchCommandes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderSupplierService.getAllOrders();
      setLastRawResponse(response);

      console.groupCollapsed("📦 Réponse API getAllOrders()");
      console.log("Brut:", response);
      const commandesData = handleDotNetResponse(response);
      console.log(`Items: ${commandesData.length}`);
      if (commandesData[0]) console.table(commandesData[0]);
      console.groupEnd();

      // Sécurité : s'assurer que status est bien un nombre
      const bad = commandesData.filter((c) => typeof c.status !== "number");
      if (bad.length) console.warn("Commandes sans status numérique:", bad);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) return setFilteredCommandes(commandes);

    const filtered = commandes.filter((commande) =>
      Object.values(commande).some((value) => value && value.toString().toLowerCase().includes(query))
    );
    setFilteredCommandes(filtered);
  };

  const handleStatusChange = (id, newStatus) => {
    setCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    setFilteredCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
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
    fetchCommandes();
  };

  const handleDelete = (commande) => {
    setSelectedCommande(commande);
    setDeleteDialogOpen(true);
  };

  const handleApprove = async (commandeId) => {
    try {
      setIsLoading(true);
      await orderSupplierService.approveOrder(commandeId);
      handleStatusChange(commandeId, ORDER_STATUS.APPROVED);
      enqueueSnackbar("Commande approuvée avec succès", { variant: "success" });
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
      handleStatusChange(commandeId, ORDER_STATUS.REJECTED);
      enqueueSnackbar("Commande rejetée avec succès", { variant: "success" });
    } catch (error) {
      console.error("Reject error:", error);
      enqueueSnackbar("Erreur lors du rejet", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async (commandeId) => {
    try {
      const pdfBlob = await orderSupplierService.generateOrderPdf([commandeId]);
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
      enqueueSnackbar("Erreur lors de la génération du PDF", { variant: "error" });
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "Tous") return setFilteredCommandes(commandes);

    const numericFilter = parseInt(filter, 10);
    setFilteredCommandes(commandes.filter((c) => c.status === numericFilter));
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
      const commandeIds = filteredCommandes.map((c) => c.id);
      const pdfBlob = await orderSupplierService.generateOrderPdf(commandeIds);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `commandes_${new Date().toISOString().split("T")[0]}.pdf`);
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
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">Gestion des Commandes Fournisseurs</Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredCommandes.length} commandes trouvées sur {commandes.length} total
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" }, display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
            <FormControlLabel control={<Switch checked={debugOpen} onChange={() => setDebugOpen((v) => !v)} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><BugReport fontSize="small" /> Console API</Box>} />
            <Button component={Link} to="/achats/commandes" variant="contained" startIcon={<AddCircle />} sx={{ mr: 1 }}>Nouvelle Commande</Button>
            <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={handleExportPDF} disabled={filteredCommandes.length === 0} sx={{ mr: 1 }}>Exporter PDF</Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchCommandes}>Actualiser</Button>
          </Grid>
        </Grid>

       

        {/* Filters Section */}
        <Box sx={{ p: 2, mb: 3, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher par numéro, fournisseur..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{ startAdornment: (<InputAdornment position="start"><Search color="action" /></InputAdornment>) }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 1 }}>
                {statusOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={`${option.label} (${commandes.filter((c) => option.value === "Tous" ? true : c.status === option.value).length})`}
                    onClick={() => handleFilterClick(option.value)}
                    color={option.color}
                    variant={activeFilter === option.value ? "filled" : "outlined"}
                    sx={{ minWidth: 100, fontWeight: activeFilter === option.value ? "bold" : "normal" }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Content Section */}
        {error && (<Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>)}

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress size={60} /></Box>
        ) : (
          <Box component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1400px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f7fa", height: "60px" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Numéro Commande</th>
                    <th style={thStyle}>Fournisseur</th>
                    <th style={thStyle}>Date Commande</th>
                    <th style={thStyle}>Date Livraison</th>
                    <th style={thStyle}>Statut</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Total HT</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Total TVA</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Total TTC</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommandes.length > 0 ? (
                    filteredCommandes.map((commande, index) => (
                      <tr
                        key={commande.id}
                        style={{ borderBottom: "1px solid #eee", backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa", transition: "background-color 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f7fa"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fafafa"; }}
                      >
                        <td style={tdStyle}>{index + 1}</td>
                        <td style={tdStyle}>
                          <Box component="span" sx={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", maxWidth: "140px", color: "#1976d2" }}>
                            {commande.OrderNumber || "N/A"}
                          </Box>
                        </td>
                        <td style={tdStyle}>{commande.supplierName || commande.supplierId || "N/A"}</td>
                        <td style={tdStyle}>{formatDate(commande.orderDate)}</td>
                        <td style={tdStyle}>{formatDate(commande.expectedDeliveryDate)}</td>
                        <td style={tdStyle}>
                          <Chip label={getStatusLabel(commande.status)} size="small" color={getStatusColor(commande.status)} sx={{ fontSize: "0.75rem", fontWeight: 500 }} />
                        </td>
                        {/* Total HT (purchaseAmount fourni par l'API) */}
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: 500 }}>
                          {commande.purchaseAmount !== undefined ? `${formatCurrency(commande.purchaseAmount)} TND` : "0.000 TND"}
                        </td>
                        {/* Total TVA */}
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: 500 }}>
                          {commande.totalTVA !== undefined ? `${formatCurrency(commande.totalTVA)} TND` : "0.000 TND"}
                        </td>
                        {/* Total TTC (totalTTC ou totalAmount) */}
                        <td style={{ ...tdStyle, textAlign: "right", fontWeight: 500 }}>
                          {commande.totalTTC !== undefined
                            ? `${formatCurrency(commande.totalTTC)} TND`
                            : commande.totalAmount !== undefined
                              ? `${formatCurrency(commande.totalAmount)} TND`
                              : "0.000 TND"}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <Box sx={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                            <Tooltip title="Voir détails">
                              <IconButton size="small" onClick={() => handleViewDetails(commande)} sx={{ color: "#5c6bc0", "&:hover": { backgroundColor: "#e8eaf6" } }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Modifier">
                              <IconButton size="small" onClick={() => handleEdit(commande)} sx={{ color: "#26a69a", "&:hover": { backgroundColor: "#e0f2f1" } }}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Générer PDF">
                              <IconButton size="small" onClick={() => handleGeneratePDF(commande.id)} sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "#ffebee" } }}>
                                <PictureAsPdf fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <CommandeStatusButton
                              commandeId={commande.id}
                              currentStatus={commande.status}
                              onApprove={handleApprove}
                              onReject={handleReject}
                            />
                            <Tooltip title="Copier JSON de la ligne">
                              <IconButton size="small" onClick={() => copyToClipboard(commande)}>
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton size="small" onClick={() => handleDelete(commande)} sx={{ color: "#ef5350", "&:hover": { backgroundColor: "#ffebee" } }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                        <Box sx={{ textAlign: "center" }}>
                          <Inventory sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
                          <Typography variant="body1">Aucune commande fournisseur trouvée</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {commandes.length === 0
                              ? "Aucune commande n'a été créée. Créez une nouvelle commande ou convertissez un devis accepté."
                              : "Aucune commande ne correspond à vos critères de recherche."}
                          </Typography>
                          <Button component={Link} to="/achats/commandes" variant="contained" startIcon={<AddCircle />} sx={{ mt: 2 }}>
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

        {commandeToEdit && (
          <EditCommandeFournisseurDialog
            open={editDialogOpen}
            onClose={handleCloseEditDialog}
            commande={commandeToEdit}
            onUpdate={fetchCommandes}
          />
        )}

        <CommandeDetailsDialog
          open={detailDialogOpen}
          onClose={handleCloseDetailDialog}
          commandeId={selectedCommande?.id}
        />
      </Box>
    </DashboardLayout>
  );
};

const thStyle = {
  width: "120px",
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
