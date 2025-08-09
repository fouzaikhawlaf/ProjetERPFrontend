import React from 'react';
import { 
  Card, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button,
  Box
} from '@mui/material';
import PropTypes from 'prop-types';
import serviceIcon from 'images/service.png';
import ProductIcon from 'images/product.png';

const ProductTypeStep = ({ productType, setProductType, handleNext }) => {
  const handleTypeChange = (e) => {
    const selectedType = parseInt(e.target.value);
    setProductType(selectedType);
  };

  const handleContinue = () => {
    if (productType === null || productType === undefined) {
      alert('Veuillez sélectionner un type de produit');
      return;
    }
    handleNext();
  };

  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px', borderRadius: '12px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
        Type d&#39;élément
      </Typography>
      
      <RadioGroup
        row
        value={productType}
        onChange={handleTypeChange}
        style={{ 
          justifyContent: 'center', 
          marginTop: '20px', 
          gap: '20px',
          flexWrap: 'wrap'
        }}
      >
        {/* Option Produit Physique */}
        <FormControlLabel
          value={0}
          control={<Radio color="primary" style={{ display: 'none' }} />}
          label={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              padding="20px"
              border={productType === 0 ? '2px solid #2196f3' : '1px solid #e0e0e0'}
              borderRadius="8px"
              width="200px"
              textAlign="center"
              bgcolor={productType === 0 ? '#e3f2fd' : 'transparent'}
              sx={{
                transition: 'all 0.3s',
                '&:hover': { 
                  transform: 'scale(1.05)', 
                  boxShadow: 3,
                  cursor: 'pointer'
                }
              }}
            >
              <img 
                src={ProductIcon} 
                alt="product icon"
                style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
              />
              <Typography variant="subtitle1" mt={1}>Produit Physique</Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Articles tangibles avec stock
              </Typography>
            </Box>
          }
        />
        
        {/* Option Service */}
        <FormControlLabel
          value={1}
          control={<Radio color="primary" style={{ display: 'none' }} />}
          label={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              padding="20px"
              border={productType === 1 ? '2px solid #2196f3' : '1px solid #e0e0e0'}
              borderRadius="8px"
              width="200px"
              textAlign="center"
              bgcolor={productType === 1 ? '#e3f2fd' : 'transparent'}
              sx={{
                transition: 'all 0.3s',
                '&:hover': { 
                  transform: 'scale(1.05)', 
                  boxShadow: 3,
                  cursor: 'pointer'
                }
              }}
            >
              <img 
                src={serviceIcon} 
                alt="service icon"
                style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
              />
              <Typography variant="subtitle1" mt={1}>Service</Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Prestations sans stock physique
              </Typography>
            </Box>
          }
        />
      </RadioGroup>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleContinue}
          disabled={productType === null}
          style={{ 
            padding: '10px 30px', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          Continuer
        </Button>
      </Box>
    </Card>
  );
};

ProductTypeStep.propTypes = {
  productType: PropTypes.number,
  setProductType: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

ProductTypeStep.defaultProps = {
  productType: null,
};

export default ProductTypeStep;