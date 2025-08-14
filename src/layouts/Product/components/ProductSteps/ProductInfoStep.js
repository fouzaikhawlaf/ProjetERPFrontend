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

const ProductInfoStep = ({ productType, productInfo, handleProductInfoChange, handlePrev, handleNext }) => {
  const [errors, setErrors] = useState({});
  
  const validateFields = () => {
    const newErrors = {};
    
    if (!productInfo.name || productInfo.name.trim() === '') {
      newErrors.name = "Le nom est requis";
    }
    
    const salePrice = parseFloat(productInfo.salePrice);
    if (isNaN(salePrice) || salePrice <= 0) {
      newErrors.salePrice = "Le prix doit être supérieur à 0";
    }
    
    if (productInfo.tvaRate === null) {
      newErrors.tvaRate = "La TVA est requise";
    }
    
    if (productType === 0) {
      const stock = parseInt(productInfo.stockQuantity);
      if (isNaN(stock)) {
        newErrors.stockQuantity = "La quantité est requise";
      } else if (stock < 0) {
        newErrors.stockQuantity = "La quantité ne peut pas être négative";
      }
    } else if (productType === 1) {
      const duration = parseFloat(productInfo.duration);
      if (isNaN(duration)) {
        newErrors.duration = "La durée est requise";
      } else if (duration <= 0) {
        newErrors.duration = "La durée doit être supérieure à 0";
      }
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
        {productType === 0 ? "Informations du produit" : "Informations du service"}
      </Typography>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <TextField
            label={productType === 0 ? "Nom du produit *" : "Nom du service *"}
            variant="outlined"
            fullWidth
            value={productInfo.name}
            onChange={handleProductInfoChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        
        {productType === 0 ? (
          <Grid item xs={12} md={6}>
            <TextField
              label="Quantité en stock *"
              variant="outlined"
              type="number"
              fullWidth
              value={productInfo.stockQuantity}
              onChange={handleProductInfoChange('stockQuantity')}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity || "Nombre d'articles disponibles"}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            <TextField
              label="Durée (heures) *"
              variant="outlined"
              type="number"
              fullWidth
              value={productInfo.duration}
              onChange={(e) => {
                const value = e.target.value;
                // Permettre les valeurs décimales
                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                  handleProductInfoChange('duration')(e);
                }
              }}
              error={!!errors.duration}
              helperText={errors.duration || "Durée du service en heures (ex: 1.5 pour 1h30)"}
              InputProps={{ inputProps: { min: 0.1, step: 0.25 } }}
            />
          </Grid>
        )}
        
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
            {errors.tvaRate && <FormHelperText error>{errors.tvaRate}</FormHelperText>}
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
            label="Prix de vente (TTC) *"
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
  productType: PropTypes.number.isRequired,
  productInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    tvaRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceType: PropTypes.string,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stockQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  handleProductInfoChange: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default ProductInfoStep;