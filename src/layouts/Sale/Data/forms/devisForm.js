import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Button, TextField, Grid, IconButton, Typography, Tooltip, Divider, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SubtotalIcon from '@mui/icons-material/Functions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/system';

const Input = styled('input')({
  display: 'none',
});

const DevisForm = ({ handleSubmit }) => {
  const [client, setClient] = useState('');
  const [document, setDocument] = useState('');
  const [project, setProject] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([{ designation: '', quantity: 0, priceHT: 0, vat: 0, totalHT: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { designation: '', quantity: 0, priceHT: 0, vat: 0, totalHT: 0 }]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].totalHT = newItems[index].quantity * newItems[index].priceHT;
    setItems(newItems);
  };

  const calculateTotalHT = () => items.reduce((total, item) => total + item.totalHT, 0).toFixed(2);

  const calculateTotalVAT = () => items.reduce((total, item) => total + item.totalHT * (item.vat / 100), 0).toFixed(2);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = () => {
    handleSubmit({ client, document, project, note, items, image });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Nouvelle Commande</Typography>
      <Divider />

      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Client"
            fullWidth
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Document"
            fullWidth
            value={document}
            onChange={(e) => setDocument(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Projet"
            fullWidth
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Note"
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <label htmlFor="image-upload">
            <Input accept="image/*" id="image-upload" type="file" onChange={handleImageChange} />
            <Tooltip title="Ajouter une image">
              <IconButton color="primary" component="span">
                <PhotoCameraIcon />
              </IconButton>
            </Tooltip>
          </label>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<SubtotalIcon />}>Ajouter un sous-total</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddItem}>Ajouter un article</Button>
        </Grid>
      </Grid>

      {image && (
        <Paper elevation={1} sx={{ my: 2 }}>
          <img src={image} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
        </Paper>
      )}

      {/* Items Table */}
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Désignation</TableCell>
            <TableCell>Quantité</TableCell>
            <TableCell>Prix HT</TableCell>
            <TableCell>TVA</TableCell>
            <TableCell>Total HT</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={item.designation}
                  onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.priceHT}
                  onChange={(e) => handleItemChange(index, 'priceHT', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.vat}
                  onChange={(e) => handleItemChange(index, 'vat', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>{item.totalHT.toFixed(2)} TND</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDeleteItem(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Totals */}
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Total HT: {calculateTotalHT()} TND</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Total TVA: {calculateTotalVAT()} TND</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Timbre fiscal: 1.000 TND</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            Net à payer: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT()) + 1).toFixed(2)} TND
          </Typography>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={onSubmit}>
          Approuver
        </Button>
      </Grid>
    </Paper>
  );
};

DevisForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default DevisForm;
