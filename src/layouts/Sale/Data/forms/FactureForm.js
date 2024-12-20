import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, TextField, Paper, IconButton, Grid, Divider, Typography, Tooltip
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

const FactureForm = ({ handleSubmit }) => {
  const [client, setClient] = useState('');
  const [document, setDocument] = useState('');
  const [project, setProject] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([{ designation: '', quantity: 0, priceHT: 0.00, vat: 0.00, totalHT: 0.00 }]);

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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const calculateTotalHT = () => {
    return items.reduce((total, item) => total + item.totalHT, 0).toFixed(2);
  };

  const calculateTotalVAT = () => {
    return items.reduce((total, item) => total + (item.totalHT * (item.vat / 100)), 0).toFixed(2);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px auto', maxWidth: '1200px' }}>
      <Typography variant="h5" gutterBottom>Nouvelle Commande</Typography>
      <Divider style={{ marginBottom: '20px' }} />

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ client, document, project, note, items, image });
      }}>
        {/* Client & Document Inputs */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Client"
              type="text"
              fullWidth
              value={client}
              onChange={(e) => setClient(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Document"
              type="text"
              fullWidth
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Projet"
              type="text"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Note"
              multiline
              rows={3}
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
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

        {/* Uploaded Image */}
        {image && (
          <Paper elevation={3} style={{ marginTop: '20px', padding: '10px' }}>
            <img src={image} alt="Preview" style={{ width: '100%' }} />
          </Paper>
        )}

        {/* Items Table */}
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
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
                    variant="outlined"
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                    variant="outlined"
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.priceHT}
                    onChange={(e) => handleItemChange(index, 'priceHT', parseFloat(e.target.value))}
                    variant="outlined"
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.vat}
                    onChange={(e) => handleItemChange(index, 'vat', parseFloat(e.target.value))}
                    variant="outlined"
                  />
                </td>
                <td>
                  <Typography>{item.totalHT.toFixed(2)} TND</Typography>
                </td>
                <td>
                  <IconButton onClick={() => handleDeleteItem(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <Divider style={{ marginTop: '20px', marginBottom: '10px' }} />
        <Typography>Total HT: {calculateTotalHT()} TND</Typography>
        <Typography>Total TVA: {calculateTotalVAT()} TND</Typography>
        <Typography>Total TTC: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(2)} TND</Typography>
        <Typography>Net à payer: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT()) + 1).toFixed(2)} TND</Typography>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<ApproveIcon />}
          style={{ marginTop: '20px' }}
        >
          Soumettre
        </Button>
      </form>
    </Paper>
  );
};

FactureForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default FactureForm;
