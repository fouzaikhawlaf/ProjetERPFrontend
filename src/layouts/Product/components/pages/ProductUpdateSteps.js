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
    stockQuantity: 0,
    isArchived: false
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const product = await getProduct(productId);
        
        // CORRECTION: Chargement correct des valeurs TVA
        setFormData({
          productType: product.itemTypeArticle?.toString() || '0',
          reference: product.reference || '',
          name: product.name || '',
          category: product.category || '',
          brand: product.brand || '',
          priceType: product.priceType || 'TTC',
          // Charger taxRate directement (déjà en pourcentage entier)
          tvaRate: product.taxRate?.toString() || '19',
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
      // CORRECTION: Conversion numérique sécurisée
      const salePrice = parseFloat(formData.salePrice) || 0;
      const tvaRate = parseFloat(formData.tvaRate) || 19;
      const stockQuantity = parseInt(formData.stockQuantity) || 0;
      
      // Validation
      if (!formData.name || formData.name.trim() === '') {
        enqueueSnackbar('Le nom du produit est requis', { variant: 'error' });
        return;
      }
      
      if (salePrice <= 0) {
        enqueueSnackbar('Le prix doit être supérieur à 0', { variant: 'error' });
        return;
      }

      // CORRECTION: Format des données aligné sur le backend
      const payload = {
        name: formData.name,
        description: formData.description,
        price: salePrice,
        taxRate: tvaRate, // ENTIER (19), pas décimal
        tvaRate: convertTvaRate(tvaRate), // ENUM (entier)
        priceType: formData.priceType,
        category: formData.category,
        unit: formData.unit,
        isArchived: formData.isArchived,
        itemTypeArticle: parseInt(formData.productType),
        stockQuantity: stockQuantity,
        reference: formData.reference,
        image: formData.image
      };

      await updateProduct(productId, payload);
      enqueueSnackbar('Produit mis à jour avec succès', { variant: 'success' });
      nextStep();
    } catch (error) {
      console.error('Failed to update product', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la mise à jour du produit';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // CORRECTION: Même fonction de conversion que pour la création
  const convertTvaRate = (rate) => {
    const rateMap = {
      0: 0,    // Zero
      5.5: 1,  // Reduced
      10: 2,   // Intermediate
      19: 3    // Standard
    };
    return rateMap[rate] ?? 3; // Standard par défaut
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