import React from 'react';
import { Box, Button, Card, Typography } from '@material-ui/core';

const SubmissionStep = ({ handlePrev, handleSubmit }) => {
  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Terminé
      </Typography>

      <Typography>
        Vous avez complété toutes les étapes du formulaire. Veuillez confirmer pour soumettre vos informations.
      </Typography>

      {/* Submission Buttons */}
      <Box display="flex" justifyContent="space-between" marginTop="20px">
        <Button variant="outlined" color="primary" onClick={handlePrev}>
          Retour
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Soumettre
        </Button>
      </Box>
    </Card>
  );
};

export default SubmissionStep;
