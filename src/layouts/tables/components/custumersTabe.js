import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
  Grid,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  AddCircle,
  Edit,
  Delete,
  Search as SearchIcon,
  Refresh,
  Visibility,
  Clear
} from '@mui/icons-material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { getClients, deleteClient, searchClients } from 'services/ApiClient';
import { useSnackbar } from 'notistack';

export function CustomersTable({ rowsPerPage = 10 }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [clients, setClients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const navigate = useNavigate();

  const fetchClients = useCallback(async (page = currentPage, query = '') => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (query) {
        setSearchLoading(true);
        response = await searchClients(query);
        
        // CORRECTION : Extraction du tableau depuis la propriété $values
        let clientsData = [];
        if (response && response.$values && Array.isArray(response.$values)) {
          clientsData = response.$values;
        } else if (Array.isArray(response)) {
          clientsData = response;
        } else if (response) {
          clientsData = [response];
        }
        
        const normalizedClients = clientsData.map(client => {
          const ensureArray = (data) => {
            if (Array.isArray(data)) return data;
            if (data?.$values && Array.isArray(data.$values)) return data.$values;
            return [];
          };

          return {
            ...client,
            phoneNumbers: ensureArray(client.phoneNumbers),
            addresses: ensureArray(client.addresses)
          };
        });
        
        setClients(normalizedClients);
        setTotalCount(normalizedClients.length);
      } else {
        response = await getClients(page, rowsPerPage);
        const clientsData = response.clients || [];
        
        const normalizedClients = clientsData.map(client => {
          const ensureArray = (data) => {
            if (Array.isArray(data)) return data;
            if (data?.$values && Array.isArray(data.$values)) return data.$values;
            return [];
          };

          return {
            ...client,
            phoneNumbers: ensureArray(client.phoneNumbers),
            addresses: ensureArray(client.addresses)
          };
        });
        
        setClients(normalizedClients);
        setTotalCount(response.totalCount || 0);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients');
      enqueueSnackbar('Erreur lors du chargement des clients', { 
        variant: 'error',
        autoHideDuration: 3000
      });
      setClients([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [currentPage, rowsPerPage, enqueueSnackbar]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (!query.trim()) {
      fetchClients();
      return;
    }
    
    setSearchLoading(true);
    const timeout = setTimeout(() => {
      fetchClients(1, query);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchClients();
  };

  // Fonction pour ouvrir la boîte de dialogue de suppression
  const openDeleteDialog = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  // Fonction pour fermer la boîte de dialogue de suppression
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  // Fonction pour supprimer un client
  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    setDeletingId(clientToDelete.clientID);
    closeDeleteDialog();
    
    try {
      await deleteClient(clientToDelete.clientID);
      
      const action = (snackbarId) => (
        <>
          <Button 
            color="secondary" 
            size="small"
            onClick={() => {
              closeSnackbar(snackbarId);
              fetchClients().catch(console.error);
            }}
          >
            Annuler
          </Button>
        </>
      );
      
      enqueueSnackbar('Client supprimé avec succès', { 
        variant: 'success',
        autoHideDuration: 5000,
        action,
        onClose: () => {
          fetchClients();
        }
      });
      
      setClients(clients.filter(c => c.clientID !== clientToDelete.clientID));
    } catch (err) {
      console.error('Error deleting client:', err);
      enqueueSnackbar('Échec de la suppression du client', { 
        variant: 'error',
        autoHideDuration: 3000
      });
      fetchClients();
    } finally {
      setDeletingId(null);
    }
  };

  // Fonction pour visualiser les détails
  const handleViewDetails = (id) => {
    navigate(`/clients/${id}`);
  };

  // AJOUT DE LA FONCTION MANQUANTE POUR CORRIGER L'ERREUR
  // Fonction pour modifier un client
  const handleEditClient = (clientId) => {
    navigate(`/clients/edit/${clientId}`);
  };

  // Fonction pour obtenir l'adresse principale
  const getPrimaryAddress = (addresses) => {
    if (!Array.isArray(addresses) || addresses.length === 0) return null;
    const billingAddress = addresses.find(a => 
      a.type && a.type.toLowerCase().includes('billing')
    );
    return billingAddress || addresses[0];
  };

  // Fonction pour obtenir le numéro de téléphone principal
  const getPrimaryPhone = (phoneNumbers) => {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) return null;
    const mobilePhone = phoneNumbers.find(p => 
      p.type && p.type.toLowerCase().includes('mobile')
    );
    return mobilePhone || phoneNumbers[0];
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Boîte de dialogue de suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer le client &quot;{clientToDelete?.name}&quot; ?
              Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Annuler
            </Button>
            <Button 
              onClick={handleDelete} 
              color="error"
              variant="contained"
              disabled={deletingId === clientToDelete?.clientID}
              startIcon={
                deletingId === clientToDelete?.clientID ? 
                <CircularProgress size={20} /> : 
                <Delete />
              }
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des Clients
            </Typography>
            <Typography variant="body2" color="text.secondary">
    {/* Modification ici */}
    {searchQuery 
      ? `${clients.length} résultat${clients.length !== 1 ? 's' : ''} Trouvé${clients.length !== 1 ? 's' : ''}` 
      : `${clients.length} client${clients.length !== 1 ? 's' : ''} affiché(s) `}
  </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => navigate("/Client-step")}
              sx={{ mr: 2 }}
            >
              Nouveau Client
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
                fetchClients();
                enqueueSnackbar('Liste des clients actualisée', { 
                  variant: 'info',
                  autoHideDuration: 2000
                });
              }}
            >
              Actualiser
            </Button>
          </Grid>
        </Grid>

        {/* Search Section */}
        <Box sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          boxShadow: 1,
          position: 'relative'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher clients..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {searchLoading && (
            <CircularProgress 
              size={24} 
              sx={{
                position: 'absolute',
                right: 40,
                top: '50%',
                transform: 'translateY(-50%)'
              }} 
            />
          )}
        </Box>

        {/* Content Section */}
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
                    }}>Client</th>
                    
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
                  {Array.isArray(clients) && clients.length > 0 ? (
                    clients.map((client, index) => {
                      const safeAddresses = Array.isArray(client.addresses) ? client.addresses : [];
                      const safePhones = Array.isArray(client.phoneNumbers) ? client.phoneNumbers : [];
                      
                      const primaryAddress = getPrimaryAddress(safeAddresses);
                      const primaryPhone = getPrimaryPhone(safePhones);
                      
                      return (
                        <tr 
                          key={client.clientID}
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
                          }}>
                            {searchQuery ? index + 1 : (currentPage - 1) * rowsPerPage + index + 1}
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
                                  bgcolor: 'primary.main',
                                  color: 'white'
                                }}
                              >
                                {client.name?.[0]?.toUpperCase() || '?'}
                              </Avatar>
                              <Typography variant="body2">
                                {client.name || 'N/A'}
                              </Typography>
                            </Box>
                          </td>
                          
                          <td style={{ 
                            padding: '12px 16px',
                            color: '#555',
                            fontSize: '0.875rem',
                            verticalAlign: 'middle'
                          }}>
                            {client.email || 'N/A'}
                          </td>
                          
                          <td style={{ 
                            padding: '12px 16px',
                            color: '#555',
                            fontSize: '0.875rem',
                            verticalAlign: 'middle'
                          }}>
                            {primaryAddress ? (
                              <Box>
                                <div>{primaryAddress.addressLine || 'N/A'}</div>
                                <div style={{ color: '#777', fontSize: '0.75rem' }}>
                                  {primaryAddress.postalCode} {primaryAddress.region}
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
                            {primaryPhone ? (
                              <Box>
                                <div>{primaryPhone.number || 'N/A'}</div>
                                {primaryPhone.type && (
                                  <Chip 
                                    label={primaryPhone.type}
                                    size="small"
                                    sx={{ 
                                      mt: 0.5,
                                      fontSize: '0.65rem',
                                      height: '20px'
                                    }}
                                  />
                                )}
                              </Box>
                            ) : 'N/A'}
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
                                  onClick={() => handleViewDetails(client.clientID)}
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
                                  onClick={() => handleEditClient(client.clientID)}
                                  sx={{ 
                                    color: '#26a69a',
                                    '&:hover': { backgroundColor: '#e0f2f1' }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Supprimer">
                                <IconButton 
                                  size="small"
                                  onClick={() => openDeleteDialog(client)}
                                  disabled={deletingId === client.clientID}
                                  sx={{ 
                                    color: '#ef5350',
                                    '&:hover': { backgroundColor: '#ffebee' },
                                    '&:disabled': { opacity: 0.5 }
                                  }}
                                >
                                  {deletingId === client.clientID ? (
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
                    })
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
                            {searchQuery ? 'Aucun résultat trouvé' : 'Aucun client trouvé'}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {searchQuery 
                              ? 'Essayez d\'autres termes de recherche' 
                              : 'Essayez de modifier vos critères de recherche'}
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

        {/* Pagination - Masqué pendant la recherche */}
        {!searchQuery && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                Première
              </Button>
              <Button
                variant="outlined"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Précédent
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "contained" : "outlined"}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outlined"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Suivant
              </Button>
              <Button
                variant="outlined"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                Dernière
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}

// CORRECTION DES PROPTYPES
CustomersTable.propTypes = {
  rowsPerPage: PropTypes.number,
};

CustomersTable.defaultProps = {
  rowsPerPage: 10,
};