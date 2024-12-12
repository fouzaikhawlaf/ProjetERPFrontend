import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
const HeaderSection = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const HeaderActions = styled('div')({
  display: 'flex',
  gap: '10px', // Space between buttons
});


  


const PageHeaderFacture = () => {
    const navigate = useNavigate(); 
  
    const handleAddClientClick = () => {
      navigate('/AddsSortie'); 
    };




    const [showAddForm, setShowAddForm] = useState(false);

    const handleChange = (event) => {
      setInvoiceData({
        ...invoiceData,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleCreateClick = () => {
      setShowAddForm(true);
    };
  
  return (
    <HeaderSection>
      <div>
        <Typography variant="h4" gutterBottom>
        Facture
        </Typography>
        <Typography variant="body2" color="textSecondary">
        
        </Typography>
      </div>
      <HeaderActions>
        <Button variant="contained" color="primary">
          Exporter
        </Button>
        
        <Button variant="contained" color="success" onClick={handleAddClientClick}>
          Ajouter Bon de Sortie
         
        </Button>
      </HeaderActions>
    </HeaderSection>
  );
};

export default PageHeaderFacture;