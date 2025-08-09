import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Card,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Pagination,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddCircle,
  Refresh,
  Inventory,
  Visibility,
  Archive,
  Unarchive
} from '@mui/icons-material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ProductDetailsModal from './ProductDetailsModal';
import { 
  getProducts, 
  deleteProduct as apiDeleteProduct, 
  archiveProduct as apiArchiveProduct,
  searchProducts
} from 'services/ProductApi';
import SearchBar from './SearchBar';

const ProductsTable = ({ 
  rowsPerPage = 10
}) => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [archivingId, setArchivingId] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // Charger les produits - VERSION CORRIGÉE
  const fetchProducts = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (query) {
        response = await searchProducts(query);
      } else {
        response = await getProducts();
      }
      
      // CORRECTION: Gestion robuste de différents formats de réponse
      let products = [];
      
      if (Array.isArray(response)) {
        products = response;
      } 
      else if (response?.$values && Array.isArray(response.$values)) {
        products = response.$values;
      }
      else if (response?.products && Array.isArray(response.products)) {
        products = response.products;
      }
      else if (typeof response === 'object' && response !== null) {
        // Si c'est un seul objet produit, le mettre dans un tableau
        products = [response];
      }
      
      setAllProducts(products);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Échec du chargement des produits');
      toast.error('Erreur lors du chargement des produits');
      setAllProducts([]); // Garantir un tableau même en cas d'erreur
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtrer les produits en fonction de l'onglet actif
  const currentProducts = useMemo(() => {
    return activeTab === 'active' 
      ? allProducts.filter(p => !p.isArchived) 
      : allProducts.filter(p => p.isArchived);
  }, [allProducts, activeTab]);

  const filteredRows = useMemo(() => {
  if (!searchQuery) return currentProducts;
  
  const query = searchQuery.toLowerCase();
  
  return currentProducts.filter(product => {
    // Recherche dans les champs textuels
    const textMatch = 
      (product.name?.toLowerCase().includes(query)) ||
      (product.description?.toLowerCase().includes(query)) ||
      (product.category?.toLowerCase().includes(query)) ||
      (product.reference?.toLowerCase().includes(query));
    
    // Recherche dans les champs numériques
    const priceMatch = 
      (product.price?.toString().includes(query)) ||
      (product.price?.toFixed(2).includes(query));
      
    const taxRateMatch = 
      (product.taxRate?.toString().includes(query)) ||
      (product.taxRate?.toFixed(2).includes(query));
      
    const stockMatch = 
      product.stockQuantity?.toString().includes(query);
    
    return textMatch || priceMatch || taxRateMatch || stockMatch;
  });
}, [currentProducts, searchQuery]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const displayedRows = useMemo(() => {
    return filteredRows.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredRows, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setDetailsModalOpen(true);
  };

   const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSearchLoading(true);
    
    // CORRECTION: Délai réduit pour une meilleure réactivité
    const searchTimer = setTimeout(() => {
      setSearchLoading(false);
    }, 300);
    
    return () => clearTimeout(searchTimer);
  };

  const handleRefreshClick = () => {
    setSearchQuery('');
    fetchProducts();
    toast.success('Liste des produits actualisée');
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    setDeletingId(productId);
    try {
      await apiDeleteProduct(productId);
      toast.success('Produit supprimé avec succès');
      await fetchProducts(searchQuery);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Échec de la suppression');
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleArchive = async (productId) => {
    setArchivingId(productId);
    try {
      await apiArchiveProduct(productId);
      toast.success('Statut d\'archivage mis à jour');
      await fetchProducts(searchQuery);
    } catch (err) {
      console.error('Erreur lors de l\'archivage:', err);
      toast.error('Échec de la mise à jour de l\'archivage');
    } finally {
      setArchivingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    await handleDelete(productToDelete.id);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchProducts();
  };

  const handleArchiveToggle = async (product) => {
    if (!product) return;
    await handleArchive(product.id);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProduct = (product) => {
    navigate(`/products/edit/${product.id}`, {
      state: { product }
    });
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
            onClose={cancelDelete}
            onConfirm={confirmDelete}
            title="Supprimer le produit"
            message="Êtes-vous sûr de vouloir supprimer définitivement ce produit ?"
            loading={deletingId !== null}
          />
          
          <ProductDetailsModal
            product={selectedProduct}
            open={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
          />

          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold">
                Gestion des Produits
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {allProducts.filter(p => !p.isArchived).length} produit(s) actif(s) • {allProducts.filter(p => p.isArchived).length} produit(s) archivé(s)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => navigate("/Ajouter")}
                sx={{ mr: 2 }}
              >
                Nouveau Produit
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefreshClick}
              >
                Actualiser
              </Button>
            </Grid>
          </Grid>

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
                  Produits Actifs ({allProducts.filter(p => !p.isArchived).length})
                </Box>
              } 
              value="active" 
              sx={{ fontWeight: 'bold' }}
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Archive sx={{ mr: 1 }} />
                  Produits Archivés ({allProducts.filter(p => p.isArchived).length})
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
              {displayedRows.length === 0 ? (
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
                  <Inventory sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Aucun produit trouvé
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery 
                      ? 'Aucun résultat pour votre recherche' 
                      : 'Aucun produit dans cette catégorie'}
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
                          width: '250px',
                          padding: '0 16px',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textAlign: 'left',
                          borderBottom: '2px solid #e0e0e0',
                          color: '#333'
                        }}>Produit</th>
                        
                        <th style={{ 
                          width: '150px',
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
                          textAlign: 'right',
                          borderBottom: '2px solid #e0e0e0',
                          color: '#333'
                        }}>Prix TTC</th>
                        
                        <th style={{ 
                          width: '150px',
                          padding: '0 16px',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textAlign: 'right',
                          borderBottom: '2px solid #e0e0e0',
                          color: '#333'
                        }}>Prix HT</th>
                        
                        <th style={{ 
                          width: '100px',
                          padding: '0 16px',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textAlign: 'center',
                          borderBottom: '2px solid #e0e0e0',
                          color: '#333'
                        }}>TVA</th>
                        
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
                      {displayedRows.map((row, index) => (
                        <tr 
                          key={row.id}
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
                            {(currentPage - 1) * rowsPerPage + index + 1}
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
                                {row?.name?.[0]?.toUpperCase() || '?'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {row?.name || 'Non nommé'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                  Ref: {row?.reference || '-'}
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
                            <Chip 
                              label={row?.description || 'Inconnu'} 
                              size="small" 
                              sx={{ 
                                bgcolor: 'primary.light', 
                                color: 'white',
                                textTransform: 'uppercase' 
                              }} 
                            />
                          </td>
                          
                          <td style={{ 
                            padding: '12px 16px',
                            color: '#555',
                            fontSize: '0.875rem',
                            verticalAlign: 'middle',
                            textAlign: 'right'
                          }}>
                            <Typography fontWeight={600} color="success.main">
                              {row?.price?.toFixed(2) || '0.00'} TND
                            </Typography>
                          </td>
                          
                          <td style={{ 
                            padding: '12px 16px',
                            color: '#555',
                            fontSize: '0.875rem',
                            verticalAlign: 'middle',
                            textAlign: 'right'
                          }}>
                            <Typography>
                              {(row?.price / (1 + (row?.taxRate || 0) / 100))?.toFixed(2) || '0.00'} TND
                            </Typography>
                          </td>
                          
                          <td style={{ 
                            padding: '12px 16px',
                            color: '#555',
                            fontSize: '0.875rem',
                            verticalAlign: 'middle',
                            textAlign: 'center'
                          }}>
                            <Chip 
                              label={`${row?.taxRate || 0}%`} 
                              size="small" 
                              variant="outlined" 
                            />
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
                                  onClick={() => handleViewDetails(row)}
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
                                  onClick={() => handleEditProduct(row)}
                                  sx={{ 
                                    color: '#26a69a',
                                    '&:hover': { backgroundColor: '#e0f2f1' }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title={activeTab === 'archived' ? "Désarchiver" : "Archiver"}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleArchiveToggle(row)}
                                  disabled={archivingId === row.id}
                                  sx={{ 
                                    color: activeTab === 'archived' ? '#4caf50' : '#ff9800',
                                    '&:hover': { 
                                      backgroundColor: activeTab === 'archived' ? '#e8f5e9' : '#fff3e0' 
                                    },
                                    '&:disabled': { opacity: 0.5 }
                                  }}
                                >
                                  {archivingId === row.id ? (
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
                                  onClick={() => handleDeleteClick(row)}
                                  disabled={deletingId === row.id}
                                  sx={{ 
                                    color: '#ef5350',
                                    '&:hover': { backgroundColor: '#ffebee' },
                                    '&:disabled': { opacity: 0.5 }
                                  }}
                                >
                                  {deletingId === row.id ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <DeleteIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </Box>
          )}

          {filteredRows.length > 0 && !loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
                shape="rounded"
                showFirstButton 
                showLastButton 
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '50%'
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Card>
    </DashboardLayout>
  );
};

ProductsTable.propTypes = {
  rowsPerPage: PropTypes.number,
};

ProductsTable.defaultProps = {
  rowsPerPage: 10,
};

export default ProductsTable;