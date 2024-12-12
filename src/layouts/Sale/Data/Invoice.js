import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Divider } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Invoice = () => {
  const [openInvoice, setOpenInvoice] = useState(false);

  // Example data for the invoice
  const client = {
    name: 'John Doe',
    address: '123 Main St, Anytown, USA',
  };

  const order = {
    id: 'ORD-12345',
  };

  const deliveryNote = {
    id: 'DEL-67890',
  };

  const items = [
    { id: 1, name: 'Product A', quantity: 2, price: 50, total: 100 },
    { id: 2, name: 'Product B', quantity: 1, price: 100, total: 100 },
  ];

  const totalAmount = items.reduce((total, item) => total + item.total, 0);

  // Function to handle opening and closing the invoice dialog
  const handleGenerateInvoice = () => {
    setOpenInvoice(true);
  };

  const handleClose = () => {
    setOpenInvoice(false);
  };

  const handleConfirmInvoice = () => {
    // Logic to confirm and send the invoice
    console.log('Invoice confirmed');
    setOpenInvoice(false);
  };

  return (
    <div>
      <Button variant="contained" startIcon={<ReceiptIcon />} onClick={handleGenerateInvoice}>
        Generate Invoice
      </Button>

      <Dialog open={openInvoice} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent>
          {/* Preview of the Invoice Data */}
          <Typography variant="h6">Invoice: #INV-0001</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Client Details</Typography>
              <Typography>Client Name: {client.name}</Typography>
              <Typography>Address: {client.address}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Order Details</Typography>
              <Typography>Order Number: {order.id}</Typography>
              <Typography>Delivery Note: {deliveryNote.id}</Typography>
            </Grid>
          </Grid>

          <Divider style={{ marginTop: '20px' }} />
          {/* Order Items */}
          <table style={{ width: '100%', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Divider style={{ marginTop: '20px' }} />
          <Typography variant="h6" align="right">
            Total: {totalAmount} TND
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmInvoice} variant="contained" color="primary">
            Confirm Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Invoice;
