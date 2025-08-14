// AdditionalInfoStep.js
import React from 'react';
import { Box, Card, Typography, TextField, Grid, Button, FormControl, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

const AdditionalInfoStep = ({ additionalInfo, handleAdditionalInfoChange, handlePrev, handleNext }) => {
  // Liste des catégories disponibles (incluant service et formation)
  const categories = [
    'Électronique',
    'Mobilier',
    'Vêtements',
    'Alimentation',
    'Beauté',
    'Sport',
    'Automobile',
    'Immobilier',
    'Santé',
    'Éducation',
    'Service',
    'Formation',
    'Conseil',
    'Maintenance'
  ];
  
  // Liste des unités disponibles
  const units = [
    'Pièce',
    'Kg',
    'Litre',
    'Mètre',
    'Heure',
    'Paquet',
    'Boîte',
    'Carton',
    'Set',
    'Paire'
  ];

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h6" gutterBottom>
        Informations supplémentaires
      </Typography>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={additionalInfo.description}
            onChange={handleAdditionalInfoChange('description')}
            placeholder="Décrivez votre produit ou service en détail..."
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography gutterBottom>Catégorie *</Typography>
            <Select
              value={additionalInfo.category}
              onChange={handleAdditionalInfoChange('category')}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography gutterBottom>Unité</Typography>
            <Select
              value={additionalInfo.unit}
              onChange={handleAdditionalInfoChange('unit')}
            >
              {units.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          onClick={handleNext} 
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

AdditionalInfoStep.propTypes = {
  additionalInfo: PropTypes.shape({
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  handleAdditionalInfoChange: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default AdditionalInfoStep;