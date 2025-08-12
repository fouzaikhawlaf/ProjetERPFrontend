import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PropTypes from 'prop-types';

const SuccessPage = ({ itemType, redirectPath = '/products', timeout = 3000 }) => {
  const navigate = useNavigate();
  const itemLabel = itemType === 1 ? "Service" : "Produit";
  const listPath = itemType === 1 ? "/services" : "/products";
  const createPath = itemType === 1 ? "/services/new" : "/products/new";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectPath);
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate, redirectPath, timeout]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center',
      p: 3
    }}>
      <CheckCircleIcon sx={{ 
        fontSize: 80, 
        color: 'success.main', 
        mb: 3,
        animation: 'bounce 1s infinite alternate'
      }} />
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {itemLabel} enregistré avec succès !
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        Votre {itemLabel.toLowerCase()} a été sauvegardé dans le système.
        <br />
        <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.9rem', mt: 1 }}>
          Redirection automatique dans {timeout/1000} secondes...
          <CircularProgress size={16} sx={{ ml: 1 }} />
        </Box>
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={listPath}
          sx={{ px: 4, py: 1.5 }}
        >
          Retour à la liste
        </Button>
        
        <Button
          variant="outlined"
          component={Link}
          to={createPath}
          sx={{ px: 4, py: 1.5 }}
        >
          Créer un nouveau
        </Button>
      </Box>

      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-15px); }
          }
        `}
      </style>
    </Box>
  );
};

SuccessPage.propTypes = {
  itemType: PropTypes.number.isRequired,
  redirectPath: PropTypes.string,
  timeout: PropTypes.number
};

SuccessPage.defaultProps = {
  redirectPath: '/products',
  timeout: 3000
};

export default SuccessPage;