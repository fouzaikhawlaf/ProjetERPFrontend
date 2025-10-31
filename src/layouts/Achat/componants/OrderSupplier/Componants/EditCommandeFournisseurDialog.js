import React, { useState, useEffect } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  FormHelperText,
  Divider,
  Grid,
  Modal,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

// ❗ À adapter à ton vrai service
// ex: import orderSupplierService from "services/orderSupplierService";
import orderSupplierService from "services/orderSupplierService";
// si tu veux recharger la liste des fournisseurs
import { getSuppliers } from "services/supplierApi";

const EditCommandeFournisseurDialog = ({ open, onClose, commande, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    orderNumber: "",
    deliveryDate: "",
    description: "",
    notes: "",
    items: [],
  });

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [supplierError, setSupplierError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // normaliser items (comme ton devis)
  const normalizeItems = (itemsData) => {
    if (Array.isArray(itemsData)) return itemsData;
    if (itemsData && typeof itemsData === "object" && itemsData.$values) return itemsData.$values;
    if (itemsData && typeof itemsData === "object") return Object.values(itemsData);
    return [];
  };

  const handleModalClose = () => {
    setModalOpen(false);
    onUpdate && onUpdate();
    onClose();
  };

  // quand on ouvre / on reçoit la commande
  useEffect(() => {
    if (commande) {
      const normalizedItems = normalizeItems(commande.items);

      setFormData({
        orderNumber: commande.orderNumber || "",
        deliveryDate: (commande.deliveryDate || commande.expectedDeliveryDate || "").split("T")[0],
        description: commande.description || "",
        notes: commande.notes || "",
        items: normalizedItems.map((it) => ({
          id: it.id,
          designation: it.designation || "",
          quantity: it.quantity || it.quantite || 0,
          unitPrice: it.unitPrice || it.prixUnitaire || 0,
          tva: it.tva || 0,
        })),
      });
      setSelectedSupplier(commande.supplierId || commande.supplierID || "");
    }
  }, [commande]);

  // charger fournisseurs (optionnel, si tu veux permettre de changer le fournisseur)
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const data = await getSuppliers();
        let supplierData = [];
        if (data?.$values) supplierData = data.$values;
        else if (Array.isArray(data)) supplierData = data;

        const transformed = supplierData
          .map((s) => ({
            id: s.supplierID || s.id,
            name: s.name || s.companyName || `Fournisseur ${s.supplierID || s.id}`,
          }))
          .filter((s) => s.id);

        setSuppliers(transformed);
        setSupplierError(transformed.length === 0 ? "Aucun fournisseur disponible" : "");
      } catch (err) {
        console.error(err);
        setSupplierError("Échec du chargement des fournisseurs");
      } finally {
        setLoadingSuppliers(false);
      }
    };

    if (open) {
      fetchSuppliers();
    }
  }, [open]);

  // handlers items
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];

    if (field === "designation") {
      newItems[index][field] = value;
    } else {
      // numérique
      const num = Math.max(0, Number(value) || 0);
      newItems[index][field] = num;
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { designation: "", quantity: 1, unitPrice: 0, tva: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  // calculs
  const calculateTotalHT = () =>
    formData.items
      .reduce(
        (total, item) => total + (item.quantity || 0) * (item.unitPrice || 0),
        0
      )
      .toFixed(3);

  const calculateTotalVAT = () =>
    formData.items
      .reduce(
        (total, item) =>
          total +
          (item.quantity || 0) *
            (item.unitPrice || 0) *
            ((item.tva || 0) / 100),
        0
      )
      .toFixed(3);

  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT() || 0) + parseFloat(calculateTotalVAT() || 0)).toFixed(3);

  // submit
  const handleSubmit = async () => {
    if (!selectedSupplier) {
      enqueueSnackbar("Veuillez sélectionner un fournisseur", { variant: "error" });
      return;
    }

    if (!formData.orderNumber) {
      enqueueSnackbar("Le numéro de commande est obligatoire", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      // payload à adapter à ton backend
      const updateData = {
        supplierId: parseInt(selectedSupplier),
        orderNumber: formData.orderNumber,
        deliveryDate: formData.deliveryDate,
        description: formData.description,
        notes: formData.notes,
        totalHT: parseFloat(calculateTotalHT()),
        totalTVA: parseFloat(calculateTotalVAT()),
        totalTTC: parseFloat(calculateTotalTTC()),
        items: formData.items.map((it) => ({
          id: it.id, // si tu veux que le backend sache quelle ligne MAJ
          designation: it.designation,
          quantity: parseFloat(it.quantity),
          unitPrice: parseFloat(it.unitPrice),
          tva: parseFloat(it.tva),
        })),
      };

      // exemple d'appel
      await orderSupplierService.updateOrder(commande.id, updateData);

      setModalOpen(true);
      enqueueSnackbar("Commande modifiée avec succès", { variant: "success" });
    } catch (error) {
      console.error("Erreur MAJ commande :", error);
      enqueueSnackbar("Erreur lors de la modification de la commande", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!commande) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
      >
        <DialogTitle>
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Modifier la Commande Fournisseur
          </Typography>
          <Divider />
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Fournisseur */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!supplierError}>
                <InputLabel>Fournisseur</InputLabel>
                <Select
                  value={selectedSupplier}
                  label="Fournisseur"
                  onChange={handleSupplierChange}
                  disabled={loadingSuppliers || supplierError}
                  renderValue={(value) => {
                    const selected = suppliers.find((s) => s.id === value);
                    return selected ? selected.name : "Sélectionnez un fournisseur";
                  }}
                >
                  {loadingSuppliers ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>
                        Chargement des fournisseurs...
                      </Typography>
                    </MenuItem>
                  ) : (
                    suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span>{supplier.name}</span>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            ID: {supplier.id}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                {supplierError && (
                  <FormHelperText error>{supplierError}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Numéro commande */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Numéro de commande"
                fullWidth
                value={formData.orderNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, orderNumber: e.target.value }))
                }
              />
            </Grid>

            {/* Date livraison */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Date de livraison"
                type="date"
                fullWidth
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deliveryDate: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </Grid>
          </Grid>

          {/* Tableau items */}
          <Box sx={{ mt: 4 }}>
            <table
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
                margin: "24px 0",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Désignation</th>
                  <th style={thStyle}>Quantité</th>
                  <th style={thStyle}>Prix Unitaire (TND)</th>
                  <th style={thStyle}>TVA (%)</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={tdStyle}>
                      <TextField
                        fullWidth
                        size="small"
                        value={item.designation}
                        onChange={(e) =>
                          handleItemChange(index, "designation", e.target.value)
                        }
                      />
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        inputProps={{ min: 0, step: 1 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", e.target.value)
                        }
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        value={item.tva}
                        onChange={(e) => handleItemChange(index, "tva", e.target.value)}
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <IconButton
                        onClick={() => handleRemoveItem(index)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* bouton ajout ligne */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              sx={{ borderRadius: "8px" }}
            >
              Ajouter un article
            </Button>
          </Box>

          {/* Totaux */}
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Total HT: {calculateTotalHT()} TND
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">
                Total TVA: {calculateTotalVAT()} TND
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">
                Total TTC: {calculateTotalTTC()} TND
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} disabled={loading} sx={{ borderRadius: "8px" }}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal succès */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="success-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "500px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
          }}
        >
          <Typography id="success-modal-title" variant="h4" sx={{ mb: 2 }}>
            ✅ Commande modifiée !
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Les modifications ont été enregistrées avec succès.
          </Typography>
          <Button variant="contained" color="success" onClick={handleModalClose}>
            Fermer
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const thStyle = {
  textAlign: "center",
  fontWeight: "bold",
  padding: "8px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "8px",
  textAlign: "center",
};

EditCommandeFournisseurDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commande: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderNumber: PropTypes.string,
    deliveryDate: PropTypes.string,
    expectedDeliveryDate: PropTypes.string, // Ajout de cette ligne
    description: PropTypes.string,
    notes: PropTypes.string,
    supplierId: PropTypes.number,
    supplierID: PropTypes.number, // Ajout de cette ligne
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }).isRequired,
  onUpdate: PropTypes.func,
};

export default EditCommandeFournisseurDialog;
