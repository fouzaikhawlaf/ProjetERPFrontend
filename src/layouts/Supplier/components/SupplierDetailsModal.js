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
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  Clear, 
  LocationOn, 
  Phone, 
  Business,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const SupplierDetailsModal = ({ supplier, open, onClose }) => {
  if (!supplier) return null;

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
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ 
            bgcolor: !supplier.isArchived ? '#4caf50' : '#f44336', 
            mr: 2,
            width: 40, 
            height: 40
          }}>
            <Business sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {supplier.name || 'Nom non disponible'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {!supplier.isArchived ? 'Fournisseur actif' : 'Fournisseur archivé'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {/* Section Informations de base */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Informations principales
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Nom:</strong> {supplier.name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Contact:</strong> {supplier.contactPerson || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Email:</strong> {supplier.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Téléphone:</strong> {supplier.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Statut:</strong> 
                    <Chip 
                      label={!supplier.isArchived ? "Actif" : "Archivé"} 
                      size="small" 
                      color={!supplier.isArchived ? "success" : "error"}
                      sx={{ ml: 1 }}
                      icon={!supplier.isArchived ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Section Adresses */}
          {supplier.addresses?.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1 }} /> Adresses
                </Typography>
                <List dense>
                  {supplier.addresses.map((address, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemText
                        primary={address.addressLine1 || 'N/A'}
                        secondary={
                          <>
                            <div>{address.addressLine2 || ''}</div>
                            <div>{address.city}, {address.state} {address.postalCode}</div>
                            <div>{address.country}</div>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
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
          sx={{ borderRadius: 1 }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SupplierDetailsModal.propTypes = {
  supplier: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

SupplierDetailsModal.defaultProps = {
  supplier: null,
};

export default SupplierDetailsModal;