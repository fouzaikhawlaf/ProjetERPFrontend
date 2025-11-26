// ../components/ConfirmRejectDevisDialog.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";

const ConfirmRejectDevisDialog = ({ open, loading, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
    >
      <DialogTitle>Confirmer le refus</DialogTitle>
      <DialogContent>
        <Typography>
          Êtes-vous sûr de vouloir <strong>refuser</strong> ce devis ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={<Cancel />}
        >
          {loading ? "Traitement..." : "Confirmer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmRejectDevisDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ConfirmRejectDevisDialog.defaultProps = {
  loading: false,
};

export default ConfirmRejectDevisDialog;
