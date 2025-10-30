import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
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
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem
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
  Inventory
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import CommandeDetailsDialog from '../Componants/CommandeDetails';
// Service pour les commandes fournisseurs
import orderSupplierService from "services/orderSupplierService";

// Statuts des commandes fournisseurs
const ORDER_STATUS = {
  EN_ATTENTE: 0,
  APPROUVE: 1,
  REJETE: 2,
  LIVRE: 3,
  ANNULE: 4,
  
  getLabel: (status) => {
    switch (status) {
      case 0: return "En Attente";
      case 1: return "Approuvé";
      case 2: return "Rejeté";
      case 3: return "Livré";
      case 4: return "Annulé";
      default: return "Inconnu";
    }
  },
  
  getColor: (status) => {
    switch (status) {
      case 0: return "warning";
      case 1: return "success";
      case 2: return "error";
      case 3: return "info";
      case 4: return "default";
      default: return "default";
    }
  }
};

const statusOptions = [
  { value: "Tous", label: "Tous", color: "default" },
  { value: ORDER_STATUS.EN_ATTENTE, label: "En Attente", color: "warning" },
  { value: ORDER_STATUS.APPROUVE, label: "Approuvé", color: "success" },
  { value: ORDER_STATUS.REJETE, label: "Rejeté", color: "error" },
  { value: ORDER_STATUS.LIVRE, label: "Livré", color: "info" },
  { value: ORDER_STATUS.ANNULE, label: "Annulé", color: "default" }
];

const CommandeStatusButton = ({ commandeId, currentStatus, onStatusChange, onApprove, onReject }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

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

  return (
    <Box sx={{ display: 'flex', gap: '6px' }}>
      <Tooltip title="Approuver la commande">
        <IconButton
          size="small"
          onClick={() => onApprove(commandeId)}
          color="success"
          disabled={loading || currentStatus !== ORDER_STATUS.EN_ATTENTE}
        >
          <CheckCircle fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Rejeter la commande">
        <IconButton
          size="small"
          onClick={() => onReject(commandeId)}
          color="error"
          disabled={loading || currentStatus !== ORDER_STATUS.EN_ATTENTE}
        >
          <Cancel fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

CommandeStatusButton.propTypes = {
  commandeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  currentStatus: PropTypes.number.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

const CommandeSupplierService = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // États pour les dialogs
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleDotNetResponse = (response) => {
    console.log("Réponse brute de l'API:", response);
    
    if (response && response.$values) {
      console.log("Données trouvées dans $values:", response.$values);
      return response.$values;
    }
    if (Array.isArray(response)) {
      console.log("Réponse directe (tableau):", response);
      return response;
    }
    console.log("Aucune donnée trouvée");
    return [];
  };

  const fetchCommandes = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      console.log("Début du chargement des commandes...");
      
      const response = await orderSupplierService.getAllOrders();
      console.log("Réponse du service:", response);
      
      const commandesData = handleDotNetResponse(response);
      console.log("Données transformées:", commandesData);
      
      setCommandes(commandesData);
      setFilteredCommandes(commandesData);
      
      // Stocker les informations de débogage
      setDebugInfo({
        timestamp: new Date().toISOString(),
        totalCommandes: commandesData.length,
        rawResponse: response,
        transformedData: commandesData
      });
      
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
  }, [enqueueSnackbar]);

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
    setCommandes(prev => prev.map(commande => 
      commande.id === id ? { ...commande, state: newStatus } : commande
    ));
    setFilteredCommandes(prev => prev.map(commande => 
      commande.id === id ? { ...commande, state: newStatus } : commande
    ));
  };

  // Ajoutez ces fonctions
const handleViewDetails = (commande) => {
  setSelectedCommande(commande);
  setDetailDialogOpen(true);
};

