import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSupplierById, updateSupplier } from 'services/supplierApi';
import { useSnackbar } from 'notistack';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import { CircularProgress, Box } from '@mui/material';
import Step1SupplierInfo from '../supplierSteps/Step1SupplierInfo';
import Step2SupplierAddress from '../supplierSteps/Step2ContactDetails';
import PreviewSupplierStep from '../PreviewSupplierStep';

function EditSupplierPage() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    addresses: [{ addressLine1: '', addressLine2: '', country: '' }],
  });

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const supplier = await getSupplierById(supplierId);
        
        const normalizedAddresses = supplier.addresses?.$values || supplier.addresses || [];
        
        setSupplierInfo({
          name: supplier.name || '',
          code: supplier.code || '',
          contactPerson: supplier.contactPerson || '',
          email: supplier.email || '',
          phone: supplier.phone || '',
          website: supplier.website || '',
          addresses: normalizedAddresses.length > 0 
            ? normalizedAddresses.map(addr => ({
                addressLine1: addr.addressLine1 || '',
                addressLine2: addr.addressLine2 || '',
                country: addr.country || ''
              }))
            : [{ addressLine1: '', addressLine2: '', country: '' }]
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch supplier data', error);
        enqueueSnackbar('Échec de la récupération des données du fournisseur', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [supplierId, enqueueSnackbar]);

  const handleNext = () => {
    switch (step) {
      case 0:
        if (!supplierInfo.name || !supplierInfo.email || !supplierInfo.phone) {
          enqueueSnackbar('Veuillez remplir les champs obligatoires', { variant: 'warning' });
          return;
        }
        break;
      case 1:
        const validAddresses = supplierInfo.addresses.filter(
          addr => addr.addressLine1 && addr.country
        );
        
        if (validAddresses.length === 0) {
          enqueueSnackbar('Veuillez ajouter au moins une adresse valide', { variant: 'warning' });
          return;
        }
        break;
      default:
        break;
    }
    
    if (step < 2) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleEdit = (section) => {
    switch (section) {
      case 'supplierInfo': setStep(0); break;
      case 'address': setStep(1); break;
      default: break;
    }
  };

  // Fonction corrigée avec le crochet manquant
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updateData = {
        ...supplierInfo,
        addresses: supplierInfo.addresses.map(addr => ({
          ...addr,
          addressID: addr.addressID || 0
        }))
      };
      
      await updateSupplier(supplierId, updateData);
      enqueueSnackbar('Fournisseur mis à jour avec succès', { variant: 'success' });
      navigate('/suppliers');
    } catch (error) {
      console.error('Failed to update supplier', error);
      enqueueSnackbar('Échec de la mise à jour du fournisseur', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    } // Correction ici - ajout du crochet fermant
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

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
            supplierInfo={supplierInfo}
            handlePrev={handlePrev}
            handleEdit={handleEdit}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditMode={true}
          />
        )}
      </Box>
    </DashboardLayout>
  );
}

export default EditSupplierPage;