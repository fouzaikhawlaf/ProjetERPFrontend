import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SuccessPage = ({ itemType }) => {
  const itemLabel = itemType === 1 ? "Service" : "Produit";

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      textAlign: 'center',
      p: 3
    }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {itemLabel} créé avec succès !
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        Votre {itemLabel.toLowerCase()} a été créé avec succès dans le système.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/products"
          sx={{ px: 4, py: 1.5 }}
        >
          Retour à la liste
        </Button>
        
        <Button
          variant="outlined"
          component={Link}
          to="/products/new"
          sx={{ px: 4, py: 1.5 }}
        >
          Créer un nouveau
        </Button>
      </Box>
    </Box>
  );
};

SuccessPage.propTypes = {
  itemType: PropTypes.number.isRequired,
};

export default SuccessPage;