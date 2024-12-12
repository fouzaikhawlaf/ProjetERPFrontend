import React, { useState } from 'react';
import {
  Button, Card, Typography, RadioGroup, FormControlLabel, Radio,
  Tabs, Tab, Box, Grid, TextField, FormControl, IconButton,
  Icon, Divider, Badge, Chip
} from '@mui/material';


import { Add, Remove, CheckCircleOutline } from '@mui/icons-material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

function SupplierFormSteps() {
  const [step, setStep] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState({
    companyName: '', contactTitle: '', phone: '', address: '',
  });
  const [contactDetails, setContactDetails] = useState([{ type: 'Numéro de téléphone', number: '' }]);
  const [addresses, setAddresses] = useState([{ type: 'Adresse de facturation', address: '' }]);

  const handleNext = () => setStep((prev) => (prev < 3 ? prev + 1 : prev));
  const handlePrev = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));

  const handleInputChange = (field) => (e) => setSupplierInfo({ ...supplierInfo, [field]: e.target.value });

  const handleAddContact = () => setContactDetails([...contactDetails, { type: 'Numéro de téléphone', number: '' }]);
  const handleRemoveContact = (index) => setContactDetails(contactDetails.filter((_, i) => i !== index));
  const handleContactChange = (index, value) => {
    const updatedContacts = [...contactDetails];
    updatedContacts[index].number = value;
    setContactDetails(updatedContacts);
  };

  const handleAddAddress = () => setAddresses([...addresses, { type: 'Adresse de facturation', address: '' }]);
  const handleRemoveAddress = (index) => setAddresses(addresses.filter((_, i) => i !== index));
  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].address = value;
    setAddresses(updatedAddresses);
  };

  // Custom styles
  const styles = {
    card: {
      padding: '30px',
      marginTop: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
      }
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    },
    titleIcon: {
      marginRight: '10px',
      color: '#1976d2',
    },
    description: {
      color: 'rgba(0, 0, 0, 0.6)',
      marginBottom: '15px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px',
      gap: '10px',
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    divider: {
      margin: '20px 0',
    },
    progressBadge: {
      backgroundColor: '#1976d2',
      color: 'white',
      borderRadius: '12px',
      padding: '5px 10px',
    },
    chip: {
      marginRight: '10px',
    }
  };

  return (
    <DashboardLayout>
    
      <Box sx={{ width: '100%', padding: '20px' }}>
        {/* Tabs for steps */}
        <Tabs value={step} onChange={(e, newValue) => setStep(newValue)} centered>
          <Tab label={<Typography sx={styles.progressBadge}>1. Infos Fournisseur</Typography>} />
          <Tab label={<Typography sx={styles.progressBadge}>2. Coordonnées</Typography>} />
          <Tab label={<Typography sx={styles.progressBadge}>3. Adresses</Typography>} />
          <Tab label={<Typography sx={styles.progressBadge}>4. Terminé</Typography>} />
        </Tabs>

        {/* Step 1: Supplier Information */}
        {step === 0 && (
          <Card elevation={3} sx={styles.card}>
            <Box sx={styles.header}>
              <Icon sx={styles.titleIcon}>business</Icon>
              <Typography variant="h5" gutterBottom>Informations Fournisseur</Typography>
            </Box>
          
            <TextField
              label="Nom de l'entreprise"
              value={supplierInfo.companyName}
              onChange={handleInputChange('companyName')}
              fullWidth
              sx={{ marginTop: '20px' }}
            />
            <FormControl component="fieldset" sx={{ marginTop: '20px' }}>
              <Typography variant="subtitle1">Personne à contacter</Typography>
              <RadioGroup row value={supplierInfo.contactTitle} onChange={handleInputChange('contactTitle')}>
                <FormControlLabel value="Monsieur" control={<Radio />} label="Monsieur" />
                <FormControlLabel value="Madame" control={<Radio />} label="Madame" />
              </RadioGroup>
            </FormControl>

            <Box sx={styles.badge}>
              <CheckCircleOutline sx={{ color: '#1976d2', marginRight: '10px' }} />
              <Typography variant="subtitle2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                Étape 1 sur 4 : Informations Fournisseur
              </Typography>
            </Box>

            <Divider sx={styles.divider} />

            <Box sx={styles.buttonGroup}>
              <Button variant="outlined" disabled>Retour</Button>
              <Button variant="contained" color="primary" onClick={handleNext}>Continuer</Button>
            </Box>
          </Card>
        )}

        {/* Step 2: Contact Details */}
        {step === 1 && (
          <Card elevation={3} sx={styles.card}>
            <Box sx={styles.header}>
              <Icon sx={styles.titleIcon}>contact_phone</Icon>
              <Typography variant="h5" gutterBottom>Coordonnées</Typography>
            </Box>
            <Typography sx={styles.description}>
              Ajoutez les numéros de téléphone du fournisseur. Vous pouvez en ajouter plusieurs si nécessaire.
            </Typography>
            {contactDetails.map((contact, index) => (
              <Grid container spacing={2} key={index} sx={{ marginTop: '10px' }}>
                <Grid item xs={10}>
                  <TextField
                    label="Numéro de téléphone"
                    value={contact.number}
                    onChange={(e) => handleContactChange(index, e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemoveContact(index)} color="error">
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" startIcon={<Add />} onClick={handleAddContact} sx={{ marginTop: '20px' }}>
              Ajouter un téléphone
            </Button>

            <Divider sx={styles.divider} />

            <Box sx={styles.buttonGroup}>
              <Button variant="outlined" onClick={handlePrev}>Retour</Button>
              <Button variant="contained" color="primary" onClick={handleNext}>Continuer</Button>
            </Box>
          </Card>
        )}

        {/* Step 3: Addresses */}
        {step === 2 && (
          <Card elevation={3} sx={styles.card}>
            <Box sx={styles.header}>
              <Icon sx={styles.titleIcon}>location_on</Icon>
              <Typography variant="h5" gutterBottom>Adresses</Typography>
            </Box>
            <Typography sx={styles.description}>
              Ajoutez ici les adresses du fournisseur, comme l’adresse de facturation et l’adresse de livraison.
            </Typography>
            {addresses.map((address, index) => (
              <Grid container spacing={2} key={index} sx={{ marginTop: '10px' }}>
                <Grid item xs={10}>
                  <TextField
                    label="Adresse"
                    value={address.address}
                    onChange={(e) => handleAddressChange(index, e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemoveAddress(index)} color="error">
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" startIcon={<Add />} onClick={handleAddAddress} sx={{ marginTop: '20px' }}>
              Ajouter une adresse
            </Button>

            <Divider sx={styles.divider} />

            <Box sx={styles.buttonGroup}>
              <Button variant="outlined" onClick={handlePrev}>Retour</Button>
              <Button variant="contained" color="primary" onClick={handleNext}>Continuer</Button>
            </Box>
          </Card>
        )}

        {/* Step 4: Completion */}
        {step === 3 && (
          <Card elevation={3} sx={styles.card}>
            <Box sx={styles.header}>
              <Icon sx={styles.titleIcon}>done</Icon>
              <Typography variant="h5" gutterBottom>Terminé</Typography>
            </Box>
            <Typography sx={styles.description}>
              Vous avez complété les informations du fournisseur. Cliquez sur Soumettre pour finaliser.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <Button variant="contained" color="primary" size="large">Soumettre</Button>
            </Box>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default SupplierFormSteps;
