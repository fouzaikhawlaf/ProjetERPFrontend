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
  Pending
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { 
  getAllDevis, 
  deleteDevis, 
  getDevisByStatus, 
  searchDevis,
  validateDevis 
} from "services/DevisClientService";
import { useSnackbar } from "notistack";

const statusOptions = [
  { value: "Tous", label: "Tous", color: "default" },
  { value: 0, label: "Brouillon", color: "primary" },
  { value: 1, label: "Envoyé", color: "warning" },
  { value: 2, label: "Validé", color: "success" },
  { value: 3, label: "Annulé", color: "error" }
];

const DevisValidationButton = ({ devisId, currentStatus, onValidateSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleValidate = async () => {
    setLoading(true);
    try {
      await validateDevis(devisId);
      onValidateSuccess(devisId);
      enqueueSnackbar("Devis validé avec succès", { variant: "success" });
      setOpen(false);
    } catch (error) {
      enqueueSnackbar("Erreur lors de la validation", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 2) {
    return (
      <Chip
        icon={<CheckCircle />}
        label="Validé"
        color="success"
        size="small"
      />
    );
  }

  return (
    <>
      <Tooltip title="Valider le devis">
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          color="primary"
        >
          <Pending />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmer la validation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes (optionnel)"
            fullWidth
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleValidate}
            color="primary"
            disabled={loading}
            startIcon={<CheckCircle />}
          >
            {loading ? 'Validation...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const DevisClient = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [devis, setDevis] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDotNetResponse = (response) => {
    if (response && response.$values) return response.$values;
    if (Array.isArray(response)) return response;
    return [];
  };

  const fetchDevis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = activeFilter === "Tous" 
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

  useEffect(() => { fetchDevis(); }, [activeFilter, enqueueSnackbar]);

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

  const handleView = (id) => window.location.href = `/devis/view/${id}`;
  const handleEdit = (id) => window.location.href = `/devis/edit/${id}`;

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression?")) return;
    try {
      await deleteDevis(id);
      setDevis(prev => prev.filter(d => d.id !== id));
      setFilteredDevis(prev => prev.filter(d => d.id !== id));
      enqueueSnackbar("Devis supprimé", { variant: "success" });
    } catch (error) {
      console.error("Delete error:", error);
      enqueueSnackbar("Erreur de suppression", { variant: "error" });
    }
  };

  const handleValidateSuccess = (id) => {
    setDevis(prev => prev.map(d => 
      d.id === id ? { ...d, status: 2 } : d
    ));
    setFilteredDevis(prev => prev.map(d => 
      d.id === id ? { ...d, status: 2 } : d
    ));
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
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => window.location.href = "/Vente/Nouveau/Devis"}
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
                placeholder="Rechercher par référence, client..."
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
                    label={`${option.label} (${devis.filter(d => 
                      option.value === "Tous" ? true : d.status === option.value
                    ).length})`}
                    onClick={() => setActiveFilter(option.value)}
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
                      width: '200px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Client</th>
                    
                    <th style={{ 
                      width: '150px',
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      color: '#333'
                    }}>Date Création</th>
                    
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
                      width: '150px', // Augmenté pour accommoder le nouveau bouton
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
                  {filteredDevis.length > 0 ? (
                    filteredDevis.map((devis, index) => (
                      <tr 
                        key={devis.id}
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
                            {devis.reference || 'N/A'}
                          </Box>
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>{devis.clientName || 'N/A'}</td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          {devis.creationDate ? 
                            new Date(devis.creationDate).toLocaleDateString('fr-FR') : 
                            'N/A'}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle'
                        }}>
                          <Chip
                            label={
                              devis.status === 0 ? 'Brouillon' :
                              devis.status === 1 ? 'Envoyé' :
                              devis.status === 2 ? 'Validé' : 'Annulé'
                            }
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              backgroundColor: 
                                devis.status === 0 ? '#e3f2fd' :
                                devis.status === 1 ? '#fff8e1' :
                                devis.status === 2 ? '#e8f5e9' : '#ffebee',
                              color: 
                                devis.status === 0 ? '#1565c0' :
                                devis.status === 1 ? '#ff8f00' :
                                devis.status === 2 ? '#2e7d32' : '#c62828'
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
                          {devis.totalTTC ? `${devis.totalTTC.toFixed(2)} TND` : '0.00 TND'}
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
                                onClick={() => handleView(devis.id)}
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
                                onClick={() => handleEdit(devis.id)}
                                sx={{ 
                                  color: '#26a69a',
                                  '&:hover': { backgroundColor: '#e0f2f1' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <DevisValidationButton 
                              devisId={devis.id}
                              currentStatus={devis.status}
                              onValidateSuccess={handleValidateSuccess}
                            />
                            
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small"
                                onClick={() => handleDelete(devis.id)}
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
                        colSpan="7" 
                        style={{ 
                          padding: '24px', 
                          textAlign: 'center',
                          color: '#666'
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
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
      </Box>
    </DashboardLayout>
  );
};
DevisValidationButton.propTypes = {
  devisId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  currentStatus: PropTypes.number.isRequired,
  onValidateSuccess: PropTypes.func.isRequired
};
export default DevisClient;