import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Link, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageShamash from 'images/imageShamash.png';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Reset error message

    try {
      const response = await axios.post('https://localhost:7298/api/auth/login', { email, password });
      
      // Assuming response has AccessToken and Username
      const { AccessToken, Username } = response.data;

      // Store token and user info in localStorage
      localStorage.setItem('accessToken', AccessToken);
      localStorage.setItem('username', Username);

      // Redirect to dashboard or another route
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <DashboardLayout>
      <Grid container component="main" sx={{ height: '100vh' }}>
        
        {/* Left Section: Form */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 2rem',
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Typography variant="h4" gutterBottom>
              Sign in
            </Typography>
            <Typography variant="body2" gutterBottom>
            Dont&#39;t have an account?{' '}
              <Link href="#" variant="body2">
                Sign up
              </Link>
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                fullWidth
                label="Email address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ marginBottom: '1rem' }}>
                  {errorMessage}
                </Typography>
              )}
              <Link href="#" variant="body2" sx={{ display: 'block', marginBottom: '1rem' }}>
                Forgot password?
              </Link>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Sign in
              </Button>
            </form>
          </Box>
        </Grid>

        <Grid
  item
  xs={false}
  sm={4}
  md={6}
  sx={{
    position: 'relative', // Set position relative for child absolute positioning
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain', // Ensure the logo fits well
    backgroundPosition: 'right', // Position the image to the right
    height: '100vh',  // Ensure the container takes the full height of the viewport
  }}
>
  {/* Logo: Positioned in the top-left corner */}
  <Box
    sx={{
      position: 'absolute',
    top: '10px', // Ajustez en fonction de vos besoins
    left: '10px', // Ajustez en fonction de vos besoins
    zIndex: 1, // Assurez que le logo reste visible
    padding: '5px', // Ajoutez un espace autour du logo
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optionnel : fond blanc semi-transparent pour mettre en valeur le logo
    borderRadius: '8px', // Optionnel : coins arrondis pour un design moderne
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optionnel : effet d'ombre pour le relief
    }}
  >
    <img src={imageShamash} alt="Company Logo"  style={{
      maxWidth: '120px', // Limite la largeur maximale de l'image
      maxHeight: '120px', // Limite la hauteur maximale
      objectFit: 'contain', // Conserve les proportions de l'image
    }}/> {/* Adjust size */}
  </Box>

  {/* Welcome message: Centered in the middle */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      height: '100%',
      textAlign: 'center',
      zIndex: 2, // Ensure it's above the background
    }}
  >
    <Typography variant="h3" component="h1">
      Welcome to Shamash-IT ERP
    </Typography>
  </Box>
</Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default SignInPage;
