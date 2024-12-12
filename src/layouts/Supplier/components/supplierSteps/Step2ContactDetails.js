import React from 'react';
import { Card, Typography, Grid, TextField, IconButton, Button, Box, Divider, Icon } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import styles from './styles';
import PropTypes from 'prop-types';
const Step2ContactDetails = ({ contactDetails, setContactDetails, handleNext, handlePrev }) => {
  const handleAddContact = () => setContactDetails([...contactDetails, { type: 'Numéro de téléphone', number: '' }]);
  const handleRemoveContact = (index) => setContactDetails(contactDetails.filter((_, i) => i !== index));
  const handleContactChange = (index, value) => {
    const updatedContacts = [...contactDetails];
    updatedContacts[index].number = value;
    setContactDetails(updatedContacts);
  };

  return (
    <Card elevation={3} sx={styles.card}>
      <Box sx={styles.header}>
        <Icon sx={styles.titleIcon}>contact_phone</Icon>
        <Typography variant="h5">Coordonnées</Typography>
      </Box>
      {contactDetails.map((contact, index) => (
        <Grid container spacing={2} key={index} sx={{ marginTop: '10px' }}>
          <Grid item xs={10}>
            <TextField
              label="Numéro de téléphone"
              value={contact.number}
              onChange={(e) => handleContactChange(index, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleRemoveContact(index)} color="error">
              <Remove />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" startIcon={<Add />} onClick={handleAddContact} sx={{ marginTop: '20px' }}>Ajouter un téléphone</Button>
      <Divider sx={styles.divider} />
      <Box sx={styles.buttonGroup}>
        <Button variant="outlined" onClick={handlePrev}>Retour</Button>
        <Button variant="contained" color="primary" onClick={handleNext}>Continuer</Button>
      </Box>
    </Card>
  );
};
// Add prop types at the bottom of the file
Step2ContactDetails.propTypes = {
    contactDetails: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
      })
    ).isRequired,
    setContactDetails: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    handlePrev: PropTypes.func.isRequired,
  };
export default Step2ContactDetails;
