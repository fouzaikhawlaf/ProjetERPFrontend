import React, { useState } from 'react';

import Success from './Success';
import ClientType from './ClientType';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import ClientPreviewStep from './Confirmation';

export default function MultiStepForm() {
  const [formData, setFormData] = useState({
    clientType: '',
    civility: '',
    name: '',
    email: '',
    identifier: '',
    phoneNumbers: [],
    addresses: [],
    additionalInfo: { notes: '', preferences: '' },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [clientType, setClientType] = useState('');
  const [civility, setCivility] = useState('Monsieur');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    identifier: '',
  });
  
  const [contactDetails, setContactDetails] = useState({ phone: '', address: '' });
  const [additionalInfo, setAdditionalInfo] = useState({ notes: '', preferences: '' });
  const [phoneNumbers, setPhoneNumbers] = useState([{ type: 'Numéro de téléphone', number: '' }]);
  const [addresses, setAddresses] = useState([{ type: 'Adresse de facturation', country: 'Tunisie', region: '', postalCode: '', address: '' }]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };




// Function to go to a specific step
const goToStep = (stepNumber) => {
  setCurrentStep(stepNumber); // Corrected to use setCurrentStep
};


  const handleClientTypeChange = (type) => {
    setClientType(type);
  };

  const handleCivilityChange = (event) => {
    setFormData({ ...formData, civility: event.target.value });
  };
  
    // Function to handle changes in client info fields
    const handleClientInfoChange = (event) => {
      const { name, value } = event.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
};
  

  const handleContactDetailsChange = (field) => (event) => {
    setContactDetails({ ...contactDetails, [field]: event.target.value });
  };

  const handleAdditionalInfoChange = (field) => (event) => {
    setAdditionalInfo({ ...additionalInfo, [field]: event.target.value });
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { type: 'Numéro de téléphone', number: '' }]);
  };

  const handleRemovePhoneNumber = (index) => {
    const updatedPhones = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhones);
  };

  const handlePhoneNumberChange = (index, field, value) => {
    const updatedPhones = phoneNumbers.map((phone, i) =>
      i === index ? { ...phone, [field]: value } : phone
    );
    setPhoneNumbers(updatedPhones);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { type: 'Adresse de facturation', country: 'Tunisie', region: '', postalCode: '', address: '' }]);
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = addresses.map((address, i) =>
      i === index ? { ...address, [field]: value } : address
    );
    setAddresses(updatedAddresses);
  };

  // Fonction pour envoyer les données au backend
  const handleSubmit = async () => {
    const clientData = {
      clientType,
      civility,
      clientInfo,
      contactDetails,
      additionalInfo,
      phoneNumbers,
      addresses,
    };
    // Envoie de `clientData` vers le backend
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientType
          clientType={clientType} // Pass clientType here
           formData={formData}
            setFormData={setFormData}
            handleClientTypeChange={handleClientTypeChange}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <SecondStep
           
            formData={formData}
            handleCivilityChange={handleCivilityChange}
            handleClientInfoChange={handleClientInfoChange} // Corrected
            handleNext={handleNext} // Change to handleNext
           handlePrev={handlePrev} // Change to handlePrev
          />
        );
      case 3:
        return (
          <ThirdStep
          phoneNumbers={phoneNumbers} // Pass phoneNumbers as prop
          addresses={addresses} // Pass addresses as prop
          handlePhoneNumberChange={handlePhoneNumberChange} // Pass handler for phone number changes
          handleAddPhoneNumber={handleAddPhoneNumber} // Pass handler to add phone number
          handleRemovePhoneNumber={handleRemovePhoneNumber} // Pass handler to remove phone number
          handleAddressChange={handleAddressChange} // Pass handler for address changes
          handleAddAddress={handleAddAddress} // Pass handler to add address
          handleRemoveAddress={handleRemoveAddress} // Pass handler to remove address
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
        );
        case 4:
          return (
            <AdditionalInfoStep
              additionalInfo={additionalInfo}
              handleAdditionalInfoChange={handleAdditionalInfoChange}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          );
      case 5:
        return (
          <ClientPreviewStep
            prevStep={handlePrev}
            clientInfo={clientInfo}
            goToStep={goToStep} // Pass the goToStep function as a prop
            handleSubmit={handleSubmit}
          />
        );
      case 6:
        return <Success />;
      default:
        return (
          <ClientType
            clientType={clientType}
            handleClientTypeChange={handleClientTypeChange}
            handleNext={handleNext}
          />
        );
    }
  };

  return (
    <div className="multi-step-form">
      {renderStep()}
    </div>
  );
}
