import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { createSupplier } from 'services/supplierApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PreviewSupplierStep = ({
  supplierInfo = { companyName: '', contactTitle: 'Monsieur' },
  contactDetails = [],
  addresses = [],
  handlePrev,
  handleEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('PreviewSupplierStep - supplierInfo:', supplierInfo);
  console.log('PreviewSupplierStep - contactDetails:', contactDetails);
  console.log('PreviewSupplierStep - addresses:', addresses);

  // Validation des données avant soumission
  const validateData = () => {
    if (!supplierInfo.companyName || contactDetails.length === 0 || addresses.length === 0) {
      alert('Veuillez remplir toutes les informations nécessaires.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateData()) return;

    try {
      setLoading(true);

      // Préparation des données pour l'API
      const supplierData = {
        companyName: supplierInfo.companyName,
        contactTitle: supplierInfo.contactTitle,
        contacts: contactDetails,
        addresses: addresses,
      };

      const response = await createSupplier(supplierData);
      console.log('Supplier created successfully:', response);

      // Affichez un toast pour une confirmation rapide
      toast.success(`Fournisseur créé avec succès !`);

      // Redirigez vers la page de succès
      navigate('/success');
    } catch (error) {
      console.error('Error creating supplier:', error.response ? error.response.data : error.message);

      // Affichez une notification d'erreur
      toast.error('Erreur lors de la création du fournisseur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Aperçu du fournisseur
      </Typography>

      {/* Informations de base du fournisseur */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">
            <strong>Nom de l&apos;entreprise:</strong> {supplierInfo.companyName}
          </Typography>
          <IconButton onClick={() => handleEdit('supplierInfo')}>
            <Edit />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          <strong>Civilité:</strong> {supplierInfo.contactTitle}
        </Typography>
      </Card>

      {/* Coordonnées du fournisseur */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Coordonnées
        </Typography>
        {contactDetails.map((contact, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              <strong>{contact.type}:</strong> {contact.number}
            </Typography>
          </Box>
        ))}
        <IconButton onClick={() => handleEdit('contactDetails')}>
          <Edit />
        </IconButton>
      </Card>

      {/* Adresses du fournisseur */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Adresses
        </Typography>
        {addresses.map((address, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              <strong>{address.type}:</strong> {address.address}
            </Typography>
          </Box>
        ))}
        <IconButton onClick={() => handleEdit('addresses')}>
          <Edit />
        </IconButton>
      </Card>

      {/* Boutons d'action */}
      <Box display="flex" justifyContent="space-between" marginTop="30px">
        <Button onClick={handlePrev} variant="outlined" style={{ borderRadius: '8px' }}>
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ borderRadius: '8px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Soumettre'}
        </Button>
      </Box>
    </Card>
  );
};

PreviewSupplierStep.propTypes = {
  supplierInfo: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    contactTitle: PropTypes.string.isRequired,
  }),
  contactDetails: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ),
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ),
  handlePrev: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

PreviewSupplierStep.defaultProps = {
  supplierInfo: { companyName: '', contactTitle: 'Monsieur' },
  contactDetails: [],
  addresses: [],
};

export default PreviewSupplierStep;