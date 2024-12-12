import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes

const LeaveRequestDialog = ({ open, handleClose, handleLeaveRequest }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Demande de congé</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="startDate"
          label="Date de début"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          id="endDate"
          label="Date de fin"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleLeaveRequest} color="primary">
          Soumettre la demande
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Ajouter la validation des props
LeaveRequestDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Valider que open est un booléen et qu'il est requis
  handleClose: PropTypes.func.isRequired, // Valider que handleClose est une fonction et qu'elle est requise
  handleLeaveRequest: PropTypes.func.isRequired, // Valider que handleLeaveRequest est une fonction et qu'elle est requise
};

export default LeaveRequestDialog;
