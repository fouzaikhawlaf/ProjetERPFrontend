// ../components/ConfirmAcceptDevisDialog.jsx
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
import { CheckCircle } from "@mui/icons-material";

const ConfirmAcceptDevisDialog = ({ open, loading, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
    >
      <DialogTitle>Confirmer l&apos;acceptation</DialogTitle>
      <DialogContent>
        <Typography>
          Êtes-vous sûr de vouloir <strong>accepter</strong> ce devis ?
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
          color="success"
          variant="contained"
          disabled={loading}
          startIcon={<CheckCircle />}
        >
          {loading ? "Traitement..." : "Confirmer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmAcceptDevisDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ConfirmAcceptDevisDialog.defaultProps = {
  loading: false,
};

export default ConfirmAcceptDevisDialog;
