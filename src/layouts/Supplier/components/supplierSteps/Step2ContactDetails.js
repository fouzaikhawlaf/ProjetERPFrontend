import React from 'react';
import {
  Card,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
  Box,
  Divider,
  Icon,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import styles from './styles';
import PropTypes from 'prop-types';

const Step2SupplierAddress = ({ supplierInfo, setSupplierInfo, handleNext, handlePrev }) => {
  // Handle adding a new address
  const handleAddAddress = () => {
    setSupplierInfo({
      ...supplierInfo,
      addresses: [...(supplierInfo.addresses || []), { addressLine1: '', addressLine2: '', country: '' }],
    });
  };

  // Handle removing an address
  const handleRemoveAddress = (index) => {
    const updatedAddresses = supplierInfo.addresses.filter((_, i) => i !== index);
    setSupplierInfo({ ...supplierInfo, addresses: updatedAddresses });
  };

  // Handle address field changes
  const handleAddressChange = (index, field) => (e) => {
    const updatedAddresses = [...supplierInfo.addresses];
    updatedAddresses[index][field] = e.target.value;
    setSupplierInfo({ ...supplierInfo, addresses: updatedAddresses });
  };

  return (
    <Card elevation={3} sx={styles.card}>
      <Box sx={styles.header}>
        <Icon sx={styles.titleIcon}>location_on</Icon>
        <Typography variant="h6" gutterBottom>
          Adresse du fournisseur
        </Typography>
      </Box>

      {/* Addresses Section */}
      {(supplierInfo.addresses || []).map((address, index) => (
        <Grid container spacing={2} key={index} sx={{ marginTop: '10px' }}>
          {/* Adresse ligne 1 */}
          <Grid item xs={12} md={5}>
            <TextField
              label="Adresse ligne 1"
              value={address.addressLine1}
              onChange={handleAddressChange(index, 'addressLine1')}
              fullWidth
            />
          </Grid>

          {/* Adresse ligne 2 */}
          <Grid item xs={12} md={5}>
            <TextField
              label="Adresse ligne 2"
              value={address.addressLine2}
              onChange={handleAddressChange(index, 'addressLine2')}
              fullWidth
            />
          </Grid>

          {/* Pays */}
          <Grid item xs={12} md={5}>
            <TextField
              label="Pays"
              value={address.country}
              onChange={handleAddressChange(index, 'country')}
              fullWidth
            />
          </Grid>

          {/* Remove Address Button */}
          <Grid item xs={12} md={2}>
            <IconButton onClick={() => handleRemoveAddress(index)} color="error">
              <Remove />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Add Address Button */}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleAddAddress}
        sx={{ marginTop: '20px' }}
      >
        Ajouter une adresse
      </Button>

      <Divider sx={styles.divider} />

      {/* Navigation Buttons */}
      <Box sx={styles.buttonGroup}>
        <Button variant="outlined" onClick={handlePrev}>
          Retour
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Continuer
        </Button>
      </Box>
    </Card>
  );
};

// Prop Types Validation
Step2SupplierAddress.propTypes = {
  supplierInfo: PropTypes.shape({
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        country: PropTypes.string,
      })
    ),
  }).isRequired,
  setSupplierInfo: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};

export default Step2SupplierAddress;