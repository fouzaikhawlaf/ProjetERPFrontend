import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';



import Step1SupplierInfo from './Step1SupplierInfo';
import Step2ContactDetails from './Step2ContactDetails';
import Step3Addresses from './Step3Addresses';

import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import PreviewSupplierStep from '../PreviewSupplierStep';

const SupplierFormStepsDb = () => {
  const [step, setStep] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState({
    companyName: '',
    contactTitle: '',
    phone: '',
    address: '',
  });
  const [contactDetails, setContactDetails] = useState([{ type: 'Numéro de téléphone', number: '' }]);
  const [addresses, setAddresses] = useState([{ type: 'Adresse de facturation', address: '' }]);

  const handleNext = () => setStep((prev) => (prev < 3 ? prev + 1 : prev));
  const handlePrev = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));
  const handleEdit = (section) => {
    switch (section) {
      case 'supplierInfo':
        setStep(1);
        break;
      case 'contactDetails':
        setStep(2);
        break;
      case 'addresses':
        setStep(3);
        break;
      default:
        break;
    }
  };
  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Tabs value={step} onChange={(e, newValue) => setStep(newValue)} centered>
          <Tab label=" Infos Fournisseur" />
          <Tab label=" Coordonnées" />
          <Tab label=" Adresses" />
          <Tab label=" Terminé" />
        </Tabs>

        {step === 0 && <Step1SupplierInfo supplierInfo={supplierInfo} setSupplierInfo={setSupplierInfo} handleNext={handleNext} />}
        {step === 1 && <Step2ContactDetails contactDetails={contactDetails} setContactDetails={setContactDetails} handleNext={handleNext} handlePrev={handlePrev} />}
        {step === 2 && <Step3Addresses addresses={addresses} setAddresses={setAddresses} handleNext={handleNext} handlePrev={handlePrev} />}
        {step === 3 && <PreviewSupplierStep handlePrev={handlePrev} />}
      </Box>
    </DashboardLayout>
  );
};

export default SupplierFormStepsDb;
