import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Box,
  Checkbox,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  Pagination,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddCircle,
  Refresh,
  Search,
  Inventory
} from '@mui/icons-material';

const ProductsTable = ({ 
  allProducts = [], 
  rowsPerPage = 10, 
  onDelete, 
  onUpdate, 
  onRefresh 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredRows = useMemo(() => {
    if (!searchQuery) return allProducts;
    
    const query = searchQuery.toLowerCase();
    return allProducts.filter(row => {
      const name = String(row?.name || '').toLowerCase();
      const itemTypeArticle = String(row?.itemTypeArticle || '').toLowerCase();
      const reference = String(row?.reference || '').toLowerCase();
      
      return name.includes(query) || 
             itemTypeArticle.includes(query) || 
             reference.includes(query);
    });
  }, [allProducts, searchQuery]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const displayedRows = useMemo(() => {
    return filteredRows.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredRows, currentPage, rowsPerPage]);

  const selectAll = () => setSelectedIds(new Set(displayedRows.map((s) => s.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const selectOne = (id) => setSelectedIds(new Set(selectedIds.add(id)));
  const deselectOne = (id) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const selectedAll = displayedRows.length > 0 && selectedIds.size === displayedRows.length;
  const selectedSome = selectedIds.size > 0 && selectedIds.size < displayedRows.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRefreshClick = () => {
    setSearchQuery('');
    if (onRefresh) onRefresh();
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete);
      setDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <Card elevation={3} sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold">Gestion des Produits</Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredRows.length} produit{filteredRows.length !== 1 ? 's' : ''} trouvé{filteredRows.length !== 1 ? 's' : ''}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
          <Button variant="contained" startIcon={<AddCircle />} sx={{ mr: 2 }} onClick={() => window.location.href = "/Produit"}>
            Ajouter Produit
          </Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefreshClick}>
            Actualiser
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher produits..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper elevation={0} sx={{ 
        overflowX: 'auto',
        '& th, & td': { boxSizing: 'border-box' }
      }}>
        <Box component="table" sx={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          tableLayout: 'fixed'
        }}>
          <Box component="thead" sx={{ bgcolor: 'background.default' }}>
            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box component="th" sx={{ width: '10%', p: 2, textAlign: 'left', borderRight: '1px solid', borderColor: 'divider' }}>
                <Checkbox 
                  checked={selectedAll} 
                  indeterminate={selectedSome} 
                  onChange={(e) => e.target.checked ? selectAll() : deselectAll()} 
                />
              </Box>
              <Box component="th" sx={{ width: '25%', p: 2, textAlign: 'left', borderRight: '1px solid', borderColor: 'divider' }}>Produit</Box>
              <Box component="th" sx={{ width: '15%', p: 2, textAlign: 'left', borderRight: '1px solid', borderColor: 'divider' }}>Type</Box>
              <Box component="th" sx={{ width: '20%', p: 2, textAlign: 'center', borderRight: '1px solid', borderColor: 'divider' }}>Prix</Box>
              <Box component="th" sx={{ width: '15%', p: 2, textAlign: 'left', borderRight: '1px solid', borderColor: 'divider' }}>TVA</Box>
              <Box component="th" sx={{ width: '15%', p: 2, textAlign: 'center' }}>Actions</Box>
            </Box>
          </Box>

          <Box component="tbody">
            {displayedRows.map((row) => {
              const isSelected = selectedIds.has(row.id);
              return (
                <Box component="tr" key={row.id} sx={{ 
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'action.selected' : 'inherit',
                  '&:hover': { backgroundColor: 'action.hover' },
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }} onClick={() => handleViewDetails(row)}>
                  <Box component="td" sx={{ width: '10%', p: 2, verticalAlign: 'middle', borderRight: '1px solid', borderColor: 'divider' }}>
                    <Checkbox 
                      checked={isSelected} 
                      onChange={(e) => e.target.checked ? selectOne(row.id) : deselectOne(row.id)} 
                    />
                  </Box>
                  <Box component="td" sx={{ width: '25%', p: 2, verticalAlign: 'middle', borderRight: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{row?.name?.[0] || '?'}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{row?.name || 'Non nommé'}</Typography>
                        <Typography variant="body2" color="text.secondary">{row?.reference || '-'}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box component="td" sx={{ width: '15%', p: 2, verticalAlign: 'middle', borderRight: '1px solid', borderColor: 'divider' }}>
                    <Chip 
                      label={row?.itemTypeArticle || 'Inconnu'} 
                      size="small" 
                      sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', textTransform: 'uppercase' }} 
                    />
                  </Box>
                  <Box component="td" sx={{ width: '20%', p: 2, textAlign: 'right', verticalAlign: 'middle', borderRight: '1px solid', borderColor: 'divider' }}>
                    <Typography fontWeight={600} color="success.main">{row?.price?.toFixed(2) || '0.00'} TND</Typography>
                    <Typography variant="body2" color="text.secondary">HT: {(row?.price / (1 + (row?.taxRate || 0) / 100))?.toFixed(2) || '0.00'} TND</Typography>
                  </Box>
                  <Box component="td" sx={{ width: '15%', p: 2, verticalAlign: 'middle', borderRight: '1px solid', borderColor: 'divider' }}>
                    <Chip label={`${row?.taxRate || 0}%`} size="small" variant="outlined" />
                  </Box>
                  <Box component="td" sx={{ width: '15%', p: 2, textAlign: 'center', verticalAlign: 'middle' }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton color="primary" onClick={(e) => { e.stopPropagation(); onUpdate(row.id); }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={(e) => handleDeleteClick(e, row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            {displayedRows.length === 0 && (
              <Box component="tr">
                <Box component="td" colSpan={6} sx={{ py: 6, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Inventory sx={{ fontSize: 40, color: 'text.disabled' }} />
                    <Typography variant="h6">Aucun produit trouvé</Typography>
                    <Typography variant="body2">
                      Essayez de modifier vos critères de recherche ou ajoutez un nouveau produit
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {filteredRows.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            color="primary" 
            showFirstButton 
            showLastButton 
          />
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
        <DialogTitle>Détails du Produit</DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Informations de base</Typography>
                <Typography><strong>Nom:</strong> {selectedProduct?.name || 'Non nommé'}</Typography>
                <Typography><strong>Type:</strong> {selectedProduct?.itemTypeArticle || 'Inconnu'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Détails financiers</Typography>
                <Typography><strong>Prix de vente:</strong> {selectedProduct?.price?.toFixed(2) || '0.00'} TND</Typography>
                <Typography><strong>TVA:</strong> {selectedProduct?.taxRate || 0}%</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

ProductsTable.propTypes = {
  allProducts: PropTypes.array,
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};

ProductsTable.defaultProps = {
  allProducts: [],
  rowsPerPage: 10,
};

export default ProductsTable;