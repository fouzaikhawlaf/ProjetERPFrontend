import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Edit } from '@mui/icons-material'; // Import edit icon
import PropTypes from 'prop-types';
import { createProduct } from 'services/productService'; // Assurez-vous du bon chemin d'import
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
  // Validation des données avant soumission
  const validateData = () => {
    if (!productInfo.name || !productInfo.salePrice || !additionalInfo.description) {
      alert('Veuillez remplir toutes les informations nécessaires.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      // Préparation des données pour l'API
      const productData = {
        name: productInfo.name, // string
        description: additionalInfo.description, // string
        price: parseFloat(productInfo.salePrice), // number
        productType: 0, // int (par exemple, type par défaut)
        taxRate: productInfo.tvaRate, // number
        priceType: productInfo.priceType, // string (TTC ou HT)
        category: additionalInfo.category, // string
        unit: additionalInfo.unit, // string (kg, etc.)
        quantity: parseInt(productInfo.quantity, 10), // integer
      };

      const response = await createProduct(productData);
      console.log('Product created successfully:', response);
  
      // Affichez un toast (facultatif) pour une confirmation rapide
      toast.success("Produit créé avec succès !");
  
      // Redirigez vers la page de succès
      navigate('/success');
    } catch (error) {
      console.error('Error creating product:', error.response ? error.response.data : error.message);
  
      // Affichez une notification d'erreur
      toast.error("Erreur lors de la création du produit.");
    }
  };
  
  
  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Aperçu du produit
      </Typography>

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
              <strong>Quantity:</strong> {productInfo.quantity}
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
  productInfo: PropTypes.object.isRequired,
  additionalInfo: PropTypes.object.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default PreviewStep;
