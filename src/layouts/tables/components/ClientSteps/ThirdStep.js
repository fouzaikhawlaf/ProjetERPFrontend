// ThirdStep.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Card,
  Box,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

function ThirdStep({
  formData,
  updateField,
  handleNext,
  handlePrev,
}) {
  // Fonctions de gestion des téléphones
  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index] = { ...newPhones[index], [field]: value };
    updateField('phoneNumbers', newPhones);
  };

  const addPhone = () => {
    updateField('phoneNumbers', [
      ...formData.phoneNumbers,
      { type: 'Numéro de téléphone', number: '' }
    ]);
  };

  const removePhone = (index) => {
    updateField('phoneNumbers', 
      formData.phoneNumbers.filter((_, i) => i !== index)
    );
  };

  // Fonctions de gestion des adresses
  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    updateField('addresses', newAddresses);
  };

  const addAddress = () => {
    updateField('addresses', [
      ...formData.addresses,
      { 
        type: 'Adresse de facturation', 
        address: '', 
        region: '', 
        postalCode: '', 
        country: 'Tunisie' 
      }
    ]);
  };

  const removeAddress = (index) => {
    updateField('addresses', 
      formData.addresses.filter((_, i) => i !== index)
    );
  };

  // Validation pour le bouton Continuer
  const isNextDisabled = 
    !formData.phoneNumbers.some(p => p.number.trim() !== '') || 
    !formData.addresses.some(a => a.address.trim() !== '');

  return (
    <DashboardLayout>
      <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Coordonnées
        </Typography>

        {/* Téléphones */}
        <Typography variant="subtitle1" gutterBottom>
          Numéros de téléphone
        </Typography>
        {formData.phoneNumbers.map((phone, index) => (
          <Grid container spacing={2} key={index} style={{ marginTop: '10px' }}>
            <Grid item xs={12} sm={3}>
              <Select
                label="Type"
                value={phone.type}
                onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}
                fullWidth
              >
                <MenuItem value="Numéro de téléphone">Numéro de téléphone</MenuItem>
                <MenuItem value="Numéro de fax">Numéro de fax</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={7}>
              <TextField
                label="Numéro"
                variant="outlined"
                fullWidth
                value={phone.number}
                onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton onClick={() => removePhone(index)}>
                <Remove />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          startIcon={<Add />}
          variant="text"
          onClick={addPhone}
          style={{ marginTop: '10px' }}
        >
          Ajouter un numéro
        </Button>

        {/* Adresses */}
        <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
          Adresses
        </Typography>
        {formData.addresses.map((address, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Select
                  label="Type"
                  value={address.type}
                  onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Adresse de facturation">Adresse de facturation</MenuItem>
                  <MenuItem value="Adresse de livraison">Adresse de livraison</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={8} container justifyContent="flex-end">
                <IconButton onClick={() => removeAddress(index)}>
                  <Remove />
                </IconButton>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Adresse"
                  variant="outlined"
                  fullWidth
                  value={address.address}
                  onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Région"
                  variant="outlined"
                  fullWidth
                  value={address.region}
                  onChange={(e) => handleAddressChange(index, 'region', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Code postal"
                  variant="outlined"
                  fullWidth
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pays"
                  variant="outlined"
                  fullWidth
                  value={address.country}
                  onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<Add />}
          variant="text"
          onClick={addAddress}
          style={{ marginTop: '10px' }}
        >
          Ajouter une adresse
        </Button>

        {/* Boutons de navigation */}
        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <Button variant="outlined" color="primary" onClick={handlePrev}>
            Retour
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            Continuer
          </Button>
        </Box>
      </Card>
    </DashboardLayout>
  );
}

ThirdStep.propTypes = {
  formData: PropTypes.shape({
    phoneNumbers: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      number: PropTypes.string,
    })),
    addresses: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      address: PropTypes.string,
      region: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
    })),
  }).isRequired,
  updateField: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};

export default ThirdStep;