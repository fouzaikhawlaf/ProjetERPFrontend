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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Clear, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { deleteOrder } from "services/orderClientService"; // ✅ Changé

const DeleteCommandeClientDialog = ({
  open,
  onClose,
  commande,
  onDelete,
  redirectOnSuccess,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!commande) return;
    try {
      setLoading(true);
      await deleteOrder(commande.id);
      enqueueSnackbar("Commande client supprimée avec succès", {
        variant: "success",
      });
      onDelete && onDelete(commande.id);
      onClose();
      // redirectOnSuccess si tu veux gérer une redirection ailleurs
    } catch (e) {
      console.error("Erreur suppression commande client :", e);
      enqueueSnackbar("Erreur lors de la suppression de la commande", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!commande) return null;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Supprimer la commande client</Typography>
        <IconButton onClick={onClose} disabled={loading}>
          <Clear />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography>
            Êtes-vous sûr de vouloir{" "}
            <strong>supprimer définitivement</strong> cette commande client ?
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Commande :</strong>{" "}
            {commande.orderNumber || commande.OrderNumber || commande.id}
          </Typography>
          <Typography sx={{ mt: 0.5 }}>
            <strong>Client :</strong>{" "}
            {commande.clientName ||
              commande.customerName ||
              commande.clientId ||
              "N/A"}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          startIcon={<Delete />}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Supprimer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteCommandeClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.object,
  onDelete: PropTypes.func,
  redirectOnSuccess: PropTypes.bool,
};

DeleteCommandeClientDialog.defaultProps = {
  redirectOnSuccess: false,
};

export default DeleteCommandeClientDialog;
