import React from 'react';
import { Typography, Grid, Paper, Box, LinearProgress, Avatar } from '@mui/material';
import { ArrowDropUp, ArrowDropDown, People } from '@mui/icons-material';

function Statistiques() {
  // Valeurs dynamiques
  const currentYear = 2021;
  const previousYear = 2020;
  const revenueCurrentYear = 75000; // Exemple
  const revenuePreviousYear = 50000; // Exemple
  const totalClients = 1500;
  const clientGoal = 2000; // Objectif de clients

  // Calcul de la variation
  const variation = ((revenueCurrentYear - revenuePreviousYear) / revenuePreviousYear) * 100;
  const clientProgress = (totalClients / clientGoal) * 100; // Pourcentage du nombre de clients

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Statistiques Annuelles
      </Typography>

      <Grid container spacing={3}>
        {/* Revenus par période */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: 3,
              background: '#ffffff',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
              Du 01/01/{currentYear} au 31/12/{currentYear}
            </Typography>
            <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold', mt: 1 }}>
              {revenueCurrentYear.toLocaleString()} TND
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: 3,
              background: '#ffffff',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Du 01/01/{previousYear} au 31/12/{previousYear}
            </Typography>
            <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold', mt: 1 }}>
              {revenuePreviousYear.toLocaleString()} TND
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: 3,
              background: '#ffffff',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ color: '#616161', fontWeight: 'bold' }}>
              Variation N vs N-1
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              {variation > 0 ? (
                <ArrowDropUp sx={{ color: 'green', fontSize: 40 }} />
              ) : (
                <ArrowDropDown sx={{ color: 'red', fontSize: 40 }} />
              )}
              <Typography variant="h5" sx={{ color: '#616161', fontWeight: 'bold', ml: 1 }}>
                {Math.abs(variation).toFixed(2)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Nombre total de clients */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: 3,
              background: '#ffffff',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#ff9800',
                width: 56,
                height: 56,
                margin: '0 auto 1rem auto',
              }}
            >
              <People />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              {totalClients}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#616161', fontWeight: 'bold', mt: 1 }}>
              Nombre total de clients
            </Typography>
            <LinearProgress
              variant="determinate"
              value={clientProgress}
              sx={{ height: 10, borderRadius: 5, mt: 2 }}
            />
            <Typography variant="caption" sx={{ color: '#616161', mt: 1 }}>
              Objectif: {clientGoal} clients
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Statistiques;
