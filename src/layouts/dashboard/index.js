import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, TextField, Button, Badge, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Line } from 'react-chartjs-2'; // Pour afficher un graphique simple
import Chart from 'chart.js/auto'; // Assurez-vous d'importer Chart.js pour utiliser Line

// Style pour les tuiles
const Tile = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '16px',
  color: '#fff',
  background: theme.palette.primary.main,
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  },
}));

// Icône des tuiles
const TileIcon = styled(Box)(({ theme }) => ({
  fontSize: '3.5rem',
  marginBottom: theme.spacing(2),
}));

// Barre de recherche
const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '2rem',
  background: '#fff',
  borderRadius: '8px',
  padding: theme.spacing(1),
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
}));

function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Liste des modules
  const tiles = [
    { title: 'Orders', icon: '📦', color: '#E57373', route: '/orders', metric: '15 commandes', alerts: 2 },
    { title: 'Customers', icon: '👥', color: '#64B5F6', route: '/tables', metric: '250 clients' },
    { title: 'Invoices', icon: '💵', color: '#81C784', route: '/invoices', metric: '3 impayées', alerts: 1 },
    { title: 'Supplier Portal', icon: '🛒', color: '#FFD54F', route: '/supplier', metric: '5 fournisseurs actifs' },
    { title: 'General', icon: '📊', color: '#4DB6AC', route: '/general', metric: '10 rapports générés' },
    { title: 'Projets', icon: '🗂️', color: '#FFB74D', route: '/projects', metric: '8 projets en cours' },
    { title: 'RH', icon: '👔', color: '#7986CB', route: '/rh', metric: '3 nouvelles candidatures' },
  ];

  const filteredTiles = tiles.filter((tile) =>
    tile.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleTileClick = (route) => {
    navigate(route);
  };

  // Données de test pour un graphique
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Commandes mensuelles',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.raw + ' commandes';
          },
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1, padding: '2rem', backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" gutterBottom>
          Bienvenue dans votre ERP, Pierre !
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Visualisez et accédez rapidement à vos modules principaux.
        </Typography>

        {/* Barre de recherche */}
        <SearchContainer>
          <SearchIcon fontSize="large" />
          <StyledTextField
            placeholder="Rechercher un module..."
            variant="standard"
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchContainer>

        <Grid container spacing={3}>
          {filteredTiles.length > 0 ? (
            filteredTiles.map((tile, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Tile style={{ backgroundColor: tile.color }}>
                  <TileIcon>{tile.icon}</TileIcon>
                  <Typography variant="h6">{tile.title}</Typography>
                  <Typography variant="body2">{tile.metric}</Typography>
                  {/* Graphique intégré dans la tuile */}
                  <Line data={data} options={options} />
                  {tile.alerts && (
                    <Badge
                      badgeContent={tile.alerts}
                      color="error"
                      sx={{ position: 'absolute', top: '12px', right: '12px' }}
                    />
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Tooltip title="Ouvrir le module">
                      <Button
                        variant="contained"
                        startIcon={<OpenInNewIcon />}
                        color="secondary"
                        onClick={() => handleTileClick(tile.route)}
                      >
                        Ouvrir
                      </Button>
                    </Tooltip>
                    <Tooltip title="Configurer le module">
                      <Button
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        color="primary"
                      >
                        Configurer
                      </Button>
                    </Tooltip>
                  </Box>
                </Tile>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ marginTop: 2, color: 'gray' }}>
              Aucun module ne correspond à votre recherche.
            </Typography>
          )}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
