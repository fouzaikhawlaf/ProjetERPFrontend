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

const CreateBonDeReceptionDialog = ({ open, handleClose }) => {
  const [supplier, setSupplier] = useState(''); // Supplier instead of Client
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
    console.log({ supplier, document, project, note, items, image });
    handleClose();
  };

  const handleApproveClick = () => {
    setShowConfirmOverlay(true);
  };

  const handleConfirmApprove = () => {
    console.log("Bon de réception approved");
    setShowConfirmOverlay(false);
    handleSubmit();
  };

  const handleCancelApprove = () => {
    setShowConfirmOverlay(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle style={styles.dialogTitle}>Nouveau Bon de Réception</DialogTitle>
      <DialogContent style={styles.dialogContent}>
        {/* Supplier and Document Info */}
        <Grid container spacing={2} style={styles.section}>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Fournisseur"
              type="text"
              fullWidth
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
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
        <Grid container spacing={2} style={styles.section}>
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
            <img src={image} alt="Uploaded" style={styles.image} />
          </Paper>
        )}

        {/* Items Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
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
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td>
                    <TextField
                      type="number"
                      value={item.priceHT}
                      onChange={(e) => handleItemChange(index, 'priceHT', parseFloat(e.target.value))}
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td>
                    <TextField
                      type="number"
                      value={item.vat}
                      onChange={(e) => handleItemChange(index, 'vat', parseFloat(e.target.value))}
                      variant="outlined"
                      fullWidth
                    />
                  </td>
                  <td>
                    <Typography>{item.totalHT.toFixed(2)} TND</Typography>
                  </td>
                  <td>
                    <IconButton onClick={() => handleDeleteItem(index)} style={styles.deleteIcon}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <Divider style={styles.divider} />
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
            <Typography>Total: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT()) + 1).toFixed(2)} TND</Typography>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Approve and Close Buttons */}
      <DialogActions>
        <Button onClick={handleApproveClick} color="primary" startIcon={<ApproveIcon />} style={styles.approveButton}>
          Approuver
        </Button>
        <Button onClick={handleClose} color="primary">
          Fermer
        </Button>
      </DialogActions>

      {/* Confirmation Overlay */}
      {showConfirmOverlay && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <Typography variant="h6">Confirmer approbation</Typography>
            <Button onClick={handleConfirmApprove} variant="contained" color="primary" style={{ margin: '10px' }}>
              Confirmer
            </Button>
            <Button onClick={handleCancelApprove} variant="outlined" color="secondary" style={{ margin: '10px' }}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

const styles = {
  dialogTitle: {
    backgroundColor: '#3f51b5',
    color: '#fff',
  },
  dialogContent: {
    padding: '20px',
  },
  inputField: {
    marginBottom: '15px',
  },
  actionButton: {
    backgroundColor: '#3f51b5',
    color: '#fff',
  },
  imagePreview: {
    marginTop: '15px',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '300px',
  },
  tableContainer: {
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  deleteIcon: {
    color: '#f44336',
  },
  approveButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  divider: {
    margin: '20px 0',
  },
};

CreateBonDeReceptionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateBonDeReceptionDialog;
