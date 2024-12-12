import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid } from "@mui/material";
import PropTypes from "prop-types"; // Importation de la validation des props
const ManageProfileDialog = ({ open, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState(userData);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle save action
  const handleSave = () => {
    onSave(formData); // Pass the updated data to the parent
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Name Field */}
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Mobile Field */}
          <Grid item xs={12}>
            <TextField
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Location Field */}
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
// Validation des props
ManageProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired, // La prop 'open' doit être un booléen et obligatoire
    onClose: PropTypes.func.isRequired, // La prop 'onClose' doit être une fonction et obligatoire
    userData: PropTypes.shape({
      name: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }).isRequired, // La prop 'userData' doit être un objet avec les propriétés nécessaires
    onSave: PropTypes.func.isRequired, // La prop 'onSave' doit être une fonction et obligatoire
  };
export default ManageProfileDialog;
