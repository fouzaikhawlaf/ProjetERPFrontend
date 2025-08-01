import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  TextField, 
  Grid, 
  Button, 
  FormControl, 
  Select, 
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
} from '@mui/material';
import PropTypes from 'prop-types';

const ProductInfoStep = ({ productInfo, handleProductInfoChange, handlePrev, handleNext }) => {
  const [errors, setErrors] = useState({});
  
  // Validation des champs
  const validateFields = () => {
    const newErrors = {};
    
    if (!productInfo.name || productInfo.name.trim() === '') {
      newErrors.name = "Le nom du produit est requis";
    }
    
    // Correction: conversion en nombre pour la validation
    const salePrice = Number(productInfo.salePrice);
    if (!productInfo.salePrice || isNaN(salePrice) || salePrice <= 0) {
      newErrors.salePrice = "Le prix doit être supérieur à 0";
    }
    
    if (productInfo.tvaRate === null || productInfo.tvaRate === undefined) {
      newErrors.tvaRate = "La TVA est requise";
    }
    
    // Validation de la quantité
    const quantity = Number(productInfo.stockQuantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.stockQuantity = "La quantité doit être un nombre positif";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateFields()) {
      handleNext();
    }
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h6" gutterBottom>
        Informations du produit
      </Typography>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nom du produit *"
            variant="outlined"
            fullWidth
            value={productInfo.name}
            onChange={handleProductInfoChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Quantité en stock"
            variant="outlined"
            type="number"
            fullWidth
            value={productInfo.stockQuantity}
            onChange={handleProductInfoChange('stockQuantity')}
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity}
            InputProps={{ 
              inputProps: { 
                min: 0
              } 
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography gutterBottom>TVA (%) *</Typography>
            <RadioGroup
              row
              value={productInfo.tvaRate}
              onChange={handleProductInfoChange('tvaRate')}
            >
              {[0, 7, 13, 19].map((rate) => (
                <FormControlLabel
                  key={rate}
                  value={rate}
                  control={<Radio />}
                  label={`${rate}%`}
                />
              ))}
            </RadioGroup>
            {errors.tvaRate && (
              <FormHelperText error>{errors.tvaRate}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography gutterBottom>Type de prix *</Typography>
            <Select
              value={productInfo.priceType}
              onChange={handleProductInfoChange('priceType')}
            >
              <MenuItem value="Fixed">TTC</MenuItem>
              <MenuItem value="Variable">HT</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Prix de vente *"
            variant="outlined"
            type="number"
            fullWidth
            value={productInfo.salePrice}
            onChange={handleProductInfoChange('salePrice')}
            error={!!errors.salePrice}
            helperText={errors.salePrice}
            InputProps={{ 
              inputProps: { 
                min: 0.01,
                step: 0.01
              } 
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Catégorie *"
            variant="outlined"
            fullWidth
            value={productInfo.category}
            onChange={handleProductInfoChange('category')}
            error={!!errors.category}
            helperText={errors.category || "Ex: Électronique, Meuble"}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" marginTop="30px">
        <Button 
          onClick={handlePrev} 
          variant="outlined" 
          style={{ borderRadius: '8px' }}
        >
          Retour
        </Button>
        <Button 
          onClick={handleContinue} 
          variant="contained" 
          color="primary"
          style={{ borderRadius: '8px' }}
        >
          Continuer
        </Button>
      </Box>
    </Card>
  );
};

ProductInfoStep.propTypes = {
  productInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    stockQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    brand: PropTypes.string,
    tvaRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    priceType: PropTypes.string.isRequired,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  handleProductInfoChange: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default ProductInfoStep;