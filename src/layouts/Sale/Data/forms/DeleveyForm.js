import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, TextField, Paper, IconButton, Grid, Typography, Tooltip, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/system';

const Input = styled('input')({
  display: 'none',
});

const DeliveryForm = () => {
  const [client, setClient] = useState('');
  const [document, setDocument] = useState('');
  const [project, setProject] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([
    { designation: '', quantity: 0, priceHT: 0.0, vat: 0.0, totalHT: 0.0 },
  ]);

  // Add/Remove Items
  const handleAddItem = () => {
    setItems([...items, { designation: '', quantity: 0, priceHT: 0.0, vat: 0.0, totalHT: 0.0 }]);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].totalHT = newItems[index].quantity * newItems[index].priceHT;
    setItems(newItems);
  };

  // Total Calculations
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
    alert('Form submitted successfully!');
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Nouvelle Commande
      </Typography>
      <Grid container spacing={2}>
        {/* Form Inputs */}
        <Grid item xs={12} md={6}>
          <TextField label="Client" fullWidth value={client} onChange={(e) => setClient(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Document" fullWidth value={document} onChange={(e) => setDocument(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Projet" fullWidth value={project} onChange={(e) => setProject(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Note" multiline rows={3} fullWidth value={note} onChange={(e) => setNote(e.target.value)} />
        </Grid>

        {/* Image Upload */}
        <Grid item xs={12}>
          <label htmlFor="upload-image">
            <Input accept="image/*" id="upload-image" type="file" onChange={handleImageChange} />
            <Tooltip title="Ajouter une image">
              <IconButton color="primary" component="span">
                <PhotoCameraIcon />
              </IconButton>
            </Tooltip>
          </label>
          {image && (
            <Paper elevation={2} style={{ marginTop: '10px', padding: '10px' }}>
              <img src={image} alt="Uploaded" style={{ width: '100%', maxHeight: '200px' }} />
            </Paper>
          )}
        </Grid>

        {/* Dynamic Items Table */}
        <Grid item xs={12}>
          <Typography variant="h6">Articles</Typography>
          {items.map((item, index) => (
            <Grid container spacing={2} key={index} alignItems="center">
              <Grid item xs={3}>
                <TextField
                  label="Désignation"
                  fullWidth
                  value={item.designation}
                  onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Quantité"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Prix HT"
                  type="number"
                  fullWidth
                  value={item.priceHT}
                  onChange={(e) => handleItemChange(index, 'priceHT', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="TVA (%)"
                  type="number"
                  fullWidth
                  value={item.vat}
                  onChange={(e) => handleItemChange(index, 'vat', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography>{item.totalHT.toFixed(2)} TND</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => handleDeleteItem(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="contained" style={{ marginTop: '10px' }}>
            Ajouter un article
          </Button>
        </Grid>

        {/* Totals */}
        <Grid item xs={12}>
          <Divider style={{ margin: '20px 0' }} />
          <Typography>Total HT: {calculateTotalHT()} TND</Typography>
          <Typography>Total TVA: {calculateTotalVAT()} TND</Typography>
          <Typography>Net à payer: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT()) + 1).toFixed(2)} TND</Typography>
        </Grid>
      </Grid>

      <Button
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        style={{ marginTop: '20px' }}
      >
        Soumettre
      </Button>
    </Paper>
  );
};

export default DeliveryForm;
