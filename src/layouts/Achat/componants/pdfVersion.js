import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ArrowBack, Cancel, Visibility, Check } from '@mui/icons-material';

const CustomAppBar = () => {
  return (
    <AppBar position="relative" sx={{ bgcolor: '##ffffff' ,color: 'white' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <Button variant="contained" startIcon={<ArrowBack />} sx={{ bgcolor: '#2196f3', mr: 1 }}>
          Retour
        </Button>
        </Typography>
        
        <Button variant="contained" startIcon={<Cancel />} sx={{ bgcolor: '#f44336', mr: 1 }}>
          Annuler
        </Button>
        <Button variant="contained" startIcon={<Visibility />} sx={{ bgcolor: '#ff9800', mr: 1 }}>
          Aperçu
        </Button>
        <Button variant="contained" startIcon={<Check />} sx={{ bgcolor: '#4caf50' }}>
          Approuver
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default CustomAppBar;

