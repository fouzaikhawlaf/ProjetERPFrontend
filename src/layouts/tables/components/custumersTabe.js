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
  Alert,
  Avatar,
  Grid,
  Chip,
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
  Unarchive
} from '@mui/icons-material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { getClients, deleteClient, searchClients, archiveClient } from 'services/ApiClient';
import toast, { Toaster } from 'react-hot-toast';
import ClientDetailsModal from './ClientDetailsModal';
import DeleteClientDialog from './DeleteClientDialog';
import SearchBar from './SearchBar';
import ArchiveClientDialog from './ArchiveClientDialog';

export function CustomersTable({ rowsPerPage = 10 }) {
  const [activeClients, setActiveClients] = useState([]);
  const [archivedClients, setArchivedClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [clientToArchive, setClientToArchive] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  
  // Filtrer les clients en fonction de l'onglet actif
  const currentClients = activeTab === 'active' 
    ? activeClients.filter(c => !c.isArchived) 
    : archivedClients.filter(c => c.isArchived);

  const fetchClients = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);

    try {
      if (query) {
        setSearchLoading(true);
        const searchResponse = await searchClients(query);
        
        // Handle search response structure
        let clientsData = [];
        if (searchResponse && searchResponse.$values && Array.isArray(searchResponse.$values)) {
          clientsData = searchResponse.$values;
        } else if (Array.isArray(searchResponse)) {
          clientsData = searchResponse;
        } else if (searchResponse) {
          clientsData = [searchResponse];
        }
        
        // Normalize client data
        const normalizedClients = clientsData.map(client => {
          const ensureArray = (data) => {
            if (Array.isArray(data)) return data;
            if (data?.$values && Array.isArray(data.$values)) return data.$values;
            return [];
          };

          return {
            ...client,
            phoneNumbers: ensureArray(client.phoneNumbers),
            addresses: ensureArray(client.addresses),
            // Conserver le statut d'archivage original
            isArchived: client.isArchived
          };
        });
        
        // Mettre à jour les listes avec les résultats de recherche
        setActiveClients(normalizedClients.filter(c => !c.isArchived));
        setArchivedClients(normalizedClients.filter(c => c.isArchived));
      } else {
        // Fetch active and archived clients separately
        const [activeResponse, archivedResponse] = await Promise.all([
          getClients(1, 10000, false), // Active clients
          getClients(1, 10000, true)    // Archived clients
        ]);

        // Extract and normalize active clients
        const activeClientsData = activeResponse.clients || [];
        const normalizedActive = activeClientsData.map(client => {
          const ensureArray = (data) => {
            if (Array.isArray(data)) return data;
            if (data?.$values && Array.isArray(data.$values)) return data.$values;
            return [];
          };

          return {
            ...client,
            phoneNumbers: ensureArray(client.phoneNumbers),
            addresses: ensureArray(client.addresses),
            // Forcer le statut actif
            isArchived: false
          };
        });

        // Extract and normalize archived clients
        const archivedClientsData = archivedResponse.clients || [];
        const normalizedArchived = archivedClientsData.map(client => {
          const ensureArray = (data) => {
            if (Array.isArray(data)) return data;
            if (data?.$values && Array.isArray(data.$values)) return data.$values;
            return [];
          };

          return {
            ...client,
            phoneNumbers: ensureArray(client.phoneNumbers),
            addresses: ensureArray(client.addresses),
            // Forcer le statut archivé
            isArchived: true
          };
        });

        setActiveClients(normalizedActive);
        setArchivedClients(normalizedArchived);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients');
      toast.error('Erreur lors du chargement des clients');
      setActiveClients([]);
      setArchivedClients([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (query) => {
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
      fetchClients(query);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchClients();
  };

  const openDeleteDialog = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    setDeletingId(clientToDelete.clientID);
    
    try {
      await deleteClient(clientToDelete.clientID);
      
      // Supprimer de la liste appropriée
      if (clientToDelete.isArchived) {
        setArchivedClients(prev => prev.filter(c => c.clientID !== clientToDelete.clientID));
      } else {
        setActiveClients(prev => prev.filter(c => c.clientID !== clientToDelete.clientID));
      }
      
      toast.success(`Client "${clientToDelete.name}" supprimé avec succès`);
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Échec de la suppression du client');
    } finally {
      setDeletingId(null);
      closeDeleteDialog();
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/clients/${id}`);
  };

  const handleEditClient = (clientId) => {
    navigate(`/clients/edit/${clientId}`);
  };

  const getPrimaryAddress = (addresses) => {
    if (!Array.isArray(addresses) || addresses.length === 0) return null;
    const billingAddress = addresses.find(a => 
      a.type && a.type.toLowerCase().includes('billing')
    );
    return billingAddress || addresses[0];
  };

  const getPrimaryPhone = (phoneNumbers) => {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) return null;
    const mobilePhone = phoneNumbers.find(p => 
      p.type && p.type.toLowerCase().includes('mobile')
    );
    return mobilePhone || phoneNumbers[0];
  };

  const handleViewAllDetails = (client) => {
    setSelectedClient(client);
    setDetailsModalOpen(true);
  };

  const handleArchiveToggle = async () => {
    if (!clientToArchive) return;
    
    try {
      await archiveClient(clientToArchive.clientID);
      
      // Mettre à jour le statut d'archivage
      const updatedClient = { ...clientToArchive, isArchived: !clientToArchive.isArchived };
      
      if (clientToArchive.isArchived) {
        // Désarchiver: déplacer des archivés vers actifs
        setArchivedClients(prev => prev.filter(c => c.clientID !== clientToArchive.clientID));
        setActiveClients(prev => [...prev, updatedClient]);
      } else {
        // Archiver: déplacer des actifs vers archivés
        setActiveClients(prev => prev.filter(c => c.clientID !== clientToArchive.clientID));
        setArchivedClients(prev => [...prev, updatedClient]);
      }
      
      toast.success(`Client "${clientToArchive.name}" ${clientToArchive.isArchived ? 'désarchivé' : 'archivé'} avec succès`);
      setArchiveDialogOpen(false);
    } catch (err) {
      console.error('Error toggling archive status:', err);
      toast.error(`Échec de l'opération d'archivage`);
    }
  };

  const renderClientTable = (clients) => {
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
        {clients.length === 0 ? (
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
            <Archive sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Aucun client trouvé
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery 
                ? 'Aucun résultat pour votre recherche' 
                : 'Aucun client dans cette catégorie'}
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
                {clients.map((client, index) => {
                  const safeAddresses = Array.isArray(client.addresses) ? client.addresses : [];
                  const safePhones = Array.isArray(client.phoneNumbers) ? client.phoneNumbers : [];
                  
                  const primaryAddress = getPrimaryAddress(safeAddresses);
                  const primaryPhone = getPrimaryPhone(safePhones);
                  
                  return (
                    <tr 
                      key={client.clientID}
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
                              onClick={() => handleViewAllDetails(client)}
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
                          
                          <Tooltip title={activeTab === 'archived' ? "Désarchiver" : "Archiver"}>
                            <IconButton 
                              size="small"
                              onClick={() => {
                                setClientToArchive(client);
                                setArchiveDialogOpen(true);
                              }}
                              sx={{ 
                                color: activeTab === 'archived' ? '#4caf50' : '#ff9800',
                                '&:hover': { 
                                  backgroundColor: activeTab === 'archived' ? '#e8f5e9' : '#fff3e0' 
                                }
                              }}
                            >
                              {activeTab === 'archived' ? <Unarchive fontSize="small" /> : <Archive fontSize="small" />}
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
          <DeleteClientDialog
            open={deleteDialogOpen}
            onClose={closeDeleteDialog}
            clientToDelete={clientToDelete}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
          
          <ClientDetailsModal 
            client={selectedClient}
            open={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
          />
          
          <ArchiveClientDialog
            open={archiveDialogOpen}
            onClose={() => setArchiveDialogOpen(false)}
            clientToArchive={clientToArchive}
            onArchive={handleArchiveToggle}
          />
          
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold">
                Gestion des Clients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeClients.filter(c => !c.isArchived).length} client(s) actif(s) • {archivedClients.filter(c => c.isArchived).length} client(s) archivé(s)
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
                  fetchClients();
                  toast.success('Liste des clients actualisée');
                }}
              >
                Actualiser
              </Button>
            </Grid>
          </Grid>

          {/* Tabs pour basculer entre actifs et archivés */}
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
                  Clients Actifs ({activeClients.filter(c => !c.isArchived).length})
                </Box>
              } 
              value="active" 
              sx={{ fontWeight: 'bold' }}
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Archive sx={{ mr: 1 }} />
                  Clients Archivés ({archivedClients.filter(c => c.isArchived).length})
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
            renderClientTable(currentClients)
          )}
        </Box>
      </Card>
    </DashboardLayout>
  );
}

CustomersTable.propTypes = {
  rowsPerPage: PropTypes.number,
};

CustomersTable.defaultProps = {
  rowsPerPage: 10,
};