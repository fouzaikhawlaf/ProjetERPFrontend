import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const DeleteClientDialog = ({
  open,
  onClose,
  clientToDelete,
  deletingId,
  onDelete
}) => {
  const handleDeleteWithToast = async () => {
    try {
      // Appeler la fonction de suppression du parent
      await onDelete();
      
      // Fermer la boîte de dialogue après la suppression
      onClose();
    } catch (error) {
      // La notification d'erreur est déjà gérée dans le parent
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">
        Confirmer la suppression
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer le client &quot;{clientToDelete?.name}&quot; ? 
          Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button 
          onClick={handleDeleteWithToast} 
          color="error"
          variant="contained"
          disabled={deletingId === clientToDelete?.clientID}
          startIcon={
            deletingId === clientToDelete?.clientID ? 
            <CircularProgress size={20} /> : 
            <Delete />
          }
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clientToDelete: PropTypes.shape({
    clientID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string
  }),
  deletingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onDelete: PropTypes.func.isRequired
};

DeleteClientDialog.defaultProps = {
  clientToDelete: null,
  deletingId: null
};

export default DeleteClientDialog;