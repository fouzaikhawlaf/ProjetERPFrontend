import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const DeleteConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message,
  loading 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Warning color="error" sx={{ mr: 1 }} />
        {title}
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <Typography variant="body1">{message}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  loading: PropTypes.bool
};

DeleteConfirmationModal.defaultProps = {
  title: "Confirmer la suppression",
  message: "Êtes-vous sûr de vouloir supprimer cet élément ?",
  loading: false
};

export default DeleteConfirmationModal;