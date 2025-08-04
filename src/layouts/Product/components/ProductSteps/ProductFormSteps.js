import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab,
  CircularProgress,
  useTheme
} from '@mui/material';

import { createProduct } from 'services/ProductApi';
import SuccessPage from './SuccessPage';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import { useSnackbar } from 'notistack';
import ProductInfoStep from './ProductInfoStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import PreviewStep from './Preview';
import ProductTypeStep from './ProductTypeStep';

function ProductFormStepsPD() {
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState(0);
  const [productInfo, setProductInfo] = useState({
    name: '',
    category: '',
    brand: '',
    priceType: 'Fixed',
    tvaRate: 19, // Valeur par défaut
    salePrice: '',
    stockQuantity: 0,
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    description: '',
    unit: 'pièce',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (event, newValue) => setStep(newValue);

  const handleProductInfoChange = (field) => (e) => {
    const value = e.target.value;
    
    // CORRECTION: Gestion sécurisée des champs numériques
    if (['tvaRate', 'salePrice', 'stockQuantity'].includes(field)) {
      // Permet à l'utilisateur de vider le champ
      if (value === '') {
        setProductInfo(prev => ({ ...prev, [field]: '' }));
        return;
      }
      
      // Conversion numérique adaptée au type de champ
      const numericValue = field === 'stockQuantity' 
        ? parseInt(value, 10) 
        : parseFloat(value);
        
      // Ne met à jour que si la conversion est valide
      if (!isNaN(numericValue)) {
        setProductInfo(prev => ({ ...prev, [field]: numericValue }));
      }
    } else {
      setProductInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAdditionalInfoChange = (field) => (e) => {
    setAdditionalInfo(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validation finale
      const errors = {};
      
      if (!productInfo.name.trim()) {
        errors.name = "Le nom du produit est requis";
      }
      
      // CORRECTION: Utilisation directe des valeurs numériques
      if (productInfo.salePrice <= 0) {
        errors.price = "Le prix doit être supérieur à 0";
      }
      
      if (productInfo.tvaRate < 0) {
        errors.tva = "Le taux de TVA est invalide";
      }
      
      if (productInfo.stockQuantity < 0) {
        errors.quantity = "La quantité est invalide";
      }
      
      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach(error => 
          enqueueSnackbar(error, { variant: 'error' })
        );
        return;
      }

      // CORRECTION: Préparation des données pour l'API
      const productData = {
        name: productInfo.name,
        description: additionalInfo.description,
        price: productInfo.salePrice, // Champ 'price' avec la valeur de salePrice
        taxRate: productInfo.tvaRate, // Taux entier (ex: 19)
        tvaRate: convertTvaRate(productInfo.tvaRate), // Conversion en enum
        priceType: productInfo.priceType,
        category: productInfo.category,
        unit: additionalInfo.unit,
        isArchived: false,
        itemTypeArticle: productType ,// ✅ Plus propre
        stockQuantity: productInfo.stockQuantity
      };

      const response = await createProduct(productData);
      if (response) {
        setStep(4);
        enqueueSnackbar('Produit créé avec succès', { variant: 'success' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la création du produit';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // CORRECTION: Fonction de conversion TVA
  const convertTvaRate = (rate) => {
    // Mapping des taux TVA vers les valeurs d'enum backend
    const rateMap = {
      0: 0,    // Zero
      5.5: 1,  // Reduced
      10: 2,   // Intermediate
      19: 3    // Standard
    };
    return rateMap[rate] ?? 3; // Par défaut: Standard
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
      <Box sx={{ 
        width: '100%', 
        padding: '20px',
        backgroundColor: theme.palette.background.default
      }}>
        <Tabs
          value={step}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 3 }}
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
           productType={productType} // ✅ Envoie le nombre (0/1)
            productInfo={productInfo}
            additionalInfo={additionalInfo}
            handlePrev={handlePrev}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
            isSubmitting={isSubmitting}
            error={error}
            mode="create"
          />
        )}
        
        {step === 4 && <SuccessPage />}
      </Box>
    </DashboardLayout>
  );
}

export default ProductFormStepsPD;