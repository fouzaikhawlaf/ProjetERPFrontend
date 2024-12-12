import React, { useState } from 'react';
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
import { Add, Remove } from '@mui/icons-material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


function ProductFormSteps() {
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState('');
  const [productInfo, setProductInfo] = useState({
    reference: '',
    name: '',
    category: '',
    brand: '',
    priceType: 'TTC',
    tvaRate: '',
    salePrice: '',
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    image: '',
    category: '',
    unit: '',
    description: '',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (event, newValue) => setStep(newValue);

  const handleProductInfoChange = (field) => (event) =>
    setProductInfo({ ...productInfo, [field]: event.target.value });

  const handleAdditionalInfoChange = (field) => (event) =>
    setAdditionalInfo({ ...additionalInfo, [field]: event.target.value });

  const handleSubmit = () => {
    console.log({
      productType,
      productInfo,
      additionalInfo,
    });
    alert('Form submitted!');
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', padding: '20px' }}>
        {/* Tabs for navigation */}
        <Tabs
          value={step}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Type de produit" />
          <Tab label="Informations du produit" />
          <Tab label="Informations supplémentaires" />
          <Tab label="Terminé" />
        </Tabs>

        {/* Step 1: Product Type */}
        {step === 0 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Type de produit
            </Typography>
            <RadioGroup
              row
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              style={{ justifyContent: 'center', marginTop: '20px' }}
            >
              <FormControlLabel
                value="Matériel"
                control={<Radio color="primary" />}
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    padding="20px"
                    border={
                      productType === 'Matériel'
                        ? '2px solid #2196f3'
                        : '1px solid #e0e0e0'
                    }
                    borderRadius="8px"
                    width="200px"
                    textAlign="center"
                  >
                    <img src="/path_to_material_icon.svg" alt="Matériel icon" />
                    <Typography>Matériel</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="Service"
                control={<Radio color="primary" />}
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    padding="20px"
                    border={
                      productType === 'Service'
                        ? '2px solid #2196f3'
                        : '1px solid #e0e0e0'
                    }
                    borderRadius="8px"
                    width="200px"
                    textAlign="center"
                  >
                    <img src="/path_to_service_icon.svg" alt="Service icon" />
                    <Typography>Service</Typography>
                  </Box>
                }
              />
            </RadioGroup>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!productType}
              style={{ marginTop: '30px' }}
            >
              Continuer
            </Button>
          </Card>
        )}

        {/* Step 2: Product Information */}
        {step === 1 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Informations du produit
            </Typography>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={6}>
                <TextField
                  label="Nom du produit"
                  variant="outlined"
                  fullWidth
                  value={productInfo.name}
                  onChange={handleProductInfoChange('name')}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>TVA (%)</Typography>
                  <RadioGroup
                    row
                    value={productInfo.tvaRate}
                    onChange={handleProductInfoChange('tvaRate')}
                  >
                    {[4, 7, 13, 19, 0].map((rate) => (
                      <FormControlLabel
                        key={rate}
                        value={rate}
                        control={<Radio />}
                        label={`${rate}%`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>Prix unitaire (TTC ou HT)</Typography>
                  <Select
                    value={productInfo.priceType}
                    onChange={handleProductInfoChange('priceType')}
                  >
                    <MenuItem value="TTC">TTC</MenuItem>
                    <MenuItem value="HT">HT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Prix de vente"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={productInfo.salePrice}
                  onChange={handleProductInfoChange('salePrice')}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button onClick={handlePrev} variant="outlined">
                Retour
              </Button>
              <Button onClick={handleNext} variant="contained" color="primary">
                Continuer
              </Button>
            </Box>
          </Card>
        )}

        {/* Step 3: Additional Information */}
        {step === 2 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Informations supplémentaires
            </Typography>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={additionalInfo.description}
                  onChange={handleAdditionalInfoChange('description')}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>Catégorie générale</Typography>
                  <Select
                    value={additionalInfo.category}
                    onChange={handleAdditionalInfoChange('category')}
                  >
                    <MenuItem value="Electronics">Électronique</MenuItem>
                    <MenuItem value="Furniture">Mobilier</MenuItem>
                    {/* Add more categories here */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>Unité</Typography>
                  <Select
                    value={additionalInfo.unit}
                    onChange={handleAdditionalInfoChange('unit')}
                  >
                    <MenuItem value="Kg">Kg</MenuItem>
                    <MenuItem value="Piece">Pièce</MenuItem>
                    {/* Add more units here */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image du produit"
                  variant="outlined"
                  fullWidth
                  type="file"
                  onChange={handleAdditionalInfoChange('image')}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button onClick={handlePrev} variant="outlined">
                Retour
              </Button>
              <Button onClick={handleNext} variant="contained" color="primary">
                Continuer
              </Button>
            </Box>
          </Card>
        )}

        {/* Step 4: Completion */}
        {step === 3 && (
          <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Terminé
            </Typography>
            <Typography gutterBottom>
              Votre produit a été configuré avec succès.
            </Typography>

            <Box display="flex" justifyContent="center" marginTop="20px">
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

export default ProductFormSteps;
