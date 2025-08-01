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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const handleFormSubmit = async () => {
    try {
      // Appel direct à la fonction de soumission du parent
      await handleSubmit(); 
    } catch (error) {
      console.error('Erreur lors de la soumission du produit:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
      toast.error(`Échec de la soumission: ${errorMessage}`);
    }
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Aperçu du produit
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">
            <strong>Type de produit:</strong> {productType}
          </Typography>
          <IconButton onClick={() => handleEdit('productType')}>
            <Edit />
          </IconButton>
        </Box>
      </Card>

      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Informations du produit
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
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Quantité:</strong> {productInfo.stockQuantity}
            </Typography>
          </Grid>
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
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <strong>Image:</strong> {additionalInfo.image ? 'Disponible' : 'Non disponible'}
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
          onClick={handleFormSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          style={{ borderRadius: '8px' }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : mode === 'create' ? 'Créer le produit' : 'Mettre à jour'}
        </Button>
      </Box>
    </Card>
  );
};

PreviewStep.propTypes = {
  productType: PropTypes.string.isRequired,
  productInfo: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    brand: PropTypes.string,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tvaRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceType: PropTypes.string,
    stockQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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