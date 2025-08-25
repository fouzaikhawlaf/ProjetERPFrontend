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

const RejectDevisDialog = ({ open, onClose, devis, onStatusChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      // Appelle une fonction pour rejeter le devis (exemple)
      await onStatusChange(devis.id, 2, comment);
      enqueueSnackbar('Le devis a été rejeté avec succès.', { variant: 'success' });
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