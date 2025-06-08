import React, { useState } from 'react';
import { Box } from '@mui/material';
import Step1SupplierInfo from './Step1SupplierInfo';
import Step2SupplierAddress from './Step2ContactDetails';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import PreviewSupplierStep from '../PreviewSupplierStep';

const SupplierFormStepsDb = () => {
  const [step, setStep] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    addresses: [{ addressLine1: '', addressLine2: '', country: '' }], // Initialize with one address
  });

  const handleNext = () => {
    // Step validation logic
    switch (step) {
      case 0: // Step1SupplierInfo step
        if (!supplierInfo.name || !supplierInfo.email || !supplierInfo.phone) {
          alert('Veuillez remplir toutes les informations nécessaires.');
          return;
        }
        break;
      case 1: // Step2SupplierAddress step
        if (!supplierInfo.addresses || supplierInfo.addresses.length === 0) {
          alert('Veuillez ajouter au moins une adresse.');
          return;
        }
        // Check if all address fields are filled
        const isAddressValid = supplierInfo.addresses.every(
          (address) => address.addressLine1 && address.addressLine2 && address.country
        );
        if (!isAddressValid) {
          alert('Veuillez remplir tous les champs d\'adresse.');
          return;
        }
        break;
      default:
        break;
    }

    // Proceed to the next step if validation passes
    if (step < 2) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleEdit = (section) => {
    switch (section) {
      case 'supplierInfo':
        setStep(0); // Go back to Step 1
        break;
      case 'address':
        setStep(1); // Go back to Step 2
        break;
      default:
        break;
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', padding: '20px' }}>
        {step === 0 && (
          <Step1SupplierInfo
            supplierInfo={supplierInfo}
            setSupplierInfo={setSupplierInfo}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
        {step === 1 && (
          <Step2SupplierAddress
            supplierInfo={supplierInfo}
            setSupplierInfo={setSupplierInfo}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
        {step === 2 && (
          <PreviewSupplierStep
             supplierInfo={supplierInfo} // Pass the supplierInfo state
            handlePrev={handlePrev}
            handleEdit={handleEdit}
          />
        )}
      </Box>
    </DashboardLayout>
  );
};

export default SupplierFormStepsDb;