const handleCloseDetailDialog = () => {
  setDetailDialogOpen(false);
  setSelectedCommande(null);
};



  const handleEdit = (commande) => {
    // Navigation vers la page d'édition
    navigate(`/commandes-fournisseur/edit/${commande.id}`);
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
      handleStatusChange(commandeId, ORDER_STATUS.REJETE);
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
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `commande_${commandeId}.pdf`);
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

  const handleDeleteConfirm = async () => {
    if (!selectedCommande) return;
    
    try {
      await orderSupplierService.deleteOrder(selectedCommande.id);
      setCommandes(prev => prev.filter(commande => commande.id !== selectedCommande.id));
      setFilteredCommandes(prev => prev.filter(commande => commande.id !== selectedCommande.id));
      setDeleteDialogOpen(false);
      setSelectedCommande(null);
      enqueueSnackbar("Commande supprimée avec succès", { variant: "success" });
    } catch (error) {
      console.error("Delete error:", error);
      enqueueSnackbar("Erreur lors de la suppression", { variant: "error" });
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "Tous") {
      setFilteredCommandes(commandes);
    } else {
      const numericFilter = parseInt(filter);
      setFilteredCommandes(commandes.filter(commande => commande.state === numericFilter));
    }
  };

  const getStatusColor = (status) => {
    return ORDER_STATUS.getColor(status);
  };

  const getStatusLabel = (status) => {
    return ORDER_STATUS.getLabel(status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleExportPDF = async () => {
    if (filteredCommandes.length === 0) {
      enqueueSnackbar("Aucune commande à exporter", { variant: "warning" });
      return;
    }

    try {
      const commandeIds = filteredCommandes.map(commande => commande.id);
      const pdfBlob = await orderSupplierService.generateOrderPdf(commandeIds);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.pdf`);
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
              {filteredCommandes.length} commandes trouvées sur {commandes.length} total
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
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
        <Box sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          boxShadow: 1
        }}>
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
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
                {statusOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={`${option.label} (${commandes.filter(commande => 
                      option.value === "Tous" ? true : commande.state === option.value
                    ).length})`}
                    onClick={() => handleFilterClick(option.value)}
                    color={option.color}
                    variant={activeFilter === option.value ? "filled" : "outlined"}
                    sx={{ 
                      minWidth: 100,
                      fontWeight: activeFilter === option.value ? 'bold' : 'normal'
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
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box 
            component={Paper} 
            elevation={0} 
            sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '1200px'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#f5f7fa',
                    height: '60px'
                  }}>
                    <th style={{ 
                      width: '50px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>#</th>
                    
                    <th style={{ 
                      width: '150px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Numéro Commande</th>
                    
                    <th style={{ 
                      width: '200px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Fournisseur</th>
                    
                    <th style={{ 
                      width: '120px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Date Commande</th>
                    
                    <th style={{ 
                      width: '120px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Date Livraison</th>
                    
                    <th style={{ 
                      width: '150px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Statut</th>
                    
                    <th style={{ 
                      width: '150px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'right',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Total TTC</th>
                    
                    <th style={{ 
                      width: '250px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'center',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCommandes.length > 0 ? (
                    filteredCommandes.map((commande, index) => (
                      <tr 
                        key={commande.id}
                        style={{ 
                          borderBottom: '1px solid #eee',
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f7fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fafafa';
                        }}
                      >
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>{index + 1}</td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#333',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          <Box 
                            component="span" 
                            sx={{
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'block',
                              maxWidth: '140px',
                              color: '#1976d2'
                            }}
                          >
                            {commande.orderNumber || 'N/A'}
                          </Box>
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          {commande.supplierName || commande.supplierId || 'N/A'}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          {formatDate(commande.orderDate)}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          {formatDate(commande.deliveryDate)}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle'
                        }}>
                          <Chip
                            label={getStatusLabel(commande.state)}
                            size="small"
                            color={getStatusColor(commande.state)}
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          />
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#333',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textAlign: 'right',
                          verticalAlign: 'middle'
                        }}>
                          {commande.totalTTC ? `${commande.totalTTC.toFixed(2)} TND` : '0.00 TND'}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          textAlign: 'center',
                          verticalAlign: 'middle'
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            gap: '6px',
                            flexWrap: 'wrap'
                          }}>
                           <Tooltip title="Voir détails">
  <IconButton 
    size="small"
    onClick={() => handleViewDetails(commande)}
    sx={{ 
      color: '#5c6bc0',
      '&:hover': { backgroundColor: '#e8eaf6' }
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
                            
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small"
                                onClick={() => handleEdit(commande)}
                                sx={{ 
                                  color: '#26a69a',
                                  '&:hover': { backgroundColor: '#e0f2f1' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Générer PDF">
                              <IconButton 
                                size="small"
                                onClick={() => handleGeneratePDF(commande.id)}
                                sx={{ 
                                  color: '#d32f2f',
                                  '&:hover': { backgroundColor: '#ffebee' }
                                }}
                              >
                                <PictureAsPdf fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <CommandeStatusButton 
                              commandeId={commande.id}
                              currentStatus={commande.state}
                              onStatusChange={handleStatusChange}
                              onApprove={handleApprove}
                              onReject={handleReject}
                            />
                            
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small"
                                onClick={() => handleDelete(commande)}
                                sx={{ 
                                  color: '#ef5350',
                                  '&:hover': { backgroundColor: '#ffebee' }
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
                          padding: '24px', 
                          textAlign: 'center',
                          color: '#666'
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Inventory sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                          <Typography variant="body1">
                            Aucune commande fournisseur trouvée
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {commandes.length === 0 
                              ? "Aucune commande n'a été créée. Créez une nouvelle commande ou convertissez un devis accepté."
                              : "Aucune commande ne correspond à vos critères de recherche."
                            }
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

        {/* Dialog de confirmation de suppression */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer la commande {selectedCommande?.orderNumber} ?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );  
};

export default CommandeSupplierService;