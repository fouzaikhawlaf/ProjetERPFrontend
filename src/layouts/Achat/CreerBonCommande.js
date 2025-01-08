import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/system";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const Input = styled("input")({
  display: "none",
});

const CreerBonCommande = ({ handleSubmit }) => {
  const [client, setClient] = useState("");
  const [document, setDocument] = useState("");
  const [project, setProject] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([
    { designation: "", quantity: 0, priceHT: 0, vat: 0, totalHT: 0 },
  ]);

  const handleAddItem = () => {
    setItems([...items, { designation: "", quantity: 0, priceHT: 0, vat: 0, totalHT: 0 }]);
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

  const calculateTotalVAT = () =>
    items.reduce((total, item) => total + item.totalHT * (item.vat / 100), 0).toFixed(2);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = () => {
    handleSubmit({ client, document, project, note, items, image });
  };

  return (
    <DashboardLayout>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "90%",
          maxWidth: "1200px",
          margin: "auto",
          mt: 4,
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3, fontWeight: 600 }}>
          Créer un Nouveau Devis
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          {/* Client & Document */}
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

          {/* Project */}
          <Grid item xs={12}>
            <TextField
              label="Projet"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Note */}
          <Grid item xs={12}>
            <TextField
              label="Note"
              fullWidth
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Image Upload & Buttons */}
        <Grid container spacing={2} alignItems="center" sx={{ my: 3 }}>
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ borderRadius: "8px" }}
            >
              Ajouter un article
            </Button>
          </Grid>
        </Grid>

        {/* Image Preview */}
        {image && (
          <Paper elevation={1} sx={{ my: 3, overflow: "hidden", borderRadius: "8px" }}>
            <img src={image} alt="Uploaded" style={{ width: "100%", height: "auto" }} />
          </Paper>
        )}

        {/* Items Table */}
        <Table sx={{ my: 3, tableLayout: "fixed", width: "100%", overflowX: "auto" }}>
  <thead>
    <tr>
      <th style={{ width: "160px" }}>Désignation</th>
      <th style={{ width: "100px" }}>Quantité</th>
      <th style={{ width: "120px" }}>Prix HT</th>
      <th style={{ width: "100px" }}>TVA (%)</th>
      <th>Total HT</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item, index) => (
      <tr key={index}>
        <td>
          <TextField
            fullWidth
            sx={{ width: "150px" }}
            value={item.designation}
            onChange={(e) => handleItemChange(index, "designation", e.target.value)}
            variant="standard"
          />
        </td>
        <td>
          <TextField
            type="number"
            fullWidth
            sx={{ width: "80px" }}
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
            variant="standard"
          />
        </td>
        <td>
          <TextField
            type="number"
            fullWidth
            sx={{ width: "100px" }}
            value={item.priceHT}
            onChange={(e) => handleItemChange(index, "priceHT", parseFloat(e.target.value))}
            variant="standard"
          />
        </td>
        <td>
          <TextField
            type="number"
            fullWidth
            sx={{ width: "80px" }}
            value={item.vat}
            onChange={(e) => handleItemChange(index, "vat", parseFloat(e.target.value))}
            variant="standard"
          />
        </td>
        <td>{item.totalHT.toFixed(2)} TND</td>
        <td>
          <IconButton color="error" onClick={() => handleDeleteItem(index)}>
            <DeleteIcon />
          </IconButton>
        </td>
      </tr>
    ))}
  </tbody>
</Table>


        {/* Totals */}
        <Divider sx={{ my: 3 }} />
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
              Net à payer:{" "}
              {(parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT()) + 1).toFixed(2)} TND
            </Typography>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={onSubmit}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            Approuver
          </Button>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
};

CreerBonCommande.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CreerBonCommande;
