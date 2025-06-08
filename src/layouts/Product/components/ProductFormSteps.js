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
  Avatar
} from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

function ProductFormSteps() {
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState('');
  const [productInfo, setProductInfo] = useState({
    name: '',
    priceType: 'TTC',
    tvaRate: '',
    salePrice: '',
    quantity: '',
    imagePath: ''
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    imageFile: null,
    category: '',
    unit: '',
    description: ''
  });

  const handleNext = () => step < 3 && setStep(step + 1);
  const handlePrev = () => step > 0 && setStep(step - 1);
  const handleChange = (event, newValue) => setStep(newValue);

  const handleProductInfoChange = (field) => (event) => {
    setProductInfo({ ...productInfo, [field]: event.target.value });
  };

  const handleAdditionalInfoChange = (field) => (event) => {
    if (field === 'imageFile') {
      const file = event.target.files[0];
      setAdditionalInfo({ 
        ...additionalInfo, 
        imageFile: file 
      });
      setProductInfo({
        ...productInfo,
        imagePath: URL.createObjectURL(file)
      });
    } else {
      setAdditionalInfo({ 
        ...additionalInfo, 
        [field]: event.target.value 
      });
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('image', additionalInfo.imageFile);
    formData.append('data', JSON.stringify({
      ...productInfo,
      ...additionalInfo
    }));
    console.log('Form Data:', formData);
    alert('Produit créé avec succès !');
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Tabs
          value={step}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Type de produit" />
          <Tab label="Informations produit" />
          <Tab label="Détails supplémentaires" />
          <Tab label="Confirmation" />
        </Tabs>

        {step === 0 && (
          <Card elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Type de produit
            </Typography>
            <RadioGroup
              row
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              sx={{ justifyContent: 'center', mt: 2 }}
            >
              <FormControlLabel
                value="Matériel"
                control={<Radio color="primary" />}
                label={
                  <Box
                    sx={{
                      p: 2,
                      border: productType === 'Matériel' 
                        ? '2px solid #1976d2' 
                        : '1px solid #e0e0e0',
                      borderRadius: 2,
                      width: 200,
                      textAlign: 'center'
                    }}
                  >
                    <Typography>Matériel</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="Service"
                control={<Radio color="primary" />}
                label={
                  <Box
                    sx={{
                      p: 2,
                      border: productType === 'Service' 
                        ? '2px solid #1976d2' 
                        : '1px solid #e0e0e0',
                      borderRadius: 2,
                      width: 200,
                      textAlign: 'center'
                    }}
                  >
                    <Typography>Service</Typography>
                  </Box>
                }
              />
            </RadioGroup>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!productType}
              sx={{ mt: 3 }}
            >
              Continuer
            </Button>
          </Card>
        )}

        {step === 1 && (
          <Card elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informations de base
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom du produit"
                  fullWidth
                  value={productInfo.name}
                  onChange={handleProductInfoChange('name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>TVA (%)</Typography>
                  <RadioGroup
                    row
                    value={productInfo.tvaRate}
                    onChange={handleProductInfoChange('tvaRate')}
                  >
                    {[0, 4, 7, 13, 19].map((rate) => (
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prix de vente"
                  type="number"
                  fullWidth
                  value={productInfo.salePrice}
                  onChange={handleProductInfoChange('salePrice')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>Type de prix</Typography>
                  <Select
                    value={productInfo.priceType}
                    onChange={handleProductInfoChange('priceType')}
                  >
                    <MenuItem value="TTC">TTC</MenuItem>
                    <MenuItem value="HT">HT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handlePrev} variant="outlined">
                Retour
              </Button>
              <Button onClick={handleNext} variant="contained">
                Continuer
              </Button>
            </Box>
          </Card>
        )}

        {step === 2 && (
          <Card elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Détails supplémentaires
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleAdditionalInfoChange('imageFile')}
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span">
                     Uploader l&#39;image
                  </Button>
                </label>
                {additionalInfo.imageFile && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={productInfo.imagePath}
                      sx={{ width: 56, height: 56, borderRadius: 1 }}
                      variant="rounded"
                    />
                    <Typography variant="body2">
                      {additionalInfo.imageFile.name}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={additionalInfo.description}
                  onChange={handleAdditionalInfoChange('description')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>Catégorie</Typography>
                  <Select
                    value={additionalInfo.category}
                    onChange={handleAdditionalInfoChange('category')}
                  >
                    <MenuItem value="Électronique">Électronique</MenuItem>
                    <MenuItem value="Mobilier">Mobilier</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography gutterBottom>Unité</Typography>
                  <Select
                    value={additionalInfo.unit}
                    onChange={handleAdditionalInfoChange('unit')}
                  >
                    <MenuItem value="Pièce">Pièce</MenuItem>
                    <MenuItem value="Kg">Kilogramme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handlePrev} variant="outlined">
                Retour
              </Button>
              <Button onClick={handleNext} variant="contained">
                Continuer
              </Button>
            </Box>
          </Card>
        )}

        {step === 3 && (
          <Card elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Confirmation finale
            </Typography>
            {productInfo.imagePath && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={productInfo.imagePath}
                  sx={{ 
                    width: 150, 
                    height: 150,
                    borderRadius: 2,
                    mx: 'auto',
                    mb: 2
                  }}
                />
                <Typography variant="body2">
                   Chemin de l&#39;image : {productInfo.imagePath}
                </Typography>
              </Box>
            )}
            <Typography sx={{ mb: 2 }}>
              Nom: {productInfo.name}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Prix: {productInfo.salePrice} {productInfo.priceType}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              TVA: {productInfo.tvaRate}%
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Catégorie: {additionalInfo.category}
            </Typography>
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleSubmit}
            >
              Confirmer la création
            </Button>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default ProductFormSteps;