// src/components/StepperComponent.js
import React from 'react';
import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material';

// Example steps
const steps = ['Étape 1', 'Étape 2', 'Étape 3', 'Étape 4'];

const StepperComponent = ({ activeStep }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Étapes du Workflow
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperComponent;
