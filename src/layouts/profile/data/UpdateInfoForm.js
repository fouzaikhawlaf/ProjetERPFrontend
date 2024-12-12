import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import PropTypes from 'prop-types';

// Composant pour les champs de formulaire
const FormField = ({ label, value, type = 'text', onChange }) => (
  <TextField
    autoFocus
    margin="dense"
    label={label}
    type={type}
    fullWidth
    variant="outlined"
    value={value}
    onChange={onChange}
  />
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const UpdateInfoForm = ({ userData, handleUpdateInfo, open, handleClose, handleChange }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Mettre à jour les informations</DialogTitle>
    <DialogContent>
      <FormField
        label="Nom"
        value={userData.name}
        onChange={handleChange}
        name="name"
      />
      <FormField
        label="Email"
        value={userData.email}
        type="email"
        onChange={handleChange}
        name="email"
      />
      <FormField
        label="Téléphone"
        value={userData.phone}
        onChange={handleChange}
        name="phone"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Annuler
      </Button>
      <Button onClick={handleUpdateInfo} color="primary">
        Enregistrer
      </Button>
    </DialogActions>
  </Dialog>
);

UpdateInfoForm.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  handleUpdateInfo: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default UpdateInfoForm;
