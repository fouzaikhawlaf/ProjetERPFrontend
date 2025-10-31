import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import orderSupplierService from "services/orderSupplierService";

const DeleteCommandeDialog = ({
  open,
  onClose,
  commande,
  onDelete,
  redirectOnSuccess = false,
  redirectTo = "/commandes-fournisseur", // tu peux changer ici
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    if (!commande?.id) return;
    setLoading(true);
    try {
      // appel API suppression
      await orderSupplierService.deleteOrder(commande.id);

      // on affiche la modal de succès
      setShowSuccess(true);

      // on laisse 3s puis on ferme + callback + éventuelle redirection
      setTimeout(() => {
        onDelete && onDelete(commande.id);
        onClose();
        setShowSuccess(false);

        if (redirectOnSuccess) {
          navigate(redirectTo);
        }
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande :", error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          "Erreur lors de la suppression de la commande",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 4000,
        }
      );
      setLoading(false);
    }
  };

  // état de succès
  if (showSuccess) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h4"
            sx={{ mb: 2, color: "success.main", fontWeight: 600 }}
          >
            ✅ Commande supprimée avec succès !
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            {redirectOnSuccess
              ? "Vous serez redirigé vers la liste des commandes."
              : "La liste sera actualisée automatiquement."}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => {
                onClose();
                setShowSuccess(false);
                if (redirectOnSuccess) {
                  navigate(redirectTo);
                }
              }}
              variant="contained"
              color="primary"
            >
              {redirectOnSuccess ? "Redirection maintenant" : "Fermer"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // modal de confirmation
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#fff3e0",
          borderBottom: "1px solid #ffcc80",
          fontWeight: "bold",
        }}
      >
        Confirmer la suppression
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Êtes-vous sûr de vouloir supprimer la commande{" "}
            <strong>{commande?.orderNumber || `#${commande?.id}`}</strong> ?
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontStyle: "italic" }}
        >
          ⚠️ Cette action est irréversible et supprimera définitivement la
          commande ainsi que ses lignes associées.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid #e0e0e0",
          justifyContent: "space-between",
        }}
      >
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
          {loading ? "Suppression en cours..." : "Confirmer la suppression"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteCommandeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderNumber: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
  redirectOnSuccess: PropTypes.bool,
  redirectTo: PropTypes.string,
};

DeleteCommandeDialog.defaultProps = {
  commande: null,
  redirectOnSuccess: false,
  redirectTo: "/commandes-fournisseur",
};

export default DeleteCommandeDialog;
