// ProductDetailsModal.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  Paper,
  Avatar
} from '@mui/material';
import { 
  Clear, 
  Inventory,
  LocalOffer,
  Description,
  AttachMoney,
  Percent,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const ProductDetailsModal = ({ product, open, onClose }) => {
  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
        borderBottom: '1px solid #e0e0e0',
        py: 2
      }}>
        <Box display="flex" alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: !product.isArchived ? '#4caf50' : '#f44336', 
              mr: 2,
              width: 40, 
              height: 40
            }}
          >
            <Inventory sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {product.name || 'Nom non disponible'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {!product.isArchived ? 'Produit actif' : 'Produit archivé'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Section Informations de base */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid #eee', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1, color: 'primary.main' }} /> Informations de base
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Nom</Typography>
                <Typography>{product.name || 'Non nommé'}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Référence</Typography>
                <Typography>{product.reference || '-'}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                <Chip 
                  label={product.itemTypeArticle || 'Inconnu'} 
                  color="primary"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Statut</Typography>
                <Chip 
                  label={!product.isArchived ? "Actif" : "Archivé"} 
                  size="medium" 
                  color={!product.isArchived ? "success" : "error"}
                  sx={{ ml: 1 }}
                  icon={!product.isArchived ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Section Détails financiers */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid #eee', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1, color: 'success.main' }} /> Détails financiers
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Prix de vente (TTC)</Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {product.price?.toFixed(2) || '0.00'} TND
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Prix hors taxes (HT)</Typography>
                <Typography variant="h6">
                  {(product.price / (1 + (product.taxRate || 0) / 100))?.toFixed(2) || '0.00'} TND
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Taux de TVA</Typography>
                <Chip 
                  label={`${product.taxRate || 0}%`} 
                  color="secondary"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Coût de revient</Typography>
                <Typography>
                  {product.costPrice ? `${product.costPrice.toFixed(2)} TND` : 'Non spécifié'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Section Description */}
          {product.description && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Description
                </Typography>
                <Typography>
                  {product.description}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1, px: 4, py: 1 }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductDetailsModal.propTypes = {
  product: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ProductDetailsModal.defaultProps = {
  product: null,
};

export default ProductDetailsModal;