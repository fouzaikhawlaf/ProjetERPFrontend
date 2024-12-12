import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types'; // Importer PropTypes
const WorkflowConfigurator = ({ open, onClose }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [steps, setSteps] = useState(['']);

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleChangeStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSave = () => {
    // Handle saving logic
    console.log('Workflow Name:', workflowName);
    console.log('Steps:', steps);
    onClose();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configurer un Workflow
      </Typography>
      <TextField
        label="Nom du Workflow"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        fullWidth
        margin="normal"
      />
      {steps.map((step, index) => (
        <TextField
          key={index}
          label={`Étape ${index + 1}`}
          value={step}
          onChange={(e) => handleChangeStep(index, e.target.value)}
          fullWidth
          margin="normal"
        />
      ))}
      <Button variant="contained" color="primary" onClick={handleAddStep}>
        Ajouter une Étape
      </Button>
      <Button variant="contained" color="secondary" onClick={handleSave}>
        Enregistrer
      </Button>
    </Box>
  );
};
// Définir les types de props
WorkflowConfigurator.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
export default WorkflowConfigurator;
