import React from 'react';
import { Card, Typography, TextField, Button, Box, Divider, Icon } from '@mui/material';
import styles from './styles';
import PropTypes from 'prop-types';

const Step1SupplierInfo = ({ supplierInfo, setSupplierInfo, handleNext, handlePrev }) => {
  const handleInputChange = (field) => (e) => setSupplierInfo({ ...supplierInfo, [field]: e.target.value });

  return (
    <Card elevation={3} sx={styles.card}>
      <Box sx={styles.header}>
        <Icon sx={styles.titleIcon}>business</Icon>
        <Typography variant="h6" gutterBottom>
          Informations de base
        </Typography>
      </Box>

      {/* Nom de l'entreprise */}
      <TextField
        label="Nom de l'entreprise"
        value={supplierInfo.name}
        onChange={handleInputChange('name')}
        fullWidth
        sx={{ marginTop: '20px' }}
      />

      {/* Code */}
      <TextField
        label="Code"
        value={supplierInfo.code}
        onChange={handleInputChange('code')}
        fullWidth
        sx={{ marginTop: '20px' }}
      />

      {/* Personne de contact */}
      <TextField
        label="Personne de contact"
        value={supplierInfo.contactPerson}
        onChange={handleInputChange('contactPerson')}
        fullWidth
        sx={{ marginTop: '20px' }}
      />

      {/* Email */}
      <TextField
        label="Email"
        value={supplierInfo.email}
        onChange={handleInputChange('email')}
        fullWidth
        sx={{ marginTop: '20px' }}
        type="email"
      />

      {/* Téléphone */}
      <TextField
        label="Téléphone"
        value={supplierInfo.phone}
        onChange={handleInputChange('phone')}
        fullWidth
        sx={{ marginTop: '20px' }}
      />

      {/* Site web */}
      <TextField
        label="Site web"
        value={supplierInfo.website}
        onChange={handleInputChange('website')}
        fullWidth
        sx={{ marginTop: '20px' }}
      />

      {/* Boutons de navigation */}
      <Box sx={styles.buttonGroup}>
        <Button variant="outlined" onClick={handlePrev}>
          Retour
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Suivant
        </Button>
      </Box>
    </Card>
  );
};

Step1SupplierInfo.propTypes = {
  supplierInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    contactPerson: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    website: PropTypes.string,
  }).isRequired,
  setSupplierInfo: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};

export default Step1SupplierInfo;