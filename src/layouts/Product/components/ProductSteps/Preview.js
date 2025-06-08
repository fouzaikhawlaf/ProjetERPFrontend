import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { createProduct } from 'services/ProductApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PreviewStep = ({
  productType,
  productInfo,
  additionalInfo,
  handlePrev,
  handleEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateData = () => {
    const requiredFields = {
      name: productInfo.name,
      salePrice: productInfo.salePrice,
      description: additionalInfo.description,
      category: additionalInfo.category,
      unit: additionalInfo.unit,
      quantity: productInfo.quantity,
      tvaRate: productInfo.tvaRate
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(`Champs manquants: ${missingFields.join(', ')}`);
      return false;
    }

    if (isNaN(productInfo.salePrice)) {
      toast.error('Le prix doit être un nombre valide');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateData()) return;
      setLoading(true);

      const productData = {
        name: productInfo.name,
        description: additionalInfo.description,
        price: parseFloat(productInfo.salePrice),
        taxRate: parseFloat(productInfo.tvaRate),
        tvaRate: parseFloat(productInfo.tvaRate),
        priceType: productInfo.priceType.toLowerCase(),
        category: additionalInfo.category,
        unit: additionalInfo.unit,
        itemTypeArticle: productType === 'Matériel' ? 0 : 1,
        stockQuantity: parseInt(productInfo.quantity, 10)
      };

      const response = await createProduct(productData);
      toast.success("Produit créé avec succès !");
      navigate('/products');
    } catch (error) {
      toast.error(
        error.response?.data?.Errors?.[0]?.Message || 
        'Erreur lors de la création du produit'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Aperçu du produit
      </Typography>

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
              <strong>Quantité:</strong> {productInfo.quantity}
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
                <strong>Description:</strong> {additionalInfo.description}
              </Typography>
              <IconButton onClick={() => handleEdit('additionalInfo')}>
                <Edit />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <strong>Catégorie:</strong> {additionalInfo.category}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <strong>Unité:</strong> {additionalInfo.unit}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Box display="flex" justifyContent="space-between" marginTop="30px">
        <Button onClick={handlePrev} variant="outlined" style={{ borderRadius: '8px' }}>
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ borderRadius: '8px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Soumettre'}
        </Button>
      </Box>
    </Card>
  );
};

PreviewStep.propTypes = {
  productType: PropTypes.string.isRequired,
  productInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tvaRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    priceType: PropTypes.string.isRequired,
  }).isRequired,
  additionalInfo: PropTypes.shape({
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default PreviewStep;