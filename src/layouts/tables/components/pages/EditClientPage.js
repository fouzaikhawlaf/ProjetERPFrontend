import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import corrigé
import { getClient, updateClient } from 'services/ApiClient';
import ClientType from '../ClientSteps/ClientType';
import SecondStep from '../ClientSteps/SecondStep';
import ThirdStep from '../ClientSteps/ThirdStep';
import AdditionalInfoStep from '../ClientSteps/AdditionalInfoStep';
import ClientPreviewStep from '../ClientSteps/Confirmation';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';

function EditClientPage() {
  const { clientId } = useParams();
  const navigate = useNavigate(); // Utilisez useNavigate au lieu de useHistory
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientType: '',
    civility: '',
    name: '',
    email: '',
    identifier: '',
    phoneNumbers: [{ type: 'Numéro de téléphone', number: '' }],
    addresses: [{ type: 'Adresse de facturation', address: '', region: '', postalCode: '', country: 'Tunisie' }],
    notes: '',
    preferences: '',
  });
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar(); // Pour les notifications

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const client = await getClient(clientId);
        setFormData({
          clientType: client.clientType,
          civility: client.civility,
          name: client.name,
          email: client.email,
          identifier: client.identifier,
          phoneNumbers: client.phoneNumbers?.$values || client.phoneNumbers || [],
          addresses: client.addresses?.$values || client.addresses || [],
          notes: client.notes,
          preferences: client.preferences,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch client data', error);
        enqueueSnackbar('Échec de la récupération des données du client', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, enqueueSnackbar]);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const goToStep = (step) => setCurrentStep(step);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateClient(clientId, formData);
      enqueueSnackbar('Client mis à jour avec succès', { variant: 'success' });
      navigate('/clients'); // Utilisez navigate au lieu de history.push
    } catch (error) {
      console.error('Failed to update client', error);
      enqueueSnackbar('Échec de la mise à jour du client', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div>
      {currentStep === 1 && (
        <ClientType 
          formData={formData} 
          updateField={updateField} 
          handleNext={nextStep} 
        />
      )}
      
      {currentStep === 2 && (
        <SecondStep 
          formData={formData} 
          updateField={updateField} 
          handleNext={nextStep} 
          handlePrev={prevStep} 
        />
      )}
      
      {currentStep === 3 && (
        <ThirdStep 
          formData={formData} 
          updateField={updateField} 
          handleNext={nextStep} 
          handlePrev={prevStep} 
        />
      )}
      
      {currentStep === 4 && (
        <AdditionalInfoStep 
          formData={formData} 
          updateField={updateField} 
          handleNext={nextStep} 
          handlePrev={prevStep} 
        />
      )}
      
      {currentStep === 5 && (
        <ClientPreviewStep
          clientType={formData.clientType}
          civility={formData.civility}
          clientInfo={{
            name: formData.name,
            email: formData.email,
            identifier: formData.identifier,
            civility: formData.civility,
          }}
          contactDetails={{}}
          additionalInfo={{
            notes: formData.notes,
            preferences: formData.preferences,
          }}
          phoneNumbers={formData.phoneNumbers}
          addresses={formData.addresses}
          handlePrev={prevStep}
          handleSubmit={handleSubmit}
          goToStep={goToStep}
        />
      )}
    </div>
  );
}

export default EditClientPage;