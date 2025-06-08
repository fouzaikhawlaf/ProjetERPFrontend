import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createSupplier } from 'services/supplierApi'; // Import the createSupplier function

const PreviewSupplierStep = ({ supplierInfo, handlePrev }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Prepare data for the API
      const supplierData = {
        name: supplierInfo.name,
        code: supplierInfo.code,
        contactPerson: supplierInfo.contactPerson,
        email: supplierInfo.email,
        phone: supplierInfo.phone,
        website: supplierInfo.website,
        addresses: supplierInfo.addresses, // Include the addresses array
      };

      // Call the API to create the supplier
      await createSupplier(supplierData);

      // Show success message
      toast.success('Fournisseur créé avec succès !');

      // Redirect to the supplier list table
      navigate('/suppliers'); // Update this path to match your route for the supplier list
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast.error('Erreur lors de la création du fournisseur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Aperçu du fournisseur
      </Typography>

      {/* Supplier Information */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Nom de l&apos;entreprise:</strong> {supplierInfo.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              <strong>Code:</strong> {supplierInfo.code}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              <strong>Personne de contact:</strong> {supplierInfo.contactPerson}
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Email:</strong> {supplierInfo.email}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              <strong>Téléphone:</strong> {supplierInfo.phone}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              <strong>Site web:</strong> {supplierInfo.website}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Addresses Section */}
      <Card elevation={1} style={{ padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
          Adresses
        </Typography>
        {supplierInfo.addresses.map((address, index) => (
          <Box key={index} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
              Adresse {index + 1}:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Adresse ligne 1:</strong> {address.addressLine1}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Adresse ligne 2:</strong> {address.addressLine2}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Pays:</strong> {address.country}
                </Typography>
              </Grid>
            </Grid>
            {index < supplierInfo.addresses.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
          </Box>
        ))}
      </Card>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" marginTop="30px">
        <Button
          onClick={handlePrev}
          variant="outlined"
          style={{ borderRadius: '8px', textTransform: 'none', padding: '10px 20px' }}
        >
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ borderRadius: '8px', textTransform: 'none', padding: '10px 20px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Soumettre'}
        </Button>
      </Box>
    </Card>
  );
};

PreviewSupplierStep.propTypes = {
  supplierInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    contactPerson: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    website: PropTypes.string,
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        country: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  handlePrev: PropTypes.func.isRequired,
};

export default PreviewSupplierStep;