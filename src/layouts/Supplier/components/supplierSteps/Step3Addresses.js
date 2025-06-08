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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import styles from './styles';
import PropTypes from 'prop-types';

const Step3Addresses = ({ addresses, setAddresses, paymentTerms, setPaymentTerms, handleNext, handlePrev }) => {
  const handleAddAddress = () => setAddresses([...addresses, { type: 'Adresse de facturation', address: '' }]);
  const handleRemoveAddress = (index) => setAddresses(addresses.filter((_, i) => i !== index));
  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].address = value;
    setAddresses(updatedAddresses);
  };

  

  // Debugging: Log the current state
  console.log('Addresses:', addresses);
 

  return (
    <Card elevation={3} sx={styles.card}>
      <Box sx={styles.header}>
        <Icon sx={styles.titleIcon}>location_on</Icon>
        <Typography variant="h6" gutterBottom>
          Adresses
        </Typography>
      </Box>

      {/* Addresses Section */}
      {addresses.map((address, index) => (
        <Grid container spacing={2} key={index} sx={{ marginTop: '10px' }}>
          <Grid item xs={10}>
            <TextField
              label="Adresse"
              value={address.address}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleRemoveAddress(index)} color="error">
              <Remove />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" startIcon={<Add />} onClick={handleAddAddress} sx={{ marginTop: '20px' }}>
        Ajouter une adresse
      </Button>
      <Divider sx={styles.divider} />

     

      {/* Action Buttons */}
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
Step3Addresses.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
 
  setAddresses: PropTypes.func.isRequired,
 
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};

export default Step3Addresses;