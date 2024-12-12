// ThirdStep.js
import React from 'react';
import PropTypes from 'prop-types'; // Importer prop-types
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
  phoneNumbers = [],  // Default value as an empty array
  addresses = [],    // Default value as an empty array
  handlePhoneNumberChange,
  handleAddPhoneNumber,
  handleRemovePhoneNumber,
  handleAddressChange,
  handleAddAddress,
  handleRemoveAddress,
  handleNext,
  handlePrev,
}) {
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
            {phoneNumbers.map((phone, index) => (
              <Grid container spacing={3} key={index} style={{ marginTop: '10px' }}>
                <Grid item xs={3}>
                  <Select
                    label="Type"
                    value={phone.type}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, 'type', e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="Numéro de téléphone">
                      Numéro de téléphone
                    </MenuItem>
                    <MenuItem value="Numéro de fax">Numéro de fax</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    label="Numéro"
                    variant="outlined"
                    fullWidth
                    value={phone.number}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, 'number', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemovePhoneNumber(index)}>
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<Add />}
              variant="text"
              onClick={handleAddPhoneNumber}
              style={{ marginTop: '10px' }}
            >
              Ajouter un numéro
            </Button>

            {/* Adresses */}
            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
              Adresses
            </Typography>
            {addresses.map((address, index) => (
              <Grid container spacing={3} key={index} style={{ marginTop: '10px' }}>
                <Grid item xs={4}>
                  <Select
                    label="Type"
                    value={address.type}
                    onChange={(e) =>
                      handleAddressChange(index, 'type', e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="Adresse de facturation">
                      Adresse de facturation
                    </MenuItem>
                    <MenuItem value="Adresse de livraison">
                      Adresse de livraison
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Adresse"
                    variant="outlined"
                    fullWidth
                    value={address.address}
                    onChange={(e) =>
                      handleAddressChange(index, 'address', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemoveAddress(index)}>
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<Add />}
              variant="text"
              onClick={handleAddAddress}
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
                disabled={!phoneNumbers.length || !addresses.length}
              >
                Continuer
              </Button>
            </Box>
          </Card>
    </DashboardLayout>
  );
}



/// Validation des props avec prop-types
ThirdStep.propTypes = {
  phoneNumbers: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    number: PropTypes.string,
  })).isRequired,
  addresses: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    address: PropTypes.string,
  })).isRequired,
  handlePhoneNumberChange: PropTypes.func.isRequired,
  handleAddPhoneNumber: PropTypes.func.isRequired,
  handleRemovePhoneNumber: PropTypes.func.isRequired,
  handleAddressChange: PropTypes.func.isRequired,
  handleAddAddress: PropTypes.func.isRequired,
  handleRemoveAddress: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};
export default ThirdStep;
