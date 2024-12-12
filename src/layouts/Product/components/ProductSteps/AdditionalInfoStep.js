import React from 'react';
import {  Box, Card, Typography, TextField, Grid, Button, FormControl, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';


const AdditionalInfoStep = ({ additionalInfo, handleAdditionalInfoChange, handlePrev, handleNext }) => {
  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
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
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <Typography gutterBottom>Catégorie générale</Typography>
          <Select
            value={additionalInfo.category}
            onChange={handleAdditionalInfoChange('category')}
          >
            <MenuItem value="Electronics">Électronique</MenuItem>
            <MenuItem value="Furniture">Mobilier</MenuItem>
            {/* Add more categories here */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <Typography gutterBottom>Unité</Typography>
          <Select
            value={additionalInfo.unit}
            onChange={handleAdditionalInfoChange('unit')}
          >
            <MenuItem value="Kg">Kg</MenuItem>
            <MenuItem value="Piece">Pièce</MenuItem>
            {/* Add more units here */}
          </Select>
        </FormControl>
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
AdditionalInfoStep.propTypes = {
  additionalInfo: PropTypes.shape({
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired, // Add this
    unit: PropTypes.string.isRequired,     // Add this
  }).isRequired,
  handleAdditionalInfoChange: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default AdditionalInfoStep;
