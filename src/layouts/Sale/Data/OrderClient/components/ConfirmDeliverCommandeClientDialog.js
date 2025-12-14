import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { updateOrder } from "services/orderClientService";

const ORDER_STATUS = {
  DELIVERED: 2,
};

const ConfirmDeliverCommandeClientDialog = ({
  open,
  onClose,
  commande,
  onDeliver,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    // Sécurité : si pas de commande, on ne fait rien
    if (!commande) return;

    try {
      setLoading(true);

      const payload = {
        ...commande,
        status: ORDER_STATUS.DELIVERED,
        // deliveryDate: new Date().toISOString(), // si tu veux ajouter la date de livraison
      };

      await updateOrder(commande.id, payload);

      enqueueSnackbar("Commande client marquée comme livrée", {
        variant: "success",
      });

      if (onDeliver) {
        onDeliver(commande.id, payload);
      }

      onClose();
    } catch (e) {
      console.error("Erreur livraison commande client :", e);
      enqueueSnackbar("Erreur lors de la livraison de la commande", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasCommande = Boolean(commande);
  const orderLabel = hasCommande
    ? commande.orderNumber || commande.OrderNumber || commande.id
    : "—";

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>Livrer la commande client</DialogTitle>
      <DialogContent>
        <Typography>
          {hasCommande ? (
            <>
              Êtes-vous sûr de vouloir marquer cette commande comme{" "}
              <strong>livrée</strong> ?
            </>
          ) : (
            "Aucune commande sélectionnée."
          )}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Commande :</strong> {orderLabel}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          startIcon={<LocalShipping />}
          disabled={loading || !hasCommande}
        >
          {loading ? <CircularProgress size={20} /> : "Livrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDeliverCommandeClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.object, // peut être null
  onDeliver: PropTypes.func,  // callback optionnel
};

export default ConfirmDeliverCommandeClientDialog;
