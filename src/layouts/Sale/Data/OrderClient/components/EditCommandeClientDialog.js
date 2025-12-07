import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { updateOrder } from "services/orderClientService"; // ✅ Changé

const ORDER_STATUS = [
  { value: 0, label: "Brouillon" },
  { value: 1, label: "Validée" },
  { value: 2, label: "Livrée" },
  { value: 3, label: "Facturée" },
  { value: 4, label: "Annulée" },
  { value: 5, label: "En attente" },
  { value: 6, label: "Confirmée" },
  { value: 7, label: "Approuvée" },
  { value: 8, label: "Rejetée" },
];

const EditCommandeClientDialog = ({ open, onClose, commande, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (commande && open) {
      setFormData({
        ...commande,
        expectedDeliveryDate: commande.expectedDeliveryDate
          ? commande.expectedDeliveryDate.split("T")[0]
          : "",
        orderDate: commande.orderDate ? commande.orderDate.split("T")[0] : "",
      });
    }
  }, [commande, open]);

  if (!commande || !formData) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        status: Number(formData.status),
      };
      await updateOrder(commande.id, payload);
      enqueueSnackbar("Commande client mise à jour avec succès", {
        variant: "success",
      });
      onUpdate && onUpdate();
      onClose();
    } catch (e) {
      console.error("Erreur update commande client :", e);
      enqueueSnackbar("Erreur lors de la mise à jour de la commande", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "white",
          py: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          ✏️ Modifier la commande client
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }} disabled={loading}>
          <Clear />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Numéro commande"
              fullWidth
              value={formData.orderNumber || formData.OrderNumber || ""}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Client"
              fullWidth
              value={
                formData.clientName ||
                formData.customerName ||
                formData.clientId ||
                ""
              }
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Date de commande"
              fullWidth
              type="date"
              value={formData.orderDate || ""}
              onChange={(e) => handleChange("orderDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Date de livraison prévue"
              fullWidth
              type="date"
              value={formData.expectedDeliveryDate || ""}
              onChange={(e) =>
                handleChange("expectedDeliveryDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                label="Statut"
                value={formData.status ?? 0}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                {ORDER_STATUS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Champ libre pour commentaire / note (optionnel) */}
          <Grid item xs={12}>
            <TextField
              label="Commentaires"
              fullWidth
              multiline
              minRows={2}
              value={formData.comment || formData.note || ""}
              onChange={(e) => handleChange("comment", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          justifyContent: "flex-end",
          gap: 2,
          backgroundColor: "grey.50",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: "8px", px: 3 }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: "8px", px: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : "Enregistrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditCommandeClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default EditCommandeClientDialog;
