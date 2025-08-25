import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from "@mui/material";
import { acceptDevis } from "services/devisPurchaseService";
import { useSnackbar } from "notistack";
import PropTypes from 'prop-types';

const AcceptDevisDialog = ({ open, onClose, devis, onStatusChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptDevis(devis.id, {
        userId: 123, // Remplacer par l'ID de l'utilisateur connecté
        comment: comment
      });
      enqueueSnackbar("Devis accepté avec succès", { variant: "success" });
      onStatusChange(devis.id, 1);
      onClose();
    } catch (error) {
      enqueueSnackbar("Erreur lors de l'acceptation du devis", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Accepter le devis</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography>
            {'Vous êtes sur le point d\'accepter le devis <strong>{devis?.devisNumber}</strong>.'}
          </Typography>
          
          <TextField
            label="Commentaire (optionnel)"
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Annuler</Button>
        <Button 
          onClick={handleAccept} 
          color="success" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Traitement...' : 'Confirmer l\'acceptation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AcceptDevisDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  devis: PropTypes.shape({
    id: PropTypes.number.isRequired,
    devisNumber: PropTypes.string.isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default AcceptDevisDialog;