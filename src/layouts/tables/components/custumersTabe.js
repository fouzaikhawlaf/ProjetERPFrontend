import React, { useState, useEffect } from 'react';
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
  Avatar
} from '@mui/material';
import { 
  AddCircle,
  Edit,
  Delete,
  Search,
  Refresh
} from '@mui/icons-material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { getClients } from 'services/ApiClient';
import { useSnackbar } from 'notistack';

export function CustomersTable({ rowsPerPage = 10, onDelete, onUpdate }) {
  const { enqueueSnackbar } = useSnackbar();
  const [clients, setClients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);

      try {
        const { clients, totalCount } = await getClients(currentPage, rowsPerPage);
        setClients(clients || []);
        setTotalCount(totalCount || 0);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
        enqueueSnackbar('Error loading clients', { variant: 'error' });
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentPage, rowsPerPage, enqueueSnackbar]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implémentez la logique de recherche ici
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des Clients
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {clients.length} clients trouvés
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => window.location.href = "/clients/add"}
              sx={{ mr: 2 }}
            >
              Nouveau Client
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => setCurrentPage(1)}
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
          boxShadow: 1
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher clients..."
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
                  {clients.length > 0 ? (
                    clients.map((client, index) => (
                      <tr 
                        key={client.id}
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
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              src={client.avatar} 
                              sx={{ width: 32, height: 32, mr: 2 }}
                            >
                              {client.name?.[0]}
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
                        }}>{client.email || 'N/A'}</td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>
                          {client.address ? 
                            `${client.address.city}, ${client.address.state}` : 
                            'N/A'}
                        </td>
                        
                        <td style={{ 
                          padding: '12px 16px',
                          color: '#555',
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }}>{client.phone || 'N/A'}</td>
                        
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
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small"
                                onClick={() => onUpdate(client.id)}
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
                                onClick={() => onDelete(client.id)}
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
                            Aucun client trouvé
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

        {/* Pagination */}
        {totalPages > 1 && (
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

CustomersTable.propTypes = {
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

CustomersTable.defaultProps = {
  rowsPerPage: 10,
};