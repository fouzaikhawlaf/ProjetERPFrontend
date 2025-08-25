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
  Cancel,
  PendingActions
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { 
  getAllDevisServices,
  acceptDevis,
  rejectDevis
} from "services/devisPurchaseService";
import { useSnackbar } from "notistack";
import AcceptDevisDialog from "../devisServiceComponants/acceptDevisDialog";
import RejectDevisDialog from "../devisServiceComponants/RejectDevisDialog";
import DeleteDevisDialog from "../devisServiceComponants/DeleteDevisDialog";
import EditDevisDialog from "../devisServiceComponants/EditDevisDialog";
import ViewDevisDialog from "../devisServiceComponants/ViewDevisDialog";

// Import des dialogs


const statusOptions = [
  { value: "Tous", label: "Tous", color: "default" },
  { value: 0, label: "En Cours", color: "warning" },
  { value: 1, label: "Accepté", color: "success" },
  { value: 2, label: "Rejeté", color: "error" }
];

const DevisStatusButton = ({ devisId, currentStatus, onStatusChange, onAccept, onReject }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

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
          onClick={() => onAccept(devisId)}
          color="success"
          disabled={loading}
        >
          <CheckCircle fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Rejeter le devis">
        <IconButton
          size="small"
          onClick={() => onReject(devisId)}
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
  onStatusChange: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

const DevisService = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // États pour les dialogs
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleDotNetResponse = (response) => {
    if (response && response.$values) return response.$values;
    if (Array.isArray(response)) return response;
    return [];
  };

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllDevisServices();
      const servicesData = handleDotNetResponse(response);
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Erreur de chargement des devis de service");
      enqueueSnackbar("Erreur de chargement", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchServices(); 
  }, [enqueueSnackbar]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === "") {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter((service) =>
      Object.values(service).some((value) =>
        value && value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredServices(filtered);
  };

  const handleStatusChange = (id, newStatus) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, statut: newStatus } : service
    ));
    setFilteredServices(prev => prev.map(service => 
      service.id === id ? { ...service, statut: newStatus } : service
    ));
  };

  const handleView = (service) => {
    setSelectedDevis(service);
    setViewDialogOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedDevis(service);
    setEditDialogOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedDevis(service);
    setDeleteDialogOpen(true);
  };

  const handleAccept = (devisId) => {
    const service = services.find(s => s.id === devisId);
    setSelectedDevis(service);
    setAcceptDialogOpen(true);
  };

  const handleReject = (devisId) => {
    const service = services.find(s => s.id === devisId);
    setSelectedDevis(service);
    setRejectDialogOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      // Normally you would call a delete API here
      // For now, we'll just filter it out from the state
      setServices(prev => prev.filter(service => service.id !== id));
      setFilteredServices(prev => prev.filter(service => service.id !== id));
      enqueueSnackbar("Devis supprimé avec succès", { variant: "success" });
    } catch (error) {
      console.error("Delete error:", error);
      enqueueSnackbar("Erreur lors de la suppression", { variant: "error" });
    }
  };

  const handleCreateClick = () => {
    // Logic to create a new devis
    window.location.href = "/CreerDevisService";
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "Tous") {
      setFilteredServices(services);
    } else {
      const numericFilter = parseInt(filter);
      setFilteredServices(services.filter(service => service.statut === numericFilter));
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

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des Devis de Service
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredServices.length} devis trouvés
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
              onClick={fetchServices}
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
                placeholder="Rechercher par référence, description..."
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
                    label={`${option.label} (${services.filter(service => 
                      option.value === "Tous" ? true : service.statut === option.value
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
                    }}>Description</th>
                    
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
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <tr 
                        key={service.id}
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
                            {service.devisNumber || 'N/A'}
                          </Box>
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          {service.description || 'N/A'}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          verticalAlign: 'middle'
                        }}>
                          <Chip
                            label={getStatusLabel(service.statut)}
                            size="small"
                            color={getStatusColor(service.statut)}
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
                          {service.totalTTC ? `${service.totalTTC.toFixed(2)} TND` : '0.00 TND'}
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
                                onClick={() => handleView(service)}
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
                                onClick={() => handleEdit(service)}
                                sx={{ 
                                  color: '#26a69a',
                                  '&:hover': { backgroundColor: '#e0f2f1' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <DevisStatusButton 
                              devisId={service.id}
                              currentStatus={service.statut}
                              onStatusChange={handleStatusChange}
                              onAccept={handleAccept}
                              onReject={handleReject}
                            />
                            
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small"
                                onClick={() => handleDelete(service)}
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
                            Aucun devis de service trouvé
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

        {/* Dialogs */}
        <ViewDevisDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          devis={selectedDevis}
        />
        
        <EditDevisDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          devis={selectedDevis}
          onUpdate={fetchServices}
        />
        
        <DeleteDevisDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          devis={selectedDevis}
          onDelete={handleDeleteConfirm}
        />
        
        <AcceptDevisDialog
          open={acceptDialogOpen}
          onClose={() => setAcceptDialogOpen(false)}
          devis={selectedDevis}
          onStatusChange={handleStatusChange}
        />
        
        <RejectDevisDialog
          open={rejectDialogOpen}
          onClose={() => setRejectDialogOpen(false)}
          devis={selectedDevis}
          onStatusChange={handleStatusChange}
        />
      </Box>
    </DashboardLayout>
  );
};

export default DevisService;