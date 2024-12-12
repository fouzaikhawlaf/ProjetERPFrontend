// src/components/SelectModuleDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
const SelectModuleDialog = ({ open, onClose, onSelect }) => {
  const [selectedModule, setSelectedModule] = React.useState('');

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  const handleSelect = () => {
    onSelect(selectedModule);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Workflow</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id="module-select-label">Sélectionnez un Module</InputLabel>
          <Select
            labelId="module-select-label"
            value={selectedModule}
            onChange={handleModuleChange}
          >
            <MenuItem value="Client">Client</MenuItem>
            <MenuItem value="Fournisseur">Fournisseur</MenuItem>
            <MenuItem value="Achat">Achat</MenuItem>
            <MenuItem value="Vente">Vente</MenuItem>
            <MenuItem value="Projet">Projet</MenuItem>
            {/* Add more modules if needed */}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSelect} color="primary" variant="contained">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
SelectModuleDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };


export default SelectModuleDialog;
