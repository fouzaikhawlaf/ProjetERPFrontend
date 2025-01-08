import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ProductTypeStep from './ProductTypeStep';
import ProductInfoStep from './ProductInfoStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import CompletionStep from './CompletionStep';

import { createProduct } from 'services/ProductApi'; // Import de la fonction createProduct depuis votre service
import PreviewStep from './Preview';
import PropTypes from 'prop-types';
import SuccessPage from './SuccessPage';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

function ProductFormStepsPD ({ handleEdit })  {
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
    
    category: '',
    unit: '',

  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (event, newValue) => setStep(newValue);

  const handleProductInfoChange = (field) => (event) =>
    setProductInfo({ ...productInfo, [field]: event.target.value });

  const handleAdditionalInfoChange = (field) => (event) =>
    setAdditionalInfo({ ...additionalInfo, [field]: event.target.value });


    const validateProduct = (product) => {
      // Vérification du champ "Name"
      if (!product.name || product.name.trim() === '') {
        return "Le nom du produit est requis.";
      }
      if (product.name.length > 100) {
        return "Le nom ne doit pas dépasser 100 caractères.";
      }
    
      // Vérification du taux de TVA
      if (isNaN(product.tvaRate) || product.tvaRate < 0 || product.tvaRate > 100) {
        return "Le taux de TVA doit être un nombre compris entre 0 et 100.";
      }
    
      // Vérification du prix
      if (isNaN(product.salePrice) || product.salePrice <= 0) {
        return "Le prix doit être supérieur à 0.";
      }
    
      // Vérification des champs supplémentaires
      if (!product.priceType || product.priceType.trim() === '') {
        return "Le type de prix est requis.";
      }
      if (!product.category || product.category.trim() === '') {
        return "La catégorie est requise.";
      }
      if (!product.unit || product.unit.trim() === '') {
        return "L'unité est requise.";
      }
    
      // Aucune erreur trouvée
      return null;
    };
    
    const handleSubmit = async () => {
      // Préparation des données
      const productData = {
        productType,
        name: productInfo.name || '', // Fallback pour éviter les valeurs nulles/indéfinies
        tvaRate: productInfo.tvaRate || 0,
        priceType: productInfo.priceType || '',
        salePrice: productInfo.salePrice || 0,
        description: additionalInfo.description || '',
        category: additionalInfo.category || '',
        unit: additionalInfo.unit || '',
      };
    
      const handleEdit = (section) => {
        switch (section) {
          case 'productType':
            setStep(0); // Redirect to product type step
            break;
          case 'productInfo':
            setStep(1); // Redirect to product info step
            break;
          case 'additionalInfo':
            setStep(2); // Redirect to additional info step
            break;
          default:
            break;
        }
      };
      




      // Validation des données
      const error = validateProduct(productData);
      if (error) {
        alert(error); // Affiche une alerte avec le message d'erreur
        console.error(error);
        return; // Stoppe l'exécution si une erreur est détectée
      }
    
      console.log('Données envoyées :', productData);
    
      try {
        // Envoi des données via le service
        const response = await createProduct(productData);
        if (response) {
          alert('Produit créé avec succès!');
          console.log('Response data:', response);
        }
      } catch (error) {
        console.error('Erreur:', error);
        // Gestion des erreurs de l'API ou du réseau
        if (error.response && error.response.data) {
          alert(`Erreur: ${error.response.data.message || 'Une erreur s\'est produite.'}`);
        } else {
          alert('Une erreur réseau ou serveur s\'est produite.');
        }
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
          <Tab label="Aperçu" /> {/* New tab for preview */}
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
            productType={productType}
            productInfo={productInfo}
            additionalInfo={additionalInfo}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit} // Pass handleEdit function
          />
          )}
        {step === 4 && <SuccessPage handleSubmit={handleSubmit} />}
      </Box>
    </DashboardLayout>
  );
}
ProductFormStepsPD.propTypes = {
  handleEdit: PropTypes.func.isRequired, // Indique que handleEdit est une fonction obligatoire
};

export default ProductFormStepsPD;
