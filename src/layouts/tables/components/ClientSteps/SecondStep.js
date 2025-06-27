import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  FormControl,
  Card,
} from '@mui/material'; // Import Material-UI components
import PropTypes from 'prop-types';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
//import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';


// Ensure this path is correct

function SecondStep({ formData, updateField, handleNext, handlePrev }) {
  const handleChange = (e) => {
    updateField(e.target.name, e.target.value);
   
  };
  // Check if the "Continuer" button should be disabled
  
  const handleCivilityChange = (e) => {
    updateField('civility', e.target.value);
  };

  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value); // ou adapte selon ta logique
  };

  const isNextDisabled =
    !formData.civility ||
    !formData.name ||
    !formData.email ||
    !formData.identifier;

  return (
    <DashboardLayout>
      <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Informations du client
        </Typography>

        {/* Radio Buttons for Civility */}
        <FormControl component="fieldset" sx={{ marginTop: '20px' }}>
          <RadioGroup
            row
            value={formData.civility || ''} // Ensure this binds to the civility value in formData
            onChange={handleCivilityChange} // Calls handleCivilityChange when a radio button is clicked
            sx={{ justifyContent: 'center' }}
          >
            <FormControlLabel
              value="Monsieur"
              control={<Radio color="primary" />}
              label="Monsieur"
            />
            <FormControlLabel
              value="Madame"
              control={<Radio color="primary" />}
              label="Madame"
            />
          </RadioGroup>
        </FormControl>

        {/* Form Fields */}
        <Grid container spacing={3} sx={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              required
              name="name"
              value={formData.name || ''}
              onChange={handleClientInfoChange} // Updates the name in formData
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email || ''}
              onChange={handleClientInfoChange} // Updates the email in formData
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Identifiant unique"
              variant="outlined"
              fullWidth
              name="identifier"
              value={formData.identifier || ''}
              onChange={handleClientInfoChange} // Updates the identifier in formData
            />
          </Grid>
        </Grid>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button variant="outlined" color="primary" onClick={handlePrev}>
            Retour
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            Suivant
          </Button>
        </Box>
      </Card>
    </DashboardLayout>
  );
}

SecondStep.propTypes = {
  formData: PropTypes.shape({
    civility: PropTypes.string,  // Civility value (Monsieur or Madame)
    name: PropTypes.string,      // Name of the client
    email: PropTypes.string,     // Email of the client
    identifier: PropTypes.string, // Unique identifier for the client
  }).isRequired,
  updateField: PropTypes.func.isRequired, // <-- Ajoute cette ligne
  handleNext: PropTypes.func, // si utilisé
  handlePrev: PropTypes.func, // si utilisé
};

export default SecondStep;
