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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
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
  getAllDevisProducts,
  acceptDevis,
  rejectDevis
} from "services/devisPurchaseService";
import { useSnackbar } from "notistack";

const statusOptions = [
  { value: "Tous", label: "Tous", color: "default" },
  { value: 0, label: "En Cours", color: "warning" },
  { value: 1, label: "Accepté", color: "success" },
  { value: 2, label: "Rejeté", color: "error" }
];

const DevisStatusButton = ({ devisId, currentStatus, onStatusChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptDevis(devisId);
      onStatusChange(devisId, 1);
      enqueueSnackbar("Devis accepté avec succès", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Erreur lors de l'acceptation du devis", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectDevis(devisId);
      onStatusChange(devisId, 2);
      enqueueSnackbar("Devis rejeté avec succès", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Erreur lors du rejet du devis", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 1) {
    return (
      <Chip
        icon={<CheckCircle />}
        label="Accepté"
        color="success"
        size="small"
      />
    );
  }

  if (currentStatus === 2) {
    return (
      <Chip
        icon={<Cancel />}
        label="Rejeté"
        color="error"
        size="small"
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: '6px' }}>
      <Tooltip title="Accepter le devis">
        <IconButton
          size="small"
          onClick={handleAccept}
          color="success"
          disabled={loading}
        >
          <CheckCircle fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Rejeter le devis">
        <IconButton
          size="small"
          onClick={handleReject}
          color="error"
          disabled={loading}
        >
          <Cancel fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

DevisStatusButton.propTypes = {
  devisId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  currentStatus: PropTypes.number.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

const DevisProduitTable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleDotNetResponse = (response) => {
    if (response && response.$values) return response.$values;
    if (Array.isArray(response)) return response;
    return [];
  };

  const fetchProduits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllDevisProducts();
      const produitsData = handleDotNetResponse(response);
      setProduits(produitsData);
      setFilteredProduits(produitsData);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Erreur de chargement des devis de produit");
      enqueueSnackbar("Erreur de chargement", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchProduits(); 
  }, [enqueueSnackbar]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === "") {
      setFilteredProduits(produits);
      return;
    }

    const filtered = produits.filter((produit) =>
      Object.values(produit).some((value) =>
        value && value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredProduits(filtered);
  };

  const handleStatusChange = (id, newStatus) => {
    setProduits(prev => prev.map(produit => 
      produit.id === id ? { ...produit, statut: newStatus } : produit
    ));
    setFilteredProduits(prev => prev.map(produit => 
      produit.id === id ? { ...produit, statut: newStatus } : produit
    ));
  };

  const handleView = (produit) => {
    setSelectedProduit(produit);
    setShowViewModal(true);
  };

  const handleEdit = (id) => {
    // Logic to edit devis
    console.log("Edit devis:", id);
    enqueueSnackbar("Fonctionnalité d'édition à implémenter", { variant: "info" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce devis de produit?")) return;
    
    try {
      // Normally you would call a delete API here
      // For now, we'll just filter it out from the state
      setProduits(prev => prev.filter(produit => produit.id !== id));
      setFilteredProduits(prev => prev.filter(produit => produit.id !== id));
      enqueueSnackbar("Devis supprimé avec succès", { variant: "success" });
    } catch (error) {
      console.error("Delete error:", error);
      enqueueSnackbar("Erreur lors de la suppression", { variant: "error" });
    }
  };

  const handleCreateClick = () => {
    // Logic to create a new devis
    window.location.href = "/CreerDevisProduit";
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "Tous") {
      setFilteredProduits(produits);
    } else {
      const numericFilter = parseInt(filter);
      setFilteredProduits(produits.filter(produit => produit.statut === numericFilter));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return "warning";
      case 1: return "success";
      case 2: return "error";
      default: return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return "En Cours";
      case 1: return "Accepté";
      case 2: return "Rejeté";
      default: return "Inconnu";
    }
  };

  const getDesignation = (produit) => {
    if (produit.items && produit.items.$values && produit.items.$values.length > 0) {
      return produit.items.$values[0].designation;
    }
    return "N/A";
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des Devis de Produit
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredProduits.length} devis trouvés
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={handleCreateClick}
              sx={{ mr: 2 }}
            >
              Nouveau Devis
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchProduits}
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
                placeholder="Rechercher par référence, désignation..."
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
                    label={`${option.label} (${produits.filter(produit => 
                      option.value === "Tous" ? true : produit.statut === option.value
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
                minWidth: '1000px'
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
                      width: '200px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Référence</th>
                    
                    <th style={{ 
                      width: '250px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Désignation</th>
                    
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
                      width: '200px',
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
                  {filteredProduits.length > 0 ? (
                    filteredProduits.map((produit, index) => (
                      <tr 
                        key={produit.id}
                        style={{ 
                          borderBottom: '1px solid #eee',
                          '&:hover': { backgroundColor: '#f9fafc' }
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
                              maxWidth: '180px',
                              color: '#1976d2'
                            }}
                          >
                            {produit.devisNumber || 'N/A'}
                          </Box>
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          {getDesignation(produit)}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle'
                        }}>
                          <Chip
                            label={getStatusLabel(produit.statut)}
                            size="small"
                            color={getStatusColor(produit.statut)}
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
                          {produit.totalTTC ? `${produit.totalTTC.toFixed(2)} TND` : '0.00 TND'}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          textAlign: 'center',
                          verticalAlign: 'middle'
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            gap: '6px'
                          }}>
                            <Tooltip title="Voir">
                              <IconButton 
                                size="small"
                                onClick={() => handleView(produit)}
                                sx={{ 
                                  color: '#5c6bc0',
                                  '&:hover': { backgroundColor: '#e8eaf6' }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small"
                                onClick={() => handleEdit(produit.id)}
                                sx={{ 
                                  color: '#26a69a',
                                  '&:hover': { backgroundColor: '#e0f2f1' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <DevisStatusButton 
                              devisId={produit.id}
                              currentStatus={produit.statut}
                              onStatusChange={handleStatusChange}
                            />
                            
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small"
                                onClick={() => handleDelete(produit.id)}
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
                        colSpan="6" 
                        style={{ 
                          padding: '24px', 
                          textAlign: 'center',
                          color: '#666'
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body1">
                            Aucun devis de produit trouvé
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

        {/* View Modal */}
        <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="md" fullWidth>
          <DialogTitle>Détails du Devis Produit</DialogTitle>
          <DialogContent>
            {selectedProduit && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Référence
                    </Typography>
                    <Typography variant="body1">
                      {selectedProduit.devisNumber || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date de création
                    </Typography>
                    <Typography variant="body1">
                      {selectedProduit.dateCreation || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Statut
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedProduit.statut)}
                      size="small"
                      color={getStatusColor(selectedProduit.statut)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total TTC
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedProduit.totalTTC ? `${selectedProduit.totalTTC.toFixed(2)} TND` : '0.00 TND'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Désignation
                    </Typography>
                    <Typography variant="body1">
                      {getDesignation(selectedProduit)}
                    </Typography>
                  </Grid>
                  {selectedProduit.items && selectedProduit.items.$values && selectedProduit.items.$values.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        Articles
                      </Typography>
                      {selectedProduit.items.$values.map((item, index) => (
                        <Box key={index} sx={{ p: 1, border: '1px solid #eee', borderRadius: 1, mb: 1 }}>
                          <Typography variant="body2">
                            <strong>Désignation:</strong> {item.designation}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantité:</strong> {item.quantite}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Prix Unitaire:</strong> {item.prixUnitaire} TND
                          </Typography>
                          <Typography variant="body2">
                            <strong>TVA:</strong> {item.tva}%
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowViewModal(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default DevisProduitTable;