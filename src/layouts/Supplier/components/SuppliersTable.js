import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Box,
  Checkbox,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  Pagination,
  PaginationItem,
  Tooltip,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
  AddCircle,
  Refresh,
  Search
} from '@mui/icons-material';
import { getSuppliersWithAddresses, deleteSupplier } from 'services/supplierApi';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

export function SupplierListTable({ rowsPerPage = 10, onDelete, onUpdate }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectAllRef = useRef(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliersWithAddresses();
        const suppliersArray = data.$values || [];
        const suppliersWithAddressesArray = suppliersArray.map((supplier) => ({
          ...supplier,
          addresses: supplier.addresses?.$values || [],
        }));
        setSuppliers(suppliersWithAddressesArray);
        setFilteredSuppliers(suppliersWithAddressesArray);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, suppliers]);

  const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage);
  const displayedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Selection handlers
  const selectAll = () => setSelectedIds(new Set(displayedSuppliers.map((s) => s.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const selectOne = (id) => setSelectedIds(new Set(selectedIds.add(id)));
  const deselectOne = (id) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const selectedAll = displayedSuppliers.length > 0 && selectedIds.size === displayedSuppliers.length;
  const selectedSome = selectedIds.size > 0 && selectedIds.size < displayedSuppliers.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedSome;
    }
  }, [selectedSome]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDeleteSupplier = async (id) => {
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardLayout>
      <Card elevation={3} sx={{ p: 2 }}>
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Gestion des Fournisseurs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredSuppliers.length} fournisseur{filteredSuppliers.length !== 1 ? 's' : ''} trouvé{filteredSuppliers.length !== 1 ? 's' : ''}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => window.location.href = "/SupplierForm"}
              sx={{ mr: 2 }}
            >
              Nouveau Fournisseur
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
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
            placeholder="Rechercher fournisseurs..."
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

        {/* Table Section - Version compacte */}
        <Paper sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '600px'
          }}>
            <Box component="thead" sx={{ backgroundColor: '#f5f7fa' }}>
              <Box component="tr">
                <Box component="th" sx={{ padding: '12px', textAlign: 'left', width: '50px' }}>
                  <Checkbox
                    inputRef={selectAllRef}
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                    size="small"
                  />
                </Box>
                <Box component="th" sx={{ padding: '12px', textAlign: 'left', fontWeight: 600, minWidth: '200px' }}>Nom</Box>
                <Box component="th" sx={{ padding: '12px', textAlign: 'left', fontWeight: 600, minWidth: '150px' }}>Contact</Box>
                <Box component="th" sx={{ padding: '12px', textAlign: 'left', fontWeight: 600, minWidth: '150px' }}>Email</Box>
                <Box component="th" sx={{ padding: '12px', textAlign: 'left', fontWeight: 600, width: '120px' }}>Actions</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {displayedSuppliers.map((supplier) => {
                const isSelected = selectedIds.has(supplier.id);
                return (
                  <Box 
                    component="tr"
                    key={supplier.id} 
                    hover 
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9fafc' },
                      backgroundColor: isSelected ? '#e3f2fd' : 'inherit'
                    }}
                  >
                    <Box component="td" sx={{ padding: '12px' }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => e.target.checked ? selectOne(supplier.id) : deselectOne(supplier.id)}
                        size="small"
                      />
                    </Box>
                    <Box component="td" sx={{ padding: '12px' }}>{supplier.name}</Box>
                    <Box component="td" sx={{ padding: '12px' }}>{supplier.contactPerson}</Box>
                    <Box component="td" sx={{ padding: '12px' }}>{supplier.email}</Box>
                    <Box component="td" sx={{ padding: '12px' }}>
                      <Box sx={{ display: 'flex', gap: '4px' }}>
                        <Tooltip title="Modifier">
                          <IconButton
                            color="primary"
                            onClick={() => onUpdate(supplier.id)}
                            size="small"
                            sx={{ p: '6px' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            size="small"
                            sx={{ p: '6px' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Voir détails">
                          <IconButton
                            color="info"
                            onClick={() => handleViewDetails(supplier)}
                            size="small"
                            sx={{ p: '6px' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Paper>

        {filteredSuppliers.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1">
              {searchQuery ? 'Aucun fournisseur trouvé pour cette recherche' : 'Aucun fournisseur enregistré'}
            </Typography>
          </Box>
        )}

        {filteredSuppliers.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              renderItem={(item) => (
                <PaginationItem
                  slots={{ 
                    first: FirstPage, 
                    last: LastPage,
                    previous: NavigateBefore, 
                    next: NavigateNext 
                  }}
                  {...item}
                />
              )}
            />
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
          <DialogTitle>Détails du fournisseur</DialogTitle>
          <DialogContent dividers>
            {selectedSupplier && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Informations de base</Typography>
                    <Typography><strong>Nom:</strong> {selectedSupplier.name}</Typography>
                    <Typography><strong>Contact:</strong> {selectedSupplier.contactPerson}</Typography>
                    <Typography><strong>Email:</strong> {selectedSupplier.email}</Typography>
                    <Typography><strong>Téléphone:</strong> {selectedSupplier.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Adresses</Typography>
                    {selectedSupplier.addresses?.length > 0 ? (
                      selectedSupplier.addresses.map((address, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography><strong>Adresse {index + 1}:</strong></Typography>
                          <Typography>{address.addressLine1}</Typography>
                          {address.addressLine2 && <Typography>{address.addressLine2}</Typography>}
                          <Typography>{address.city}, {address.state} {address.postalCode}</Typography>
                          <Typography>{address.country}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>Aucune adresse enregistrée</Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </DashboardLayout>
  );
}

SupplierListTable.propTypes = {
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

SupplierListTable.defaultProps = {
  rowsPerPage: 10,
};

export default SupplierListTable;