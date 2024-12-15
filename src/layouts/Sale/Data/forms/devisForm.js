import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Paper, IconButton, Grid, Divider, Typography, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SubtotalIcon from '@mui/icons-material/Functions';
import ApproveIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/system';

const Input = styled('input')({
  display: 'none',
});

const DevisForm = ({ open, handleClose }) => {
  const [client, setClient] = useState('');
  const [document, setDocument] = useState('');
  const [project, setProject] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([
    { designation: '', quantity: 0, priceHT: 0.00, vat: 0.00, totalHT: 0.00 },
  ]);
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { designation: '', quantity: 0, priceHT: 0.00, vat: 0.00, totalHT: 0.00 }]);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].totalHT = newItems[index].quantity * newItems[index].priceHT;
    setItems(newItems);
  };

  const calculateTotalHT = () => {
    return items.reduce((total, item) => total + item.totalHT, 0).toFixed(2);
  };

  const calculateTotalVAT = () => {
    return items.reduce((total, item) => total + (item.totalHT * (item.vat / 100)), 0).toFixed(2);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    console.log({ client, document, project, note, items, image });
    handleClose();
  };

  const handleApproveClick = () => {
    setShowConfirmOverlay(true);
  };

  const handleConfirmApprove = () => {
    console.log("Order approved");
    setShowConfirmOverlay(false);
    handleSubmit();
  };

  const handleCancelApprove = () => {
    setShowConfirmOverlay(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>Nouvelle commande</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Client"
              fullWidth
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Document"
              fullWidth
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Projet"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Note"
              multiline
              rows={3}
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item>
            <label htmlFor="icon-button-file">
              <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageChange} />
              <Tooltip title="Ajouter une image">
                <IconButton color="primary" component="span">
                  <PhotoCameraIcon />
                </IconButton>
              </Tooltip>
            </label>
          </Grid>
          <Grid item>
            <Button startIcon={<SubtotalIcon />} variant="contained">
              Ajouter un sous-total
            </Button>
          </Grid>
          <Grid item>
            <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="contained">
              Ajouter un article
            </Button>
          </Grid>
        </Grid>

        {image && (
          <Paper elevation={3}>
            <img src={image} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
          </Paper>
        )}

        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Prix HT</th>
              <th>TVA</th>
              <th>Total HT</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <TextField
                    value={item.designation}
                    onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                    fullWidth
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                    fullWidth
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.priceHT}
                    onChange={(e) => handleItemChange(index, 'priceHT', parseFloat(e.target.value))}
                    fullWidth
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.vat}
                    onChange={(e) => handleItemChange(index, 'vat', parseFloat(e.target.value))}
                    fullWidth
                  />
                </td>
                <td>{item.totalHT.toFixed(2)} TND</td>
                <td>
                  <IconButton onClick={() => handleDeleteItem(index)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Divider />
        <Typography variant="h6">Résumé</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Total HT: {calculateTotalHT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total TVA: {calculateTotalVAT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total TTC: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(2)} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Timbre fiscal: 1.000 TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Net à payer: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT()) + 1).toFixed(2)} TND</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Annuler</Button>
        <Button 
          startIcon={<ApproveIcon />}
          onClick={handleApproveClick} 
          color="primary" 
          variant="contained">
          Approuver
        </Button>
      </DialogActions>

      {showConfirmOverlay && (
        <Dialog open={showConfirmOverlay}>
          <DialogTitle>{`Confirmer l'approbation`}</DialogTitle>
          <DialogContent>
          <Typography>{`Êtes-vous sûr de vouloir approuver cette commande ?`}</Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelApprove} color="secondary">Annuler</Button>
            <Button onClick={handleConfirmApprove} color="primary" variant="contained">Confirmer</Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

DevisForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DevisForm;
