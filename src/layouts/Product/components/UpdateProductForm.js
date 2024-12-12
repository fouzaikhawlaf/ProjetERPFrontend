import React, { useState, useEffect } from 'react';
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

function UpdateProductForm({ product }) {  // Accept `product` as a prop
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState(product?.productType || '');
  const [productInfo, setProductInfo] = useState({
    reference: product?.reference || '',
    name: product?.name || '',
    category: product?.category || '',
    brand: product?.brand || '',
    priceType: product?.priceType || 'TTC',
    tvaRate: product?.tvaRate || '',
    salePrice: product?.salePrice || '',
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    image: product?.image || '',
    category: product?.additionalCategory || '',
    unit: product?.unit || '',
    description: product?.description || '',
  });

  useEffect(() => {
    if (product) {
      // Optionally, we can load the product into the form fields here
      setProductType(product.productType || '');
      setProductInfo({
        reference: product.reference || '',
        name: product.name || '',
        category: product.category || '',
        brand: product.brand || '',
        priceType: product.priceType || 'TTC',
        tvaRate: product.tvaRate || '',
        salePrice: product.salePrice || '',
      });
      setAdditionalInfo({
        image: product.image || '',
        category: product.additionalCategory || '',
        unit: product.unit || '',
        description: product.description || '',
      });
    }
  }, [product]);

  // Handle Next Step
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  // Handle Previous Step
  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Handle Step Change (via Tabs)
  const handleChange = (event, newValue) => setStep(newValue);

  // Product Info Change Handler
  const handleProductInfoChange = (field) => (event) =>
    setProductInfo({ ...productInfo, [field]: event.target.value });

  // Additional Info Change Handler
  const handleAdditionalInfoChange = (field) => (event) =>
    setAdditionalInfo({ ...additionalInfo, [field]: event.target.value });

  // Form Submit Handler for Updating Product
  const handleSubmit = () => {
    const updatedProduct = {
      productType,
      productInfo,
      additionalInfo,
    };

    // Make your PUT/PATCH request to update the product in your backend.
    // Example: axios.put(`/api/products/${product.id}`, updatedProduct)
    console.log('Updating product with the following data:', updatedProduct);
    alert('Product updated!');
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
              <Grid item xs={6}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={additionalInfo.description}
                  onChange={handleAdditionalInfoChange('description')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Catégorie supplémentaire"
                  variant="outlined"
                  fullWidth
                  value={additionalInfo.category}
                  onChange={handleAdditionalInfoChange('category')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Unité de mesure"
                  variant="outlined"
                  fullWidth
                  value={additionalInfo.unit}
                  onChange={handleAdditionalInfoChange('unit')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Image (URL)"
                  variant="outlined"
                  fullWidth
                  value={additionalInfo.image}
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
              Mise à jour du produit terminée!
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Mettre à jour le produit
            </Button>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default UpdateProductForm;
