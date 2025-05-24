import React from 'react';
import { Box, Card, Typography, TextField, Grid, Button, FormControl, Select, MenuItem, Avatar } from '@mui/material';
import PropTypes from 'prop-types';

const AdditionalInfoStep = ({ additionalInfo, handleAdditionalInfoChange, handlePrev, handleNext }) => {
  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Informations supplémentaires
      </Typography>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Section upload d'image */}
        <Grid item xs={12}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              handleAdditionalInfoChange('imageFile')({ target: { value: file } });
            }}
          />
          <label htmlFor="image-upload">
            <Button variant="outlined" component="span">
              Uploader image du produit
            </Button>
          </label>
          {additionalInfo.imageFile && (
            <Box mt={2} display="flex" alignItems="center" gap={2}>
              <Avatar 
                src={URL.createObjectURL(additionalInfo.imageFile)} 
                sx={{ width: 56, height: 56 }}
                variant="rounded"
              />
              <Typography variant="body2">
                {additionalInfo.imageFile.name}
              </Typography>
            </Box>
          )}
        </Grid>

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
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    imageFile: PropTypes.instanceOf(File)
  }).isRequired,
  handleAdditionalInfoChange: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default AdditionalInfoStep;