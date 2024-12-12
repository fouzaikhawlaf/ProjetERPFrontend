import React from 'react';
import { Card, Typography, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import serviceIcon from 'images/service.png';
import ProductIcon from 'images/product.png';
const ProductTypeStep = ({ productType, setProductType, handleNext }) => {
  return (
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
    <Typography variant="h6" gutterBottom>
      Type de produit
    </Typography>
    <RadioGroup
      row
      value={productType}
      onChange={(e) => setProductType(e.target.value)}
      style={{ justifyContent: 'center', marginTop: '20px' }}
    >
      <FormControlLabel
        value="Matériel"
        control={<Radio color="primary" />}
        label={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            padding="20px"
            border={
              productType === 'Matériel'
                ? '2px solid #2196f3'
                : '1px solid #e0e0e0'
            }
            borderRadius="8px"
            width="200px"
            textAlign="center"
          >
             <img src={ProductIcon} alt="product icon"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <Typography>Matériel</Typography>
          </Box>
        }
      />
      <FormControlLabel
        value="Service"
        control={<Radio color="primary" />}
        label={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            padding="20px"
            border={
              productType === 'Service'
                ? '2px solid #2196f3'
                : '1px solid #e0e0e0'
            }
            borderRadius="8px"
            width="200px"
            textAlign="center"
          >
            <img src={serviceIcon} alt="service icon"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <Typography>Service</Typography>
          </Box>
        }
      />
    </RadioGroup>

    <Button
      variant="contained"
      color="primary"
      onClick={handleNext}
      disabled={!productType}
      style={{ marginTop: '30px' }}
    >
      Continuer
    </Button>
  </Card>
  );
};
ProductTypeStep.propTypes = {
  productType: PropTypes.string.isRequired,
  setProductType: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};
export default ProductTypeStep;