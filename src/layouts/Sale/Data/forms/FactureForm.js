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

const FactureForm = ({ open, handleClose }) => {
  const [client, setClient] = useState('');
  const [document, setDocument] = useState('');
  const [project, setProject] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null); // Image upload state
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
      <DialogTitle style={styles.dialogTitle}>Nouvelle commande</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          {/* Client and Document Info */}
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Client"
              type="text"
              fullWidth
              value={client}
              onChange={(e) => setClient(e.target.value)}
              variant="outlined"
              style={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Document"
              type="text"
              fullWidth
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              variant="outlined"
              style={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Projet"
              type="text"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
              variant="outlined"
              style={styles.inputField}
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
              variant="outlined"
              style={styles.inputField}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
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
            <Button
              startIcon={<SubtotalIcon />}
              variant="contained"
              style={styles.actionButton}
            >
              Ajouter un sous-total
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              variant="contained"
              style={styles.actionButton}
            >
              Ajouter un article
            </Button>
          </Grid>
        </Grid>

        {/* Uploaded Image Preview */}
        {image && (
          <Paper elevation={3} style={styles.imagePreview}>
            <img src={image} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
          </Paper>
        )}

        {/* Refactored Table */}
        <div style={{ ...styles.tableContainer, overflowX: 'hidden' }}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={{ width: '20%' }} align="left">Désignation</th>
                <th style={{ width: '15%' }} align="left">Quantité</th>
                <th style={{ width: '15%' }} align="left">Prix HT</th>
                <th style={{ width: '15%' }} align="left">TVA</th>
                <th style={{ width: '20%' }} align="left">Total HT</th>
                <th style={{ width: '15%' }} align="left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: '20%' }}>
                    <TextField
                      value={item.designation}
                      onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td style={{ width: '15%' }}>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td style={{ width: '15%' }}>
                    <TextField
                      type="number"
                      value={item.priceHT}
                      onChange={(e) => handleItemChange(index, 'priceHT', parseFloat(e.target.value))}
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td style={{ width: '15%' }}>
                    <TextField
                      type="number"
                      value={item.vat}
                      onChange={(e) => handleItemChange(index, 'vat', parseFloat(e.target.value))}
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td style={{ width: '20%' }}>
                    <Typography variant="body2">
                      {item.totalHT.toFixed(2)} TND
                    </Typography>
                  </td>
                  <td style={{ width: '15%' }}>
                    <IconButton onClick={() => handleDeleteItem(index)} style={styles.deleteIcon}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Divider style={{ marginTop: '20px' }} />
        <Typography variant="h6" style={{ marginTop: '10px' }}>Résumé</Typography>
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
        <Button onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button
          onClick={handleApproveClick}
          color="primary"
          variant="contained"
          startIcon={<ApproveIcon />}
        >
          Approuver
        </Button>
      </DialogActions>

      {/* Confirmation Overlay */}
      {showConfirmOverlay && (
        <Dialog open={showConfirmOverlay} onClose={() => setShowConfirmOverlay(false)}>
          <DialogTitle>Confirmer approbation</DialogTitle>
          <DialogContent>
            <Typography>Êtes-vous sûr de vouloir approuver cette commande ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelApprove} color="primary">
              Annuler
            </Button>
            <Button onClick={handleConfirmApprove} color="primary" variant="contained">
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

FactureForm.propTypes = {
    open: PropTypes.bool.isRequired, // 'open' should be a boolean and is required
    handleClose: PropTypes.func.isRequired, // 'handleClose' should be a function and is required
  }

const styles = {
  dialogTitle: {
    backgroundColor: '#f5f5f5',
  },
  inputField: {
    marginBottom: '10px',
  },
  actionButton: {
    margin: '5px',
  },
  tableContainer: {
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  table: {
    width: '100%',
    marginTop: '10px',
    borderCollapse: 'collapse',
  },
  deleteIcon: {
    color: 'red',
  },
  imagePreview: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
  },
};

export default FactureForm;
