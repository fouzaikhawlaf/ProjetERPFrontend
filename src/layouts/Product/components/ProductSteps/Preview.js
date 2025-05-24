import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  CircularProgress,
  Avatar
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
    if (!productInfo.name || !productInfo.salePrice || !additionalInfo.description) {
      alert('Veuillez remplir toutes les informations nécessaires.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      const productData = {
        name: productInfo.name,
        description: additionalInfo.description,
        price: parseFloat(productInfo.salePrice),
        productType: 0,
        taxRate: productInfo.tvaRate,
        priceType: productInfo.priceType,
        category: additionalInfo.category,
        unit: additionalInfo.unit,
        quantity: parseInt(productInfo.quantity, 10),
        imagePath: additionalInfo.imageFile ? URL.createObjectURL(additionalInfo.imageFile) : null,
      };

      const response = await createProduct(productData);
      console.log('Product created successfully:', response);
      toast.success("Produit créé avec succès !");
      navigate('/success');
    } catch (error) {
      console.error('Error creating product:', error.response ? error.response.data : error.message);
      toast.error("Erreur lors de la création du produit.");
    }
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Aperçu du produit
      </Typography>

      {/* Image Preview */}
      {additionalInfo.imageFile && (
        <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Image du produit
          </Typography>
          <Avatar
            src={URL.createObjectURL(additionalInfo.imageFile)}
            sx={{ width: 150, height: 150, margin: '0 auto' }}
            variant="rounded"
          />
        </Card>
      )}

      {/* Product Type Section */}
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

      {/* Product Information Section */}
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

      {/* Additional Information Section */}
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

      {/* Action Buttons */}
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
    imageFile: PropTypes.instanceOf(File)
  }).isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default PreviewStep;