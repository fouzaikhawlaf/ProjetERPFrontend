import React from 'react';
import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';


const AdditionalInfoStep = ({
  additionalInfo,
  handleAdditionalInfoChange,
  handlePrev,
  handleNext,
}) => {
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
              label="Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={additionalInfo.notes}
              onChange={handleAdditionalInfoChange('notes')}
            />
          </Grid>

          {/* Preferences Section */}
          <Grid item xs={12}>
            <TextField
              label="Préférences"
              variant="outlined"
              fullWidth
              value={additionalInfo.preferences}
              onChange={handleAdditionalInfoChange('preferences')}
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
          disabled={!additionalInfo.notes || !additionalInfo.preferences}
        >
          Continuer
        </Button>
      </Box>
      
      </Card>
    </DashboardLayout>
  );
};

// Prop-types validation
AdditionalInfoStep.propTypes = {
  additionalInfo: PropTypes.shape({
    notes: PropTypes.string,
    preferences: PropTypes.string,
  }).isRequired,
  handleAdditionalInfoChange: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default AdditionalInfoStep;
