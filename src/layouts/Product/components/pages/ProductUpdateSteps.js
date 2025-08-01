import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct } from 'services/ProductApi';

import { useSnackbar } from 'notistack';
import { CircularProgress, Box } from '@mui/material';
import ProductTypeStep from '../ProductSteps/ProductTypeStep';
import ProductInfoStep from '../ProductSteps/ProductInfoStep';
import AdditionalInfoStep from '../ProductSteps/AdditionalInfoStep';
import PreviewStep from '../ProductSteps/Preview';
import SuccessPage from '../ProductSteps/SuccessPage';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

function UpdateProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productType: '',
    reference: '',
    name: '',
    category: '',
    brand: '',
    priceType: 'TTC',
    tvaRate: '',
    salePrice: '',
    image: '',
    unit: '',
    description: '',
    stockQuantity: 0, // Ajout du champ manquant
    isArchived: false // Ajout du champ manquant
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const product = await getProduct(productId);
        
        // Conversion correcte des valeurs
        setFormData({
          productType: product.itemTypeArticle?.toString() || '0',
          reference: product.reference || '',
          name: product.name || '',
          category: product.category || '',
          brand: product.brand || '',
          priceType: product.priceType || 'TTC',
          tvaRate: product.taxRate ? (product.taxRate * 100).toString() : '0', // Convertir en pourcentage
          salePrice: product.price?.toString() || '0',
          image: product.image || '',
          unit: product.unit || '',
          description: product.description || '',
          stockQuantity: product.stockQuantity || 0,
          isArchived: product.isArchived || false
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product data', error);
        enqueueSnackbar('Échec de la récupération des données du produit', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, enqueueSnackbar]);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const goToStep = (step) => setCurrentStep(step);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Conversion numérique
      const salePrice = parseFloat(formData.salePrice);
      const tvaRate = parseFloat(formData.tvaRate);
      
      // Validation
      if (!formData.name || formData.name.trim() === '') {
        enqueueSnackbar('Le nom du produit est requis', { variant: 'error' });
        return;
      }
      
      if (isNaN(salePrice)) {
        enqueueSnackbar('Le prix doit être un nombre valide', { variant: 'error' });
        return;
      }
      
      if (salePrice <= 0) {
        enqueueSnackbar('Le prix doit être supérieur à 0', { variant: 'error' });
        return;
      }

      // Préparer les données pour l'API
      const payload = {
        name: formData.name,
        description: formData.description,
        price: salePrice,
        taxRate: tvaRate / 100, // Convertir en décimal (ex: 19% => 0.19)
        tvaRate: convertTvaRate(tvaRate), // Convertir en valeur enum
        priceType: formData.priceType,
        category: formData.category,
        unit: formData.unit,
        isArchived: formData.isArchived,
        itemTypeArticle: parseInt(formData.productType),
        stockQuantity: parseInt(formData.stockQuantity) || 0
      };

      await updateProduct(productId, payload);
      enqueueSnackbar('Produit mis à jour avec succès', { variant: 'success' });
      nextStep();
    } catch (error) {
      console.error('Failed to update product', error);
      const errorMessage = error.response?.data?.message || 'Échec de la mise à jour du produit';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper pour convertir le taux TVA en valeur d'enum
  const convertTvaRate = (rate) => {
    const rateMap = {
      0: 'Zero',
      5.5: 'Reduced',
      10: 'Intermediate',
      19: 'Standard'
    };
    return rateMap[rate] || 'Standard';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <DashboardLayout>
          <Box sx={{ width: '100%', padding: '20px' }}>
    <div>
      {currentStep === 1 && (
        <ProductTypeStep
          productType={formData.productType}
          setProductType={(value) => updateField('productType', value)}
          handleNext={nextStep}
        />
      )}
      
      {currentStep === 2 && (
        <ProductInfoStep
          productInfo={formData}
          handleProductInfoChange={(field) => (e) => updateField(field, e.target.value)}
          handleNext={nextStep}
          handlePrev={prevStep}
        />
      )}
      
      {currentStep === 3 && (
        <AdditionalInfoStep
          additionalInfo={formData}
          handleAdditionalInfoChange={(field) => (e) => updateField(field, e.target.value)}
          handleNext={nextStep}
          handlePrev={prevStep}
        />
      )}
      
      {currentStep === 4 && (
        <PreviewStep
          productType={formData.productType === '0' ? 'Produit' : 'Service'}
          productInfo={formData}
          additionalInfo={formData}
          handleEdit={(step) => goToStep(step === 'productType' ? 1 : step === 'productInfo' ? 2 : 3)}
          handlePrev={prevStep}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode="update"
        />
      )}
      
      {currentStep === 5 && (
        <SuccessPage 
          onContinue={() => navigate('/products')} 
          onEditAgain={() => goToStep(1)}
        />
      )}
    </div>
    </Box>
    </DashboardLayout>
  );
}

export default UpdateProductForm;