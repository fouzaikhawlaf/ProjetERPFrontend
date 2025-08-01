import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ProductTypeStep from './ProductTypeStep';
import ProductInfoStep from './ProductInfoStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import PreviewStep from './Preview';
import { createProduct } from 'services/ProductApi';
import PropTypes from 'prop-types';
import SuccessPage from './SuccessPage';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

function ProductFormStepsPD() {
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState(0);
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
    description: '',
    category: '',
    unit: '',
    image: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (event, newValue) => setStep(newValue);

  // Conversion automatique des champs numériques
  const handleProductInfoChange = (field) => (event) => {
    let value = event.target.value;
    
    if (field === 'salePrice' || field === 'tvaRate') {
      value = value === '' ? '' : Number(value);
    }
    
    setProductInfo({ ...productInfo, [field]: value });
  };

  const handleAdditionalInfoChange = (field) => (event) => {
    setAdditionalInfo({ ...additionalInfo, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    const productData = {
      productType,
      ...productInfo,
      ...additionalInfo,
    };

    try {
      const response = await createProduct(productData);
      if (response) {
        setStep(4); // Aller à l'étape de succès
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response && error.response.data) {
        alert(`Erreur: ${error.response.data.message || 'Une erreur s\'est produite.'}`);
      } else {
        alert('Une erreur réseau ou serveur s\'est produite.');
      }
    }
  };

  const handleEdit = (section) => {
    switch (section) {
      case 'productType': setStep(0); break;
      case 'productInfo': setStep(1); break;
      case 'additionalInfo': setStep(2); break;
      default: break;
    }
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
          <Tab label="Informations du produit" />
          <Tab label="Informations supplémentaires" />
          <Tab label="Aperçu" />
          <Tab label="Terminé" />
        </Tabs>

        {step === 0 && (
          <ProductTypeStep
            productType={productType}
            setProductType={setProductType}
            handleNext={handleNext}
          />
        )}
        {step === 1 && (
          <ProductInfoStep
            productInfo={productInfo}
            handleProductInfoChange={handleProductInfoChange}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        )}
        {step === 2 && (
          <AdditionalInfoStep
            additionalInfo={additionalInfo}
            handleAdditionalInfoChange={handleAdditionalInfoChange}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        )}
        {step === 3 && (
          <PreviewStep
            productType={productType === 0 ? "Produit" : "Service"}
            productInfo={productInfo}
            additionalInfo={additionalInfo}
            handlePrev={handlePrev}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
            mode="create" // Mode create spécifié
          />
        )}
        {step === 4 && <SuccessPage />}
      </Box>
    </DashboardLayout>
  );
}

export default ProductFormStepsPD;