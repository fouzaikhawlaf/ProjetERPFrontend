import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, updateService } from 'services/ServiceApi';
import { useSnackbar } from 'notistack';
import { CircularProgress, Box } from '@mui/material';
import ProductTypeStep from '../ProductSteps/ProductTypeStep';
import ProductInfoStep from '../ProductSteps/ProductInfoStep';
import AdditionalInfoStep from '../ProductSteps/AdditionalInfoStep';
import PreviewStep from '../ProductSteps/Preview';
import SuccessPage from '../ProductSteps/SuccessPage';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Fonction pour convertir les heures décimales en format HH:mm:ss
const formatDuration = (hours) => {
  const totalSeconds = Math.round(hours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Fonction pour convertir le format HH:mm:ss en heures décimales
const parseDuration = (durationString) => {
  if (!durationString) return 0.5;
  
  try {
    const [hours, minutes, seconds] = durationString.split(':').map(Number);
    return hours + (minutes / 60) + (seconds / 3600);
  } catch {
    return 0.5;
  }
};

function UpdateServiceForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productType: '1', // Par défaut service
    name: '',
    category: '',
    priceType: 'Fixed',
    tvaRate: 19,
    salePrice: '',
    duration: 0.5,
    unit: 'heure',
    description: '',
    isArchived: false
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const service = await getService(serviceId);
        
        setFormData({
          productType: '1', // Forcer le type service
          name: service.name || '',
          category: service.category || '',
          priceType: service.priceType || 'Fixed',
          tvaRate: service.taxRate || 19,
          salePrice: service.price?.toString() || '0',
          duration: parseDuration(service.duration) || 0.5, // Conversion en heures décimales
          unit: service.unit || 'heure',
          description: service.description || '',
          isArchived: service.isArchived || false
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch service data', error);
        enqueueSnackbar('Échec de la récupération des données du service', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId, enqueueSnackbar]);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const goToStep = (step) => setCurrentStep(step);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const salePrice = parseFloat(formData.salePrice) || 0;
      const tvaRate = parseFloat(formData.tvaRate) || 19;
      const duration = parseFloat(formData.duration) || 0.5;
      
      // Validation
      if (!formData.name || formData.name.trim() === '') {
        enqueueSnackbar('Le nom du service est requis', { variant: 'error' });
        return;
      }
      
      if (salePrice <= 0) {
        enqueueSnackbar('Le prix doit être supérieur à 0', { variant: 'error' });
        return;
      }

      if (duration <= 0) {
        enqueueSnackbar('La durée doit être supérieure à 0', { variant: 'error' });
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: salePrice,
        taxRate: tvaRate,
        tvaRate: convertTvaRate(tvaRate),
        priceType: formData.priceType,
        category: formData.category,
        unit: formData.unit,
        isArchived: formData.isArchived,
        itemTypeArticle: 1, // Toujours service
        duration: formatDuration(duration) // Formatage correct pour le backend
      };

      console.log("Payload envoyé:", payload); // Pour débogage
      
      await updateService(serviceId, payload);
      enqueueSnackbar('Service mis à jour avec succès', { variant: 'success' });
      nextStep();
    } catch (error) {
      console.error('Failed to update service', error);
      
      // Message d'erreur plus détaillé
      const errorMessage = error.response?.data?.title 
        || error.response?.data?.message 
        || error.message 
        || 'Échec de la mise à jour du service';
      
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
              forceServiceType // Nouvelle prop pour forcer le type service
            />
          )}
          
          {currentStep === 2 && (
            <ProductInfoStep
              productType={parseInt(formData.productType)}
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
              productType={parseInt(formData.productType)}
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
              onContinue={() => navigate('/services')} 
              onEditAgain={() => goToStep(1)}
              itemType={1} // Service
            />
          )}
        </div>
      </Box>
    </DashboardLayout>
  );
}

export default UpdateServiceForm;