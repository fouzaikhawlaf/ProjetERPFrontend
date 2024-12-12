import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  Card,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
  Box,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

import { Add, Remove } from '@mui/icons-material';

function ClientFormSteps() {
  const [step, setStep] = useState(0);
  const [clientType, setClientType] = useState('');
  const [civility, setCivility] = useState('');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', identifier: '' });
  const [contactDetails, setContactDetails] = useState({ phone: '', address: '' });
  const [additionalInfo, setAdditionalInfo] = useState({ notes: '', preferences: '' });
  const [phoneNumbers, setPhoneNumbers] = useState([{ type: 'Numéro de téléphone', number: '' }]);
  const [addresses, setAddresses] = useState([{ type: 'Adresse de facturation', country: 'Tunisie', region: '', postalCode: '', address: '' }]);
 // États pour les erreurs
 const [errors, setErrors] = useState({});




 
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleChange = (event, newValue) => {
    setStep(newValue);
  };

  const handleClientTypeChange = (type) => {
    setClientType(type);
  };

  const handleCivilityChange = (event) => {
    setCivility(event.target.value);
  };

  const handleClientInfoChange = (field) => (event) => {
    setClientInfo({ ...clientInfo, [field]: event.target.value });
  };

  const handleContactDetailsChange = (field) => (event) => {
    setContactDetails({ ...contactDetails, [field]: event.target.value });
  };

  const handleAdditionalInfoChange = (field) => (event) => {
    setAdditionalInfo({ ...additionalInfo, [field]: event.target.value });
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { type: 'Numéro de téléphone', number: '' }]);
  };

  const handleRemovePhoneNumber = (index) => {
    const updatedPhones = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhones);
  };

  const handlePhoneNumberChange = (index, field, value) => {
    const updatedPhones = phoneNumbers.map((phone, i) =>
      i === index ? { ...phone, [field]: value } : phone
    );
    setPhoneNumbers(updatedPhones);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { type: 'Adresse de facturation', country: 'Tunisie', region: '', postalCode: '', address: '' }]);
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = addresses.map((address, i) =>
      i === index ? { ...address, [field]: value } : address
    );
    setAddresses(updatedAddresses);
  };

  // Fonction pour envoyer les données au backend
  const handleSubmit = async () => {
    const clientData = {
      clientType,
      civility,
      clientInfo,
      contactDetails,
      additionalInfo,
      phoneNumbers,
      addresses,
    };

    try {
      const response = await axios.post('https://api.example.com/clients', clientData); // Remplace par ton URL backend
      console.log('Client ajouté avec succès', response.data);
      // Optionnel : Réinitialiser le formulaire ou rediriger l'utilisateur
    } catch (error) {
      console.error('Erreur lors de l’ajout du client', error);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', padding: '20px' }}>
        {/* Onglets pour navigation */}
        <Tabs
          value={step}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Type de client" />
          <Tab label="Informations du client" />
          <Tab label="Coordonnées" />
          <Tab label="Informations supplémentaires" />
          <Tab label="Terminé" />
        </Tabs>

        {/* Étape 1 : Type de client */}
        {step === 0 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Type de client
            </Typography>
            <RadioGroup
              row
              value={clientType}
              onChange={(e) => handleClientTypeChange(e.target.value)}
              style={{ justifyContent: 'center', marginTop: '20px' }}
            >
              <FormControlLabel
                value="Individuel"
                control={<Radio color="primary" />}
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    padding="20px"
                    border={clientType === 'Individuel' ? '2px solid #2196f3' : '1px solid #e0e0e0'}
                    borderRadius="8px"
                    width="200px"
                    textAlign="center"
                  >
                    <img src="images/user.png" alt="user icon" />
                    <Typography>Individuel</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="Professionnel"
                control={<Radio color="primary" />}
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    padding="20px"
                    border={clientType === 'Professionnel' ? '2px solid #2196f3' : '1px solid #e0e0e0'}
                    borderRadius="8px"
                    width="200px"
                    textAlign="center"
                  >
                    <img src="images/business.png" alt="business icon" />
                    <Typography>Professionnel</Typography>
                  </Box>
                }
              />
            </RadioGroup>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!clientType}
              style={{ marginTop: '30px' }}
            >
              Continuer
            </Button>
          </Card>
        )}

        {/* Étape 2 : Informations du client */}
        {step === 1 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Informations du client
            </Typography>

            {/* Sélection de civilité */}
            <FormControl component="fieldset" style={{ marginTop: '20px' }}>
              <RadioGroup
                row
                value={civility}
                onChange={handleCivilityChange}
                style={{ justifyContent: 'center' }}
              >
                <FormControlLabel
                  value="Monsieur"
                  control={<Radio color="primary" />}
                  label="Monsieur"
                />
                <FormControlLabel
                  value="Madame"
                  control={<Radio color="primary" />}
                  label="Madame"
                />
              </RadioGroup>
            </FormControl>

            {/* Nom, Email, et Identifiant */}
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  required
                  value={clientInfo.name}
                  onChange={handleClientInfoChange('name')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={clientInfo.email}
                  onChange={handleClientInfoChange('email')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Identifiant unique"
                  variant="outlined"
                  fullWidth
                  value={clientInfo.identifier}
                  onChange={handleClientInfoChange('identifier')}
                />
              </Grid>
            </Grid>

            {/* Boutons de navigation */}
            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button variant="outlined" color="primary" onClick={handlePrev}>
                Retour
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!clientInfo.name}
              >
                Continuer
              </Button>
            </Box>
          </Card>
        )}

        {/* Étape 3 : Coordonnées */}
        {step === 2 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Coordonnées
            </Typography>

            {/* Téléphones */}
            <Typography variant="subtitle1" gutterBottom>
              Numéros de téléphone
            </Typography>
            {phoneNumbers.map((phone, index) => (
              <Grid container spacing={3} key={index} style={{ marginTop: '10px' }}>
                <Grid item xs={3}>
                  <Select
                    label="Type"
                    value={phone.type}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, 'type', e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="Numéro de téléphone">
                      Numéro de téléphone
                    </MenuItem>
                    <MenuItem value="Numéro de fax">Numéro de fax</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    label="Numéro"
                    variant="outlined"
                    fullWidth
                    value={phone.number}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, 'number', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemovePhoneNumber(index)}>
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<Add />}
              variant="text"
              onClick={handleAddPhoneNumber}
              style={{ marginTop: '10px' }}
            >
              Ajouter un numéro
            </Button>

            {/* Adresses */}
            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
              Adresses
            </Typography>
            {addresses.map((address, index) => (
              <Grid container spacing={3} key={index} style={{ marginTop: '10px' }}>
                <Grid item xs={4}>
                  <Select
                    label="Type"
                    value={address.type}
                    onChange={(e) =>
                      handleAddressChange(index, 'type', e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="Adresse de facturation">
                      Adresse de facturation
                    </MenuItem>
                    <MenuItem value="Adresse de livraison">
                      Adresse de livraison
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Adresse"
                    variant="outlined"
                    fullWidth
                    value={address.address}
                    onChange={(e) =>
                      handleAddressChange(index, 'address', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemoveAddress(index)}>
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<Add />}
              variant="text"
              onClick={handleAddAddress}
              style={{ marginTop: '10px' }}
            >
              Ajouter une adresse
            </Button>

            {/* Boutons de navigation */}
            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button variant="outlined" color="primary" onClick={handlePrev}>
                Retour
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!phoneNumbers.length || !addresses.length}
              >
                Continuer
              </Button>
            </Box>
          </Card>
        )}

        {/* Étape 4 : Informations supplémentaires */}
        {step === 3 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Informations supplémentaires
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={additionalInfo.notes}
                  onChange={handleAdditionalInfoChange('notes')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Préférences"
                  variant="outlined"
                  fullWidth
                  value={additionalInfo.preferences}
                  onChange={handleAdditionalInfoChange('preferences')}
                />
              </Grid>
            </Grid>

            {/* Boutons de navigation */}
            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button variant="outlined" color="primary" onClick={handlePrev}>
                Retour
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Continuer
              </Button>
            </Box>
          </Card>
        )}

        {/* Étape 5 : Soumission */}
        {step === 4 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Terminé
            </Typography>

            <Typography>
              Vous avez complété toutes les étapes du formulaire. Veuillez confirmer pour soumettre vos informations.
            </Typography>

            {/* Boutons de soumission */}
            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button variant="outlined" color="primary" onClick={handlePrev}>
                Retour
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Soumettre
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default ClientFormSteps;
