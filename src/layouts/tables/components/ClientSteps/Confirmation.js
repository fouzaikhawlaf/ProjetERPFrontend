import React from 'react';
import {
  Card,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { Edit } from '@mui/icons-material'; // Edit icon for editing fields
import PropTypes from 'prop-types';

const ClientPreviewStep = ({
  clientType,
  civility,
  clientInfo,
  contactDetails,
  additionalInfo,
  phoneNumbers,
  addresses,
  handlePrev,
  handleSubmit,
  goToStep,
}) => {

  // Function to handle edit click and redirect to the appropriate step
  const handleEditClick = (stepNumber) => {
    goToStep(stepNumber);
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Aperçu du client
      </Typography>

      {/* Client Type Section */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">
            <strong>Type de client:</strong> {clientType}
          </Typography>
          <IconButton onClick={() => handleEditClick(1)}>
            <Edit />
          </IconButton>
        </Box>
      </Card>

      {/* Civility Section */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">
            <strong>Civilité:</strong> {civility}
          </Typography>
          <IconButton onClick={() => handleEditClick(2)}>
            <Edit />
          </IconButton>
        </Box>
      </Card>

      {/* Client Information Section */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Informations du client
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                <strong>Nom:</strong> {clientInfo.name}
              </Typography>
              <IconButton onClick={() => handleEditClick(2)}>
                <Edit />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Email:</strong> {clientInfo.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Identifiant:</strong> {clientInfo.identifier}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Contact Details Section (Phone & Address) */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Détails de contact
        </Typography>
        <Grid container spacing={2}>
          {phoneNumbers.map((phone, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="subtitle1">
                <strong>Phone {index + 1}:</strong> {phone.number}
              </Typography>
            </Grid>
          ))}
          {addresses.map((address, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="subtitle1">
                <strong>Adresse {index + 1}:</strong> {address.address}, {address.region}, {address.country}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Additional Info Section */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Informations supplémentaires
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                <strong>Notes:</strong> {additionalInfo.notes}
              </Typography>
              <IconButton onClick={() => handleEditClick(4)}>
                <Edit />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Préférences:</strong> {additionalInfo.preferences}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" marginTop="30px">
        <Button onClick={handlePrev} variant="outlined" style={{ borderRadius: '8px' }}>
          Retour
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" style={{ borderRadius: '8px' }}>
          Soumettre
        </Button>
      </Box>
    </Card>
  );
};

ClientPreviewStep.propTypes = {
  clientType: PropTypes.string.isRequired,
  civility: PropTypes.string.isRequired,
  clientInfo: PropTypes.object.isRequired,
  contactDetails: PropTypes.object.isRequired,
  additionalInfo: PropTypes.object.isRequired,
  phoneNumbers: PropTypes.array.isRequired,
  addresses: PropTypes.array.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  goToStep: PropTypes.func.isRequired, // Used to navigate to specific steps
};

export default ClientPreviewStep;
