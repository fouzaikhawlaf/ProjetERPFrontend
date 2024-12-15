import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Paper,
  IconButton,
  Grid,
  Divider,
  Typography,
  Tooltip,
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

const OrderForm = ({ onSubmit }) => {
  const [client, setClient] = useState('');
  const [document, setDocument] = useState('');
  const [project, setProject] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([
    { designation: '', quantity: 0, priceHT: 0.0, vat: 0.0, totalHT: 0.0 },
  ]);
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { designation: '', quantity: 0, priceHT: 0.0, vat: 0.0, totalHT: 0.0 }]);
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
    return items.reduce((total, item) => total + item.totalHT * (item.vat / 100), 0).toFixed(2);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleApproveClick = (e) => {
    e.preventDefault();
    setShowConfirmOverlay(true);
  };

  const handleConfirmApprove = () => {
    console.log('Order approved');
    setShowConfirmOverlay(false);
    if (onSubmit) {
      onSubmit({ client, document, project, note, items, image });
    }
  };

  const handleCancelApprove = () => {
    setShowConfirmOverlay(false);
  };

  return (
    <form onSubmit={handleApproveClick}>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Nouvelle commande
      </Typography>
      <Grid container spacing={3}>
        {/* Client and Document Fields */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Client"
            fullWidth
            value={client}
            onChange={(e) => setClient(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Document"
            fullWidth
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Projet"
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

        {/* Image Upload */}
        <Grid item>
          <label htmlFor="icon-button-file">
            <Input id="icon-button-file" type="file" onChange={handleImageChange} />
            <Tooltip title="Ajouter une image">
              <IconButton color="primary" component="span">
                <PhotoCameraIcon />
              </IconButton>
            </Tooltip>
          </label>
        </Grid>

        {/* Add Item Button */}
        <Grid item>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            variant="contained"
          >
            Ajouter un article
          </Button>
        </Grid>
      </Grid>

      {/* Items Table */}
      <div style={{ marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.priceHT}
                    onChange={(e) => handleItemChange(index, 'priceHT', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <TextField
                    type="number"
                    value={item.vat}
                    onChange={(e) => handleItemChange(index, 'vat', parseFloat(e.target.value))}
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
      </div>

      <Divider style={{ margin: '20px 0' }} />
      <Typography>Total HT: {calculateTotalHT()} TND</Typography>
      <Typography>Total TVA: {calculateTotalVAT()} TND</Typography>
      <Typography>
        Net à payer: {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT()) + 1).toFixed(2)} TND
      </Typography>

      <Button
        type="submit"
        startIcon={<ApproveIcon />}
        variant="contained"
        color="primary"
      >
        Approuver
      </Button>

      {/* Confirmation Overlay */}
      {showConfirmOverlay && (
        <div>
          <Typography>Confirmer approbation ?</Typography>
          <Button onClick={handleCancelApprove}>Annuler</Button>
          <Button onClick={handleConfirmApprove} color="primary">
            Confirmer
          </Button>
        </div>
      )}
    </form>
  );
};

OrderForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default OrderForm;
