import React from 'react';
import { Card, Typography, RadioGroup, FormControlLabel, Radio, Box, Button } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import userIcon from 'images/user.png';
import businessIcon from 'images/business.png';


function SupplierType({ supplierType, handleSupplierTypeChange, handleNext }) {
  return (
    <DashboardLayout>
      <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Type de fournisseur
        </Typography>
        <RadioGroup
          row
          value={supplierType}
          onChange={(e) => handleSupplierTypeChange(e.target.value)}
          style={{ justifyContent: 'center', marginTop: '20px' }}
        >
          {/* Individuel Option */}
          <FormControlLabel
            value="Individuel" // String value for Individuel
            control={<Radio color="primary" />}
            label={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                padding="20px"
                border={supplierType === 'Individuel' ? '2px solid #2196f3' : '1px solid #e0e0e0'}
                borderRadius="8px"
                width="200px"
                textAlign="center"
              >
                <img
                  src={userIcon}
                  alt="Individuel icon"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                />
                <Typography>Individuel</Typography>
              </Box>
            }
          />

          {/* Professionnel Option */}
          <FormControlLabel
            value="Professionnel" // String value for Professionnel
            control={<Radio color="primary" />}
            label={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                padding="20px"
                border={supplierType === 'Professionnel' ? '2px solid #2196f3' : '1px solid #e0e0e0'}
                borderRadius="8px"
                width="200px"
                textAlign="center"
              >
                <img
                  src={businessIcon}
                  alt="Professionnel icon"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                />
                <Typography>Professionnel</Typography>
              </Box>
            }
          />
        </RadioGroup>

        {/* Continue Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!supplierType} // Disable if no type is selected
          style={{ marginTop: '30px' }}
        >
          Continuer
        </Button>
      </Card>
    </DashboardLayout>
  );
}

// Prop Types Validation
SupplierType.propTypes = {
  supplierType: PropTypes.string, // String value for supplierType
  handleSupplierTypeChange: PropTypes.func.isRequired, // Function to handle type change
  handleNext: PropTypes.func.isRequired, // Function to proceed to the next step
};

export default SupplierType;