import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';  // Pour gérer la navigation

import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';



// Style pour les tuiles
const Tile = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.primary,
  borderRadius: '12px',
  background: theme.palette.primary.main,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
}));

// Style pour les icônes
const TileIcon = styled(Box)(({ theme }) => ({
  fontSize: '3rem',  // Taille plus grande pour les icônes
  marginBottom: theme.spacing(1),
}));

// Composant Dashboard
function Dashboard() {
  const navigate = useNavigate();  // Hook pour naviguer vers d'autres pages

  // Liste des tuiles avec icônes et couleurs
  const tiles = [
    { title: 'Orders', icon: '📦', color: '#E57373', route: '/orders' },
    { title: 'Customers', icon: '👥', color: '#64B5F6', route: '/tables' },
    { title: 'Invoices', icon: '💵', color: '#81C784', route: '/invoices' },
    { title: 'Supplier Portal', icon: '🛒', color: '#FFD54F', route: '/supplier' },
    { title: 'General', icon: '📊', color: '#4DB6AC', route: '/general' },
    { title: 'Projets', icon: '🗂️', color: '#FFB74D', route: '/projects' }, // Nouvelle tuile pour projets
    { title: 'RH', icon: '👔', color: '#7986CB', route: '/rh' }, // Nouvelle tuile pour RH
  ];

  // Fonction pour gérer le clic sur une tuile
  const handleTileClick = (route) => {
    navigate(route);  // Navigation vers la route définie
  };

  return (
    <DashboardLayout>
  
    <Box sx={{ flexGrow: 1, padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom>
        ERP Dashboard
      </Typography>
      <Grid container spacing={4}>
        {tiles.map((tile, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tile 
              style={{ backgroundColor: tile.color }} 
              onClick={() => handleTileClick(tile.route)}  // Gestion du clic
            >
              <TileIcon>{tile.icon}</TileIcon>
              <Typography variant="h6">{tile.title}</Typography>
            </Tile>
          </Grid>
        ))}
      </Grid>
    </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
