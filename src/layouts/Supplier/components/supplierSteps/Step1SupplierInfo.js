import React from 'react';
import { Card, Typography, TextField, RadioGroup, FormControlLabel, Radio, Button, Box, Divider, Icon } from '@mui/material';
import styles from './styles';
import PropTypes from 'prop-types';
const Step1SupplierInfo = ({ supplierInfo, setSupplierInfo, handleNext }) => {
  const handleInputChange = (field) => (e) => setSupplierInfo({ ...supplierInfo, [field]: e.target.value });

  return (
    <Card elevation={3} sx={styles.card}>
      <Box sx={styles.header}>
        <Icon sx={styles.titleIcon}>business</Icon>
       
      </Box>
     
      <RadioGroup row value={supplierInfo.contactTitle} onChange={handleInputChange('contactTitle')}>
     
        <FormControlLabel value="Monsieur" control={<Radio />} label="Monsieur" />
        <FormControlLabel value="Madame" control={<Radio />} label="Madame" />
      </RadioGroup>
      <Divider sx={styles.divider} />
      <TextField
        label="Nom de l'entreprise"
        value={supplierInfo.companyName}
        onChange={handleInputChange('companyName')}
        fullWidth
        sx={{ marginTop: '20px' }}
      />
      
     
      <Box sx={styles.buttonGroup}>
        <Button variant="outlined" disabled>Retour</Button>
        <Button variant="contained" color="primary" onClick={handleNext}>Continuer</Button>
      </Box>
    </Card>
  );
};
// Add prop types at the bottom of the file
Step1SupplierInfo.propTypes = {
    supplierInfo: PropTypes.shape({
      companyName: PropTypes.string.isRequired,
      contactTitle: PropTypes.string.isRequired,
    }).isRequired,
    setSupplierInfo: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
  };
export default Step1SupplierInfo;
