import React from 'react';
import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

function AdditionalInfoStep({ formData, updateField, handlePrev, handleNext }) {
  const handleChange = (e) => {
    updateField(e.target.name, e.target.value);
  };
  
  return (
    <DashboardLayout>
      <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Informations supplémentaires
        </Typography>

        <Grid container spacing={3} sx={{ marginTop: '20px' }}>
          {/* Notes Section */}
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Ajoutez des notes sur le client..."
            />
          </Grid>

          {/* Preferences Section */}
          <Grid item xs={12}>
            <TextField
              name="preferences"
              label="Préférences"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.preferences || ''}
              onChange={handleChange}
              placeholder="Ajoutez les préférences du client..."
            />
          </Grid>
        </Grid>

        {/* Boutons de navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button variant="outlined" color="primary" onClick={handlePrev}>
            Retour
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Continuer
          </Button>
        </Box>
      </Card>
    </DashboardLayout>
  );
}

// Prop-types validation
AdditionalInfoStep.propTypes = {
  formData: PropTypes.shape({
    notes: PropTypes.string,
    preferences: PropTypes.string,
  }).isRequired,
  updateField: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default AdditionalInfoStep;