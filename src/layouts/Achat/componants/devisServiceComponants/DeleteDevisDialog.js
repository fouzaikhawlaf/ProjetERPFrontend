import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";
import { useSnackbar } from "notistack";
import PropTypes from 'prop-types';

const DeleteDevisDialog = ({ open, onClose, devis, onDelete }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Ici, vous devrez implémenter la fonction de suppression dans votre service
      // await deleteDevis(devis.id);
      enqueueSnackbar("Devis supprimé avec succès", { variant: "success" });
      onDelete(devis.id);
      onClose();
    } catch (error) {
      enqueueSnackbar("Erreur lors de la suppression du devis", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le devis <strong>{devis?.devisNumber}</strong> ?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Cette action est irréversible.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Annuler</Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Suppression...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteDevisDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  devis: PropTypes.shape({
    id: PropTypes.number.isRequired,
    devisNumber: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteDevisDialog;