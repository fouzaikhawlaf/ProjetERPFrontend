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
import { ReceiptLong } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { confirmOrder } from "services/orderClientService";

const ConfirmInvoiceCommandeClientDialog = ({
  open,
  onClose,
  commande,
  onInvoice,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!commande) return;

    try {
      setLoading(true);

      // PATCH /api/OrderClient/{id}/confirm
      await confirmOrder(commande.id);

      enqueueSnackbar("Commande client confirmée / facturée avec succès", {
        variant: "success",
      });

      // on prévient le parent pour qu'il mette le statut à INVOICED (3)
      onInvoice && onInvoice(commande.id);

      onClose();
    } catch (e) {
      console.error("Erreur facturation commande client :", e);
      enqueueSnackbar("Erreur lors de la facturation de la commande", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open && Boolean(commande)}
      onClose={loading ? undefined : onClose}
    >
      <DialogTitle>Facturer la commande client</DialogTitle>
      <DialogContent>
        <Typography>
          Êtes-vous sûr de vouloir <strong>facturer</strong> cette commande ?
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Commande :</strong>{" "}
          {commande?.orderNumber || commande?.OrderNumber || commande?.id}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          color="success"
          variant="contained"
          startIcon={<ReceiptLong />}
          disabled={loading || !commande}
        >
          {loading ? <CircularProgress size={20} /> : "Facturer / Confirmer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmInvoiceCommandeClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.object,
  onInvoice: PropTypes.func, // (id) => void
};

export default ConfirmInvoiceCommandeClientDialog;
