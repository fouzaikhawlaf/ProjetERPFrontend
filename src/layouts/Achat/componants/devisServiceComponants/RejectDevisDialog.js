import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { rejectDevis } from 'services/devisPurchaseService'; // Importez votre service

const RejectDevisDialog = ({ open, onClose, devis, onStatusChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      // Appel direct à l'API via le service
      await rejectDevis(devis.id, comment);
      enqueueSnackbar('Le devis a été rejeté avec succès.', { variant: 'success' });
      onStatusChange(devis.id, 2); // Met à jour le statut local
      onClose();
    } catch (error) {
      enqueueSnackbar('Erreur lors du rejet du devis.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rejeter le devis</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography>
            Vous êtes sur le point de rejeter le devis <strong>{devis?.devisNumber}</strong>.
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
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleReject}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Traitement...' : 'Confirmer le rejet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RejectDevisDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  devis: PropTypes.shape({
    id: PropTypes.number.isRequired,
    devisNumber: PropTypes.string.isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default RejectDevisDialog;