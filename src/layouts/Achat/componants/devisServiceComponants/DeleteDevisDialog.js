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
import { deleteDevisPurchase } from "services/devisPurchaseService";
import { useNavigate } from "react-router-dom"; // Import de useNavigate pour la redirection

const DeleteDevisDialog = ({ open, onClose, devis, onDelete, redirectOnSuccess = false }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate(); // Hook pour la navigation
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // État pour afficher la notification de succès

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Appel à l'API de suppression
      await deleteDevisPurchase(devis.id);
      
      // Afficher la notification de succès dans la modal
      setShowSuccess(true);
      
      // Attendre 3 secondes avant de fermer et éventuellement rediriger
      setTimeout(() => {
        onDelete(devis.id);
        onClose();
        setShowSuccess(false);
        
        // Redirection si demandée
        if (redirectOnSuccess) {
          navigate('/devis'); // Remplacez par votre route de liste des devis
        }
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Erreur lors de la suppression du devis", 
        { 
          variant: "error",
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          autoHideDuration: 4000
        }
      );
      setLoading(false);
    }
  };

  // Si on affiche le message de succès
  if (showSuccess) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography id="success-modal-title" variant="h4" component="h2" sx={{ mb: 2, color: 'success.main' }}>
            ✅ Devis supprimé avec succès!
          </Typography>
          <Typography id="success-modal-description" variant="h6" sx={{ mb: 4 }}>
            {redirectOnSuccess 
              ? "Vous serez redirigé vers la page des devis dans quelques secondes." 
              : "La liste sera actualisée automatiquement."
            }
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              onClick={() => {
                onClose();
                setShowSuccess(false);
                if (redirectOnSuccess) {
                  navigate('/devis');
                }
              }}
              variant="contained"
              color="primary"
            >
              {redirectOnSuccess ? "Redirection immédiate" : "Fermer"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Modal de confirmation de suppression normale
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        backgroundColor: '#fff3e0', 
        borderBottom: '1px solid #ffcc80',
        fontWeight: 'bold'
      }}>
        Confirmer la suppression
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            Êtes-vous sûr de vouloir supprimer le devis <strong>{devis?.devisNumber}</strong> ?
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          ⚠️ Cette action est irréversible et supprimera définitivement le devis ainsi que tous ses articles associés.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        justifyContent: 'space-between'
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 1 }}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: 1 }}
        >
          {loading ? 'Suppression en cours...' : 'Confirmer la suppression'}
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
  }),
  onDelete: PropTypes.func.isRequired,
  redirectOnSuccess: PropTypes.bool, // Nouvelle prop pour contrôler la redirection
};

DeleteDevisDialog.defaultProps = {
  devis: null,
  redirectOnSuccess: false,
};

export default DeleteDevisDialog;