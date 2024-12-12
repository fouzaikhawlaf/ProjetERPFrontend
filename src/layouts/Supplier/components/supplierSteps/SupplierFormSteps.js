import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';



import Step1SupplierInfo from './Step1SupplierInfo';
import Step2ContactDetails from './Step2ContactDetails';
import Step3Addresses from './Step3Addresses';
import Step4Completion from './Step4Completion';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

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

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Tabs value={step} onChange={(e, newValue) => setStep(newValue)} centered>
          <Tab label="1. Infos Fournisseur" />
          <Tab label="2. Coordonnées" />
          <Tab label="3. Adresses" />
          <Tab label="4. Terminé" />
        </Tabs>

        {step === 0 && <Step1SupplierInfo supplierInfo={supplierInfo} setSupplierInfo={setSupplierInfo} handleNext={handleNext} />}
        {step === 1 && <Step2ContactDetails contactDetails={contactDetails} setContactDetails={setContactDetails} handleNext={handleNext} handlePrev={handlePrev} />}
        {step === 2 && <Step3Addresses addresses={addresses} setAddresses={setAddresses} handleNext={handleNext} handlePrev={handlePrev} />}
        {step === 3 && <Step4Completion handlePrev={handlePrev} />}
      </Box>
    </DashboardLayout>
  );
};

export default SupplierFormStepsDb;
