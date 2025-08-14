import React from 'react';
import {
  Card,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import PropTypes from 'prop-types';

// Fonction pour formater la durée en heures/minutes
const formatDurationDisplay = (hours) => {
  if (typeof hours !== 'number') return hours;
  
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h${m.toString().padStart(2, '0')}`;
};

const PreviewStep = ({
  productType,
  productInfo,
  additionalInfo,
  handlePrev,
  handleEdit,
  handleSubmit,
  isSubmitting,
  error,
  mode = 'create'
}) => {
  const productTypeLabel = productType === 1 ? "Service" : "Produit";

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Aperçu du {productTypeLabel.toLowerCase()}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">
            <strong>Type:</strong> {productTypeLabel}
          </Typography>
          <IconButton onClick={() => handleEdit('productType')}>
            <Edit />
          </IconButton>
        </Box>
      </Card>

      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Informations principales
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                <strong>Nom:</strong> {productInfo.name}
              </Typography>
              <IconButton onClick={() => handleEdit('productInfo')}>
                <Edit />
              </IconButton>
            </Box>
          </Grid>
          
          {productType === 0 ? (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Quantité:</strong> {productInfo.stockQuantity}
              </Typography>
            </Grid>
          ) : (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Durée:</strong> {formatDurationDisplay(productInfo.duration)}
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Prix:</strong> {productInfo.salePrice} {productInfo.priceType}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>TVA:</strong> {productInfo.tvaRate}%
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Marque:</strong> {productInfo.brand || 'Non spécifié'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Catégorie:</strong> {productInfo.category || 'Non spécifié'}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Informations supplémentaires
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                <strong>Description:</strong> {additionalInfo.description || 'Aucune description'}
              </Typography>
              <IconButton onClick={() => handleEdit('additionalInfo')}>
                <Edit />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <strong>Unité:</strong> {additionalInfo.unit || 'Non spécifié'}
            </Typography>
          </Grid>
         
        </Grid>
      </Card>

      <Box display="flex" justifyContent="space-between" marginTop="30px">
        <Button 
          onClick={handlePrev} 
          variant="outlined" 
          style={{ borderRadius: '8px' }}
          disabled={isSubmitting}
        >
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          style={{ borderRadius: '8px' }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : mode === 'create' ? `Créer le ${productTypeLabel.toLowerCase()}` : 'Mettre à jour'}
        </Button>
      </Box>
    </Card>
  );
};

PreviewStep.propTypes = {
  productType: PropTypes.number.isRequired,
  productInfo: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    brand: PropTypes.string,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tvaRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceType: PropTypes.string,
    stockQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  additionalInfo: PropTypes.shape({
    description: PropTypes.string,
    unit: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
  mode: PropTypes.oneOf(['create', 'update']),
};

PreviewStep.defaultProps = {
  isSubmitting: false,
  error: null,
  mode: 'create',
};

export default PreviewStep;