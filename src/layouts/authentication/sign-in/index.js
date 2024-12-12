import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  MenuItem, 
  useTheme 
} from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const InscriptionPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    role: '',
    departement: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajouter la logique d'inscription ici (par exemple, appeler une API)
    console.log('Form data submitted:', formData);
  };

  const theme = useTheme(); // Pour utiliser le thème global de Material-UI

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ flexGrow: 1, padding: theme.spacing(4) }}>
        <Grid container justifyContent="center" style={{ minHeight: '100vh' }}>
          <Grid item xs={12} md={8}>
            <Card 
              sx={{ 
                padding: theme.spacing(4), 
                boxShadow: theme.shadows[4], 
                borderRadius: theme.shape.borderRadius 
              }}
            >
              <CardContent>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  align="center"
                  sx={{ 
                    fontWeight: 'bold', 
                    color: theme.palette.primary.main 
                  }}
                >
                  Inscription
                </Typography>
                <Typography 
                  variant="body2" 
                  align="center" 
                  color="textSecondary"
                  sx={{ marginBottom: theme.spacing(3) }}
                >
                  Un mot de passe par défaut vous sera envoyé par email après inscription.
                </Typography>
                
                {/* Formulaire en disposition horizontale */}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Nom"
                        variant="outlined"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Prénom"
                        variant="outlined"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={3} sx={{ marginTop: theme.spacing(2) }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Adresse email"
                        variant="outlined"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        variant="outlined"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} sx={{ marginTop: theme.spacing(2) }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Date de naissance"
                        variant="outlined"
                        name="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select
                        label="Rôle"
                        variant="outlined"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="employer">Employeur</MenuItem>
                        <MenuItem value="commercial">Commercial</MenuItem>
                        <MenuItem value="rh">RH</MenuItem>
                        <MenuItem value="acheteur">Acheteur</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} sx={{ marginTop: theme.spacing(2) }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nom de département"
                        variant="outlined"
                        name="departement"
                        value={formData.departement}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  </Grid>

                  <Grid container justifyContent="center" sx={{ marginTop: theme.spacing(3) }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ padding: theme.spacing(1.5), fontSize: '1.1rem' }}
                      >
                        Inscrire
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default InscriptionPage;
