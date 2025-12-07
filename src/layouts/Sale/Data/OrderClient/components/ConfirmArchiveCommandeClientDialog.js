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
import { Archive } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { archiveOrder } from "services/OrderClientService";

const ConfirmArchiveCommandeClientDialog = ({
  open,
  onClose,
  commande,
  onArchive,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!commande) return;
    try {
      setLoading(true);
      await archiveOrder(commande.id);
      enqueueSnackbar("Commande client archivée avec succès", {
        variant: "success",
      });
      onArchive && onArchive(commande.id);
      onClose();
    } catch (e) {
      console.error("Erreur archivage commande client :", e);
      enqueueSnackbar("Erreur lors de l'archivage de la commande", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!commande) return null;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>Archiver la commande client</DialogTitle>
      <DialogContent>
        <Typography>
          Êtes-vous sûr de vouloir <strong>archiver</strong> cette commande ?
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Commande :</strong>{" "}
          {commande.orderNumber || commande.OrderNumber || commande.id}
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
          startIcon={<Archive />}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Archiver"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmArchiveCommandeClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.object,
  onArchive: PropTypes.func,
};

export default ConfirmArchiveCommandeClientDialog;
