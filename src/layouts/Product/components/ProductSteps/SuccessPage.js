import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icône de succès
import { Box, Typography, Button, Container } from '@mui/material'; // Utilisation de MUI pour un design cohérent
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';


const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
    <Container
      maxWidth="sm"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Box textAlign="center">
        <CheckCircleOutlineIcon style={{ fontSize: 100, color: '#4caf50' }} />
        <Typography
          variant="h4"
          style={{
            marginTop: '20px',
            color: '#333',
            fontWeight: 'bold',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Produit créé avec succès !
        </Typography>
        <Typography
          variant="body1"
          style={{
            marginTop: '10px',
            color: '#555',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Votre produit a été ajouté à la liste avec succès. Vous pouvez maintenant revenir pour voir ou gérer les produits.
        </Typography>
        <Button
          variant="contained"
          color="success"
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '14px',
          }}
          onClick={() => navigate('/produitService')}
        >
          Voir la liste des produits
        </Button>
      </Box>
    </Container>
    </DashboardLayout>
  );
};

export default SuccessPage;
