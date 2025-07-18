import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Paper,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  Grid,
  Card,
  Tabs,
  Tab
} from '@mui/material';
import { 
  AddCircle,
  Edit,
  Delete,
  Refresh,
  Visibility,
  Archive,
  Unarchive,
  Business,
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { 
  getSuppliersWithAddresses, 
  deleteSupplier, 
  archiveSupplier,
  searchSuppliers,
  getArchivedSuppliers
} from 'services/supplierApi';
import toast, { Toaster } from 'react-hot-toast';
import SupplierDetailsModal from './SupplierDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// Composant SearchBar
const SearchBar = ({ searchQuery, onSearchChange, onClearSearch, searchLoading }) => (
  <Box sx={{ 
    position: 'relative', 
    mb: 3,
    backgroundColor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1,
    p: 1.5
  }}>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Rechercher des fournisseurs..."
      style={{
        width: '100%',
        padding: '12px 20px 12px 40px',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border 0.3s',
        '&:focus': {
          borderColor: '#1976d2',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
        }
      }}
    />
    <SearchIcon sx={{
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9e9e9e'
    }} />
    {searchLoading && (
      <CircularProgress 
        size={20} 
        sx={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)'
        }} 
      />
    )}
    {searchQuery && !searchLoading && (
      <IconButton
        onClick={onClearSearch}
        sx={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
);

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool
};

export function SupplierListTable({ rowsPerPage = 10 }) {
  const [activeSuppliers, setActiveSuppliers] = useState([]);
  const [archivedSuppliers, setArchivedSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [archivingId, setArchivingId] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  
  // Filtrer les fournisseurs en fonction de l'onglet actif
  const currentSuppliers = activeTab === 'active' 
    ? activeSuppliers.filter(s => !s.isArchived) 
    : archivedSuppliers.filter(s => s.isArchived);

  // Fonction pour normaliser les données des fournisseurs
  const normalizeSupplierData = (supplier) => {
    return {
      id: supplier.supplierID,
      ...supplier,
      addresses: Array.isArray(supplier.addresses) 
        ? supplier.addresses 
        : (supplier.addresses?.$values || []),
      isArchived: supplier.isArchived || false
    };
  };

  // Fonction pour charger les fournisseurs archivés
  const fetchArchivedSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getArchivedSuppliers();
      const archivedSuppliersData = response || [];
      
      const normalizedArchived = archivedSuppliersData.map(supplier => {
        const ensureArray = (data) => {
          if (Array.isArray(data)) return data;
          if (data?.$values && Array.isArray(data.$values)) return data.$values;
          return [];
        };

        return {
          id: supplier.supplierID,
          ...supplier,
          addresses: ensureArray(supplier.addresses),
          isArchived: true
        };
      });

      setArchivedSuppliers(normalizedArchived);
    } catch (err) {
      console.error('Erreur lors de la récupération des fournisseurs archivés:', err);
      setError('Échec du chargement des fournisseurs archivés');
      toast.error('Erreur lors du chargement des fournisseurs archivés');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuppliers = useCallback(async (query = '') => {
  setLoading(true);
  setError(null);

  try {
    if (query) {
      setSearchLoading(true);
      const searchResponse = await searchSuppliers(query);
      
      // Gestion des différentes structures de réponse
      let suppliersData = [];
      if (searchResponse && searchResponse.$values && Array.isArray(searchResponse.$values)) {
        suppliersData = searchResponse.$values;
      } else if (Array.isArray(searchResponse)) {
        suppliersData = searchResponse;
      } else if (searchResponse) {
        suppliersData = [searchResponse];
      }
      
      // Fonction de normalisation cohérente
      const normalize = (supplier) => ({
        id: supplier.supplierID,
        ...supplier,
        addresses: Array.isArray(supplier.addresses) 
          ? supplier.addresses 
          : (supplier.addresses?.$values || []),
        isArchived: !!supplier.isArchived
      });
      
      // Appliquer la normalisation
      const normalizedSuppliers = suppliersData.map(normalize);
      
      // Mettre à jour les listes
      setActiveSuppliers(normalizedSuppliers.filter(s => !s.isArchived));
      setArchivedSuppliers(normalizedSuppliers.filter(s => s.isArchived));
    } else {
      // Récupérer les fournisseurs actifs et archivés
      const [activeResponse, archivedResponse] = await Promise.all([
        getSuppliersWithAddresses(false), // Fournisseurs actifs
        getArchivedSuppliers()            // Fournisseurs archivés via la fonction corrigée
      ]);

      // Fonction de normalisation unique
      const normalize = (supplier) => ({
        id: supplier.supplierID,
        ...supplier,
        addresses: Array.isArray(supplier.addresses) 
          ? supplier.addresses 
          : (supplier.addresses?.$values || []),
        isArchived: !!supplier.isArchived
      });

      // Appliquer la normalisation aux deux jeux de données avec fallback
      const normalizedActive = (
        (activeResponse.$values || activeResponse || [])
      ).map(normalize);

      const normalizedArchived = (
        (archivedResponse || [])
      ).map(normalize);

      // Filtrer et mettre à jour les états
      setActiveSuppliers(normalizedActive.filter(s => !s.isArchived));
      setArchivedSuppliers(normalizedArchived.filter(s => s.isArchived));
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des fournisseurs:', err);
    setError('Échec du chargement des fournisseurs');
    toast.error('Erreur lors du chargement des fournisseurs');
  } finally {
    setLoading(false);
    setSearchLoading(false);
  }
}, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Si on passe à l'onglet des fournisseurs archivés et qu'ils ne sont pas encore chargés
    if (newValue === 'archived' && archivedSuppliers.length === 0) {
      fetchArchivedSuppliers();
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (!query.trim()) {
      fetchSuppliers();
      return;
    }
    
    setSearchLoading(true);
    const timeout = setTimeout(() => {
      fetchSuppliers(query);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchSuppliers();
  };

  const openDeleteDialog = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSupplierToDelete(null);
    setDeletingId(null);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    
    setDeletingId(supplierToDelete.id);
    
    try {
      await deleteSupplier(supplierToDelete.id);
      
      // Mettre à jour les listes
      if (supplierToDelete.isArchived) {
        setArchivedSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id));
      } else {
        setActiveSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id));
      }
      
      toast.success(`Fournisseur "${supplierToDelete.name}" supprimé avec succès`);
    } catch (err) {
      console.error('Erreur lors de la suppression du fournisseur:', err);
      
      // Gestion spécifique des erreurs 404
      if (err.response && err.response.status === 404) {
        toast.error("Fournisseur introuvable. Il a peut-être déjà été supprimé.");
        
        // Actualiser la liste des fournisseurs
        fetchSuppliers();
      } else {
        // Afficher un message d'erreur détaillé
        let errorMessage = "Échec de la suppression du fournisseur";
        if (err.response) {
          errorMessage = err.response.data?.message || 
                        err.response.data?.title ||
                        `Erreur ${err.response.status}: ${err.response.statusText}`;
        } else if (err.request) {
          errorMessage = "Pas de réponse du serveur";
        } else {
          errorMessage = err.message;
        }
        
        toast.error(errorMessage);
      }
    } finally {
      closeDeleteDialog();
    }
  };

  const handleEditSupplier = (supplierId) => {
    navigate(`/suppliers/edit/${supplierId}`);
  };

  const getPrimaryAddress = (addresses) => {
    if (!Array.isArray(addresses) || addresses.length === 0) return null;
    return addresses[0];
  };

  const handleArchiveToggle = async (supplier) => {
    if (!supplier) return;
    
    setArchivingId(supplier.id);
    
    try {
      await archiveSupplier(supplier.id);
      
      // Mettre à jour le statut d'archivage
      const updatedSupplier = { ...supplier, isArchived: !supplier.isArchived };
      
      if (supplier.isArchived) {
        // Désarchiver: déplacer des archivés vers actifs
        setArchivedSuppliers(prev => prev.filter(s => s.id !== supplier.id));
        setActiveSuppliers(prev => [...prev, updatedSupplier]);
      } else {
        // Archiver: déplacer des actifs vers archivés
        setActiveSuppliers(prev => prev.filter(s => s.id !== supplier.id));
        setArchivedSuppliers(prev => [...prev, updatedSupplier]);
      }
      
      toast.success(`Fournisseur "${supplier.name}" ${supplier.isArchived ? 'désarchivé' : 'archivé'} avec succès`);
    } catch (err) {
      console.error('Erreur lors de l\'archivage du fournisseur:', err);
      
      let errorMessage = "Échec de l'opération d'archivage";
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.title ||
                      `Erreur ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Pas de réponse du serveur";
      } else {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setArchivingId(null);
    }
  };

  const renderSupplierTable = (suppliers) => {
    return (
      <Box 
        component={Paper} 
        elevation={0} 
        sx={{ 
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          mt: 2
        }}
      >
        {suppliers.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '300px',
              textAlign: 'center',
              p: 4
            }}
          >
            <Business sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Aucun fournisseur trouvé
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery 
                ? 'Aucun résultat pour votre recherche' 
                : 'Aucun fournisseur dans cette catégorie'}
            </Typography>
          </Box>
        ) : (
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
                  }}>Fournisseur</th>
                  
                  <th style={{ 
                    width: '200px',
                    padding: '0 16px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #e0e0e0',
                    color: '#333'
                  }}>Email</th>
                  
                  <th style={{ 
                    width: '150px',
                    padding: '0 16px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #e0e0e0',
                    color: '#333'
                  }}>Adresse</th>
                  
                  <th style={{ 
                    width: '100px',
                    padding: '0 16px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #e0e0e0',
                    color: '#333'
                  }}>Téléphone</th>
                  
                  <th style={{ 
                    width: '150px',
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
                {suppliers.map((supplier, index) => {
                  const safeAddresses = Array.isArray(supplier.addresses) ? supplier.addresses : [];
                  const primaryAddress = getPrimaryAddress(safeAddresses);
                  
                  return (
                    <tr 
                      key={supplier.id}
                      style={{ 
                        borderBottom: '1px solid #eee',
                        backgroundColor: activeTab === 'archived' ? '#fafafa' : '#fff',
                        '&:hover': { backgroundColor: '#f9fafc' }
                      }}
                    >
                      <td style={{ 
                        padding: '12px 16px',
                        color: '#555',
                        fontSize: '0.875rem',
                        verticalAlign: 'middle'
                      }}>
                        {index + 1}
                      </td>
                      
                      <td style={{ 
                        padding: '12px 16px',
                        color: '#333',
                        fontSize: '0.875rem',
                        verticalAlign: 'middle'
                      }}>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 2,
                              bgcolor: activeTab === 'archived' ? '#bdbdbd' : '#42a5f5',
                              color: 'white'
                            }}
                          >
                            {supplier.name?.[0]?.toUpperCase() || '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {supplier.name || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                              Phone {supplier.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </td>
                      
                      <td style={{ 
                        padding: '12px 16px',
                        color: '#555',
                        fontSize: '0.875rem',
                        verticalAlign: 'middle'
                      }}>
                        {supplier.email || 'N/A'}
                      </td>
                      
                      <td style={{ 
                        padding: '12px 16px',
                        color: '#555',
                        fontSize: '0.875rem',
                        verticalAlign: 'middle'
                      }}>
                        {primaryAddress ? (
                          <Box>
                            <div>{primaryAddress.addressLine1 || 'N/A'}</div>
                            <div style={{ color: '#777', fontSize: '0.75rem' }}>
                              {primaryAddress.city}, {primaryAddress.country}
                            </div>
                          </Box>
                        ) : 'N/A'}
                      </td>
                      
                      <td style={{ 
                        padding: '12px 16px',
                        color: '#555',
                        fontSize: '0.875rem',
                        verticalAlign: 'middle'
                      }}>
                        {supplier.phone || 'N/A'}
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
                          <Tooltip title="Voir détails">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setDetailsModalOpen(true);
                              }}
                              sx={{ 
                                color: '#1976d2',
                                '&:hover': { backgroundColor: '#e3f2fd' }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Modifier">
                            <IconButton 
                              size="small"
                               component={Link} // Transforme en lien
                              to={`/suppliers/edit/${supplier.id}`} // Nouvelle route
                              sx={{ 
                                color: '#26a69a',
                                '&:hover': { backgroundColor: '#e0f2f1' }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={activeTab === 'archived' ? "Désarchiver" : "Archiver"}>
                            <IconButton 
                              size="small"
                              onClick={() => handleArchiveToggle(supplier)}
                              disabled={archivingId === supplier.id}
                              sx={{ 
                                color: activeTab === 'archived' ? '#4caf50' : '#ff9800',
                                '&:hover': { 
                                  backgroundColor: activeTab === 'archived' ? '#e8f5e9' : '#fff3e0' 
                                },
                                '&:disabled': { opacity: 0.5 }
                              }}
                            >
                              {archivingId === supplier.id ? (
                                <CircularProgress size={20} />
                              ) : activeTab === 'archived' ? (
                                <Unarchive fontSize="small" />
                              ) : (
                                <Archive fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Supprimer">
                            <IconButton 
                              size="small"
                              onClick={() => openDeleteDialog(supplier)}
                              disabled={deletingId === supplier.id}
                              sx={{ 
                                color: '#ef5350',
                                '&:hover': { backgroundColor: '#ffebee' },
                                '&:disabled': { opacity: 0.5 }
                              }}
                            >
                              {deletingId === supplier.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Delete fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <DashboardLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Card elevation={3} sx={{ p: 2 }}>
        <Box sx={{ p: 3 }}>
          <DeleteConfirmationModal
            open={deleteDialogOpen}
            onClose={closeDeleteDialog}
            onConfirm={handleDelete}
            title="Supprimer le fournisseur"
            message="Êtes-vous sûr de vouloir supprimer définitivement ce fournisseur ?"
            loading={deletingId !== null}
          />
          
          <SupplierDetailsModal
            supplier={selectedSupplier}
            open={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
          />
          
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold">
                Gestion des Fournisseurs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeSuppliers.filter(s => !s.isArchived).length} fournisseur(s) actif(s) • {archivedSuppliers.filter(s => s.isArchived).length} fournisseur(s) archivé(s)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => navigate("/SupplierForm")}
                sx={{ mr: 2 }}
              >
                Nouveau Fournisseur
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  setSearchQuery('');
                  fetchSuppliers();
                  toast.success('Liste des fournisseurs actualisée');
                }}
              >
                Actualiser
              </Button>
            </Grid>
          </Grid>

          {/* Onglets pour basculer entre actifs et archivés */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              mb: 3,
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Unarchive sx={{ mr: 1 }} />
                  Fournisseurs Actifs ({activeSuppliers.filter(s => !s.isArchived).length})
                </Box>
              } 
              value="active" 
              sx={{ fontWeight: 'bold' }}
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Archive sx={{ mr: 1 }} />
                  Fournisseurs Archivés ({archivedSuppliers.filter(s => s.isArchived).length})
                </Box>
              } 
              value="archived" 
              sx={{ fontWeight: 'bold' }}
            />
          </Tabs>

          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
            onClearSearch={clearSearch} 
            searchLoading={searchLoading}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress size={60} />
            </Box>
          ) : (
            renderSupplierTable(currentSuppliers)
          )}
        </Box>
      </Card>
    </DashboardLayout>
  );
}

SupplierListTable.propTypes = {
  rowsPerPage: PropTypes.number,
};

SupplierListTable.defaultProps = {
  rowsPerPage: 10,
};

export default SupplierListTable;