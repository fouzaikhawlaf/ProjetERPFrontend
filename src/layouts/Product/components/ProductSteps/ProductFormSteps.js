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

// Fonction pour formater la durée en HH:mm:ss (format valide pour .NET TimeSpan)
const formatDuration = (hours) => {
  // Convertir en nombre si nécessaire
  const numericHours = typeof hours === 'string' 
    ? parseFloat(hours.replace(',', '.')) 
    : hours;
  
  if (isNaN(numericHours)) {
    console.error('Valeur de durée invalide:', hours);
    return "00:00:00";
  }
  
  // Calculer les composants temps
  const totalSeconds = Math.round(numericHours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  // Formatage avec padding pour chaque composant
  return [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0'),
    String(s).padStart(2, '0')
  ].join(':');
};



function ProductFormStepsPD() {
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState(0);
  const [productInfo, setProductInfo] = useState({
    name: '',
    category: '',
    brand: '',
    priceType: 'Fixed',
    tvaRate: 19,
    salePrice: '',
    stockQuantity: 0,
    duration: 0.5
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

  // CORRECTION: Gestion robuste des valeurs numériques
  const handleProductInfoChange = (field) => (e) => {
    const value = e.target.value;
    
    // Gestion spéciale pour les champs numériques
    if (['tvaRate', 'salePrice', 'stockQuantity', 'duration'].includes(field)) {
      // Permettre le champ vide temporairement
      if (value === '') {
        setProductInfo(prev => ({ ...prev, [field]: '' }));
        return;
      }
      
      let numericValue;
      
      // Conversion spécifique pour les nombres décimaux
      if (field === 'duration' || field === 'salePrice') {
        // Gestion des virgules et des points
        const cleanedValue = String(value).replace(',', '.');
        numericValue = parseFloat(cleanedValue);
      } 
      // Conversion pour les entiers
      else {
        numericValue = parseInt(String(value).replace(/[^0-9]/g, ''), 10);
      }
      
      // Mise à jour seulement si conversion valide
      if (!isNaN(numericValue)) {
        setProductInfo(prev => ({ ...prev, [field]: numericValue }));
      } else {
        // Garder la valeur brute pour correction
        setProductInfo(prev => ({ ...prev, [field]: value }));
      }
    } 
    // Gestion standard pour les autres champs
    else {
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
      const errors = {};
      
      if (!productInfo.name.trim()) {
        errors.name = "Le nom est requis";
      }
      
      if (productInfo.salePrice <= 0) {
        errors.price = "Le prix doit être supérieur à 0";
      }
      
      if (productInfo.tvaRate < 0) {
        errors.tva = "Le taux de TVA est invalide";
      }
      
      if (productType === 0 && productInfo.stockQuantity < 0) {
        errors.quantity = "La quantité est invalide";
      }
      
      // Validation spécifique pour la durée des services
      if (productType === 1) {
        // CORRECTION: Utilisation de la même logique que dans UpdateServiceForm
        let durationValue;
        if (typeof productInfo.duration === 'string') {
          durationValue = parseFloat(productInfo.duration.replace(',', '.'));
        } else {
          durationValue = productInfo.duration;
        }
        
        if (isNaN(durationValue) || durationValue <= 0) {
          errors.duration = "La durée doit être un nombre supérieur à 0";
        }
      }
      
      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach(error => 
          enqueueSnackbar(error, { variant: 'error' })
        );
        return;
      }

      const productData = {
        name: productInfo.name,
        description: additionalInfo.description,
        price: productInfo.salePrice,
        taxRate: productInfo.tvaRate,
        tvaRate: convertTvaRate(productInfo.tvaRate),
        priceType: productInfo.priceType,
        category: productInfo.category,
        unit: additionalInfo.unit,
        isArchived: false,
        itemTypeArticle: productType,
        ...(productType === 0 && { stockQuantity: productInfo.stockQuantity }),
        // CORRECTION: Utilisation de la même logique de formatage que dans UpdateServiceForm
        ...(productType === 1 && { 
           duration: formatDuration(productInfo.duration)
        })
      };

      // DEBUG: Vérification des valeurs avant envoi
      console.log('Données du produit:', {
        ...productData,
        durationDebug: productType === 1 ? productInfo.duration : undefined
      });

      const response = await createProduct(productData);
      if (response) {
        setStep(4);
        enqueueSnackbar(
          productType === 0 ? 'Produit créé avec succès' : 'Service créé avec succès', 
          { variant: 'success' }
        );
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la création';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTvaRate = (rate) => {
    const rateMap = {
      0: 0,    // Zero
      7: 1,    // Reduced
      13: 2,   // Intermediate
      19: 3    // Standard
    };
    return rateMap[rate] ?? 3;
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
          <Tab label="Informations" />
          <Tab label="Détails" />
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
            productType={productType}
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
            productType={productType}
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
        
        {step === 4 && <SuccessPage itemType={productType} />}
      </Box>
    </DashboardLayout>
  );
}

export default ProductFormStepsPD;