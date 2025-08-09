import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Grid,
  Paper,
  Box,
  Chip,
  Divider
} from '@mui/material';
import PropTypes from 'prop-types';

const ServiceDetailsModal = ({ service, open, onClose }) => {
  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Détails du Service
          </Typography>
          <Chip 
            label={service.isArchived ? "Archivé" : "Actif"} 
            color={service.isArchived ? "default" : "success"} 
            size="small"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Informations principales
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Nom
                </Typography>
                <Typography variant="body1">
                  {service.name || 'Non spécifié'}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Catégorie
                </Typography>
                <Typography variant="body1">
                  {service.category || 'Non spécifié'}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Durée
                </Typography>
                <Typography variant="body1">
                  {service.duration || 'Non spécifié'}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Unité
                </Typography>
                <Typography variant="body1">
                  {service.unit || 'Non spécifié'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Tarification
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Prix TTC
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  {service.price?.toFixed(2) || '0.00'} TND
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Prix HT
                </Typography>
                <Typography variant="body1">
                  {(service.price / (1 + (service.taxRate || 0) / 100))?.toFixed(2) || '0.00'} TND
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Taux TVA
                </Typography>
                <Typography variant="body1">
                  {service.taxRate || '0'}%
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Type de prix
                </Typography>
                <Typography variant="body1">
                  {service.priceType || 'Non spécifié'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Description
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body1" color="text.secondary">
                {service.description || 'Aucune description disponible'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ py: 2, px: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ServiceDetailsModal.propTypes = {
  service: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ServiceDetailsModal;