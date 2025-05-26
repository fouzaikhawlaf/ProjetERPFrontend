import React, { useState } from 'react';
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

const ProductsTable = ({ rows = [], rowsPerPage = 10, onDelete, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.productType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const displayedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
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
          <Button variant="contained" startIcon={<AddCircle />} sx={{ mr: 2 }}  onClick={() => window.location.href = "/Produit"}>
            Ajouter Produit
          </Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => setSearchQuery('')}>
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
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper elevation={0} sx={{ overflowX: 'auto' }}>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <Box component="thead" sx={{ bgcolor: 'background.default' }}>
            <Box component="tr">
              <Box component="th" sx={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Checkbox checked={selectedAll} indeterminate={selectedSome} onChange={(e) => e.target.checked ? selectAll() : deselectAll()} />
              </Box>
              <Box component="th" sx={{ padding: '16px', fontWeight: 600, textAlign: 'left' }}>Produit</Box>
              <Box component="th" sx={{ padding: '16px', fontWeight: 600, textAlign: 'left' }}>Type</Box>
              <Box component="th" sx={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Prix</Box>
              <Box component="th" sx={{ padding: '16px', fontWeight: 600, textAlign: 'left' }}>Stock</Box>
              <Box component="th" sx={{ padding: '16px', fontWeight: 600, textAlign: 'left' }}>TVA</Box>
              <Box component="th" sx={{ padding: '16px', fontWeight: 600, textAlign: 'center' }}>Actions</Box>
            </Box>
          </Box>

          <Box component="tbody">
            {displayedRows.map((row) => {
              const isSelected = selectedIds.has(row.id);
              const stockColor = row.Quantity > 0 ? 'success' : 'error';
              const stockLabel = row.Quantity > 0 ? 'En stock' : 'Rupture';

              return (
                <Box component="tr" key={row.id} sx={{ 
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'action.selected' : 'inherit',
                  '&:hover': { backgroundColor: 'action.hover' }
                }} onClick={() => handleViewDetails(row)}>
                  <Box component="td" sx={{ padding: '16px' }}>
                    <Checkbox checked={isSelected} onChange={(e) => e.target.checked ? selectOne(row.id) : deselectOne(row.id)} />
                  </Box>
                  <Box component="td" sx={{ padding: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{row.name[0]}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{row.name}</Typography>
                       
                      </Box>
                    </Box>
                  </Box>
                  <Box component="td" sx={{ padding: '16px' }}>
                    <Chip label={row.itemTypeArticle} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', textTransform: 'uppercase' }} />
                  </Box>
                  <Box component="td" sx={{ padding: '16px', textAlign: 'right' }}>
                    <Typography fontWeight={600} color="success.main">{row.price?.toFixed(2)} TND</Typography>
                    <Typography variant="body2" color="text.secondary">HT: {(row.price / (1 + row.taxRate / 100))?.toFixed(2)} TND</Typography>
                  </Box>
                  <Box component="td" sx={{ padding: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Inventory fontSize="small" color={stockColor} />
                      <Typography color={`${stockColor}.main`} fontWeight={600}>{row.stockQuantity || 0}</Typography>
                      <Typography variant="body2" color="text.secondary">{stockLabel}</Typography>
                    </Box>
                  </Box>
                  <Box component="td" sx={{ padding: '16px' }}>
                    <Chip label={`${row.taxRate}%`} size="small" variant="outlined" />
                  </Box>
                  <Box component="td" sx={{ padding: '16px', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton color="primary" onClick={(e) => { e.stopPropagation(); onUpdate(row.id); }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            {displayedRows.length === 0 && (
              <Box component="tr">
                <Box component="td" colSpan={7} sx={{ py: 6, textAlign: 'center' }}>
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
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
        <DialogTitle>Détails du Produit</DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Informations de base</Typography>
                <Typography><strong>Nom:</strong> {selectedProduct.name}</Typography>
              
                <Typography><strong>Type:</strong> {selectedProduct.productType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Détails financiers</Typography>
                <Typography><strong>Prix de vente:</strong> {selectedProduct.price?.toFixed(2)} TND</Typography>
                <Typography><strong>TVA:</strong> {selectedProduct.taxRate}%</Typography>
                <Typography><strong>Stock:</strong> {selectedProduct.stockQuantity || 0}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

ProductsTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      reference: PropTypes.string,
      productType: PropTypes.string,
      salePrice: PropTypes.number,
      Quantity: PropTypes.number,
      taxRate: PropTypes.number,
    })
  ).isRequired,
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

ProductsTable.defaultProps = {
  rowsPerPage: 10,
};

export default ProductsTable;