// src/layouts/Sale/Data/SaleProcess.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Slide,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreateOrderDialog from './CreateOrderForm'; // Import your existing dialog component

// Transition component for the Dialog (Slide from bottom)
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SaleProcess = ({ onClose }) => {
  const [openDevis, setOpenDevis] = useState(false);
  const [devisCompleted, setDevisCompleted] = useState(false);
  const [commandeClientConfirmed, setCommandeClientConfirmed] = useState(false);
  const [bonDeLivraisonConfirmed, setBonDeLivraisonConfirmed] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);

  // Handlers for each dialog state
  const handleOpenDevis = () => setOpenDevis(true);
  const handleCloseDevis = () => setOpenDevis(false);
  const handleCompleteDevis = () => {
    setDevisCompleted(true);
    handleCloseDevis();
  };

  const handleConfirmCommandeClient = () => {
    setCommandeClientConfirmed(true);
  };

  const handleConfirmBonDeLivraison = () => {
    setBonDeLivraisonConfirmed(true);
  };

  const handleGenerateInvoice = () => {
    setOpenInvoice(true);
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
  };

  const handleConfirmInvoice = () => {
    console.log('Invoice Confirmed');
    handleCloseInvoice();
  };

  return (
    <div>
      {/* Step 1: Start with Devis */}
      {!devisCompleted ? (
        <Button variant="contained" color="primary" onClick={handleOpenDevis}>
          New Sale (Start with Devis)
        </Button>
      ) : null}

      <CreateOrderDialog
        open={openDevis}
        handleClose={handleCloseDevis}
        handleSubmit={handleCompleteDevis} // Pass submit handler
      />

      {/* Step 2: Commande Client */}
      {devisCompleted && !commandeClientConfirmed && (
        <Button variant="contained" color="secondary" onClick={handleConfirmCommandeClient}>
          Confirm Commande Client
        </Button>
      )}

      {/* Step 3: Bon de Livraison */}
      {commandeClientConfirmed && !bonDeLivraisonConfirmed && (
        <Button variant="contained" color="success" onClick={handleConfirmBonDeLivraison}>
          Create Bon de Livraison
        </Button>
      )}

      {/* Step 4: Generate Invoice */}
      {bonDeLivraisonConfirmed && (
        <Button variant="contained" startIcon={<ReceiptIcon />} onClick={handleGenerateInvoice}>
          Generate Invoice
        </Button>
      )}

      {/* Invoice Dialog with Slide Transition */}
      <Dialog
        open={openInvoice}
        TransitionComponent={Transition}  // Apply the Slide transition here
        keepMounted
        onClose={handleCloseInvoice}
        aria-labelledby="invoice-dialog-title"
      >
        <DialogTitle id="invoice-dialog-title">Invoice Preview</DialogTitle>
        <DialogContent>
          <Typography>Preview the invoice details here.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoice}>Cancel</Button>
          <Button onClick={handleConfirmInvoice} variant="contained">
            Confirm Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

SaleProcess.propTypes = {
  onClose: PropTypes.func.isRequired, // onClose prop to close the SaleProcess if passed from parent component
};

export default SaleProcess;
