import React, { useState } from 'react';
import Success from './Success';
import ClientType from './ClientType';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import ClientPreviewStep from './Confirmation';
import { createClient } from 'services/ApiClient';

export default function MultiStepForm() {
  // État unifié pour toutes les données
  const [formData, setFormData] = useState({
    clientType: '',
    civility: 'Monsieur',
    name: '',
    email: '',
    identifier: '',
    phoneNumbers: [{ type: 'Numéro de téléphone', number: '' }],
    addresses: [{ type: 'Adresse de facturation', country: 'Tunisie', region: '', postalCode: '', address: '' }],
    notes: '',
    preferences: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Fonctions de navigation
  const handleNext = () => setCurrentStep(step => Math.min(step + 1, 6));
  const handlePrev = () => setCurrentStep(step => Math.max(step - 1, 1));
  const goToStep = (stepNumber) => setCurrentStep(stepNumber);

  // Mise à jour centralisée des données
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gestion de la soumission
  const handleSubmit = async () => {
    try {
      console.log("Données à envoyer:", formData);
      await createClient(formData);
      setCurrentStep(6);
    } catch (error) {
      console.error('Erreur création client:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Rendu des étapes
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientType
            formData={formData}
            updateField={updateField}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <SecondStep
            formData={formData}
            updateField={updateField}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        );
      case 3:
        return (
          <ThirdStep
            formData={formData}
            updateField={updateField}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        );
      case 4:
        return (
          <AdditionalInfoStep
            formData={formData}
            updateField={updateField}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        );
      case 5:
        return (
          <ClientPreviewStep
            clientType={formData.clientType}
            civility={formData.civility}
            clientInfo={{
              name: formData.name,
              email: formData.email,
              identifier: formData.identifier,
              civility: formData.civility
            }}
            additionalInfo={{
              notes: formData.notes,
              preferences: formData.preferences
            }}
            phoneNumbers={formData.phoneNumbers}
            addresses={formData.addresses}
            handlePrev={handlePrev}
            handleSubmit={handleSubmit}
            goToStep={goToStep}
          />
        );
      case 6:
        return <Success />;
      default:
        return <ClientType formData={formData} updateField={updateField} handleNext={handleNext} />;
    }
  };

  return <div className="multi-step-form">{renderStep()}</div>;
}