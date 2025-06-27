import React from 'react';
import { Card, Typography, RadioGroup, FormControlLabel, Radio, Box, Button } from '@mui/material';
import PropTypes from 'prop-types'; // Import de PropTypes
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import userIcon from 'images/user.png';
import businessIcon from 'images/business.png';

import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';

function ClientType({  formData, updateField, handleNext }) 
  {
  const handleClientTypeChange = (type) => {
    updateField('clientType', type);
  };
 

  return (
    <DashboardLayout>
    <Card elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Type de client
      </Typography>
      <RadioGroup
        row
        value={formData.clientType}
        onChange={(e) => handleClientTypeChange(e.target.value)}
        style={{ justifyContent: 'center', marginTop: '20px' }}
      >
        <FormControlLabel
          value="Individuel"
          control={<Radio color="primary" />}
          label={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              padding="20px"
              border={formData.clientType === 'Individuel' ? '2px solid #2196f3' : '1px solid #e0e0e0'}
              borderRadius="8px"
              width="200px"
              textAlign="center"
            >
              <img src={userIcon} alt="user icon"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
              <Typography>Individuel</Typography>
            </Box>
          }
        />
        <FormControlLabel
          value="Professionnel"
          control={<Radio color="primary" />}
          label={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              padding="20px"
              border={formData.clientType=== 'Professionnel' ? '2px solid #2196f3' : '1px solid #e0e0e0'}
              borderRadius="8px"
              width="200px"
              textAlign="center"
            >
              <img src={businessIcon} alt="business icon"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
              <Typography>Professionnel</Typography>
            </Box>
          }
        />
      </RadioGroup>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        disabled={!formData.clientType}
        style={{ marginTop: '30px' }}
      >
        Continuer
      </Button>
    </Card>
    </DashboardLayout>
  );
}
ClientType.propTypes = {
  formData: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired, // <-- Ajoute cette ligne
  handleNext: PropTypes.func, // si utilisé
};
export default ClientType;
