import React from 'react';
import { Card, Typography, Button, Box } from '@mui/material';
import PropTypes from 'prop-types';

const CompletionStep = ({ handleSubmit }) => {
  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Terminé
      </Typography>
      <Typography gutterBottom>
        Votre produit a été configuré avec succès.
      </Typography>
      <Box display="flex" justifyContent="center" marginTop="20px">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Soumettre
        </Button>
      </Box>
    </Card>
  );
};
CompletionStep.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};
export default CompletionStep;
