import React from 'react';
import {  Box, Card, Typography, TextField, Grid, Button, FormControl, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';


const ProductInfoStep = ({ productInfo, handleProductInfoChange, handlePrev, handleNext }) => {
  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Informations du produit
            </Typography>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={6}>
                <TextField
                  label="Nom du produit"
                  variant="outlined"
                  fullWidth
                  value={productInfo.name}
                  onChange={handleProductInfoChange('name')}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>TVA (%)</Typography>
                  <RadioGroup
                    row
                    value={productInfo.tvaRate}
                    onChange={handleProductInfoChange('tvaRate')}
                  >
                    {[4, 7, 13, 19, 0].map((rate) => (
                      <FormControlLabel
                        key={rate}
                        value={rate}
                        control={<Radio />}
                        label={`${rate}%`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>Prix unitaire (TTC ou HT)</Typography>
                  <Select
                    value={productInfo.priceType}
                    onChange={handleProductInfoChange('priceType')}
                  >
                    <MenuItem value="TTC">TTC</MenuItem>
                    <MenuItem value="HT">HT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Prix de vente"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={productInfo.salePrice}
                  onChange={handleProductInfoChange('salePrice')}
                />
               
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quantitiy"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={productInfo.quantity}  // Fixed spelling here
                  onChange={handleProductInfoChange('quantity')} // Updated field name here
                />
               
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button onClick={handlePrev} variant="outlined">
                Retour
              </Button>
              <Button onClick={handleNext} variant="contained" color="primary">
                Continuer
              </Button>
            </Box>
          </Card>
  );
};
ProductInfoStep.propTypes = {
  productInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tvaRate: PropTypes.number.isRequired,    // Add this
    priceType: PropTypes.string.isRequired, // Add this
    salePrice: PropTypes.number.isRequired, // Add this
    quantity: PropTypes.number.isRequired, // Add validation for quantity
  }).isRequired,
  handleProductInfoChange: PropTypes.func.isRequired, // Add other props here
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default ProductInfoStep;
