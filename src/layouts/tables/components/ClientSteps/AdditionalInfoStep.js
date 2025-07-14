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
      <Card elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Informations supplémentaires
        </Typography>

        <Grid container spacing={2} sx={{ marginTop: '15px' }}>
          {/* Notes Section */}
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes"
              variant="outlined"
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Notes sur le client..."
              sx={{
                '& .MuiInputBase-root': {
                  height: 'auto',
                },
                '& .MuiInputBase-inputMultiline': {
                  minHeight: '60px',
                  lineHeight: '1.5',
                }
              }}
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
              minRows={2}
              maxRows={4}
              value={formData.preferences || ''}
              onChange={handleChange}
              placeholder="Préférences du client..."
              sx={{
                '& .MuiInputBase-root': {
                  height: 'auto',
                },
                '& .MuiInputBase-inputMultiline': {
                  minHeight: '60px',
                  lineHeight: '1.5',
                }
              }}
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