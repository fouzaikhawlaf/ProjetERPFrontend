import React, { useState, useEffect } from 'react';
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
  Grid
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { updateDevisPurchase } from "services/devisPurchaseService";
import { getSuppliers } from "services/supplierApi";
import { getServices } from "services/ServiceApi";
import { useSnackbar } from "notistack";
import PropTypes from 'prop-types';

const EditDevisDialog = ({ open, onClose, devis, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    devisNumber: '',
    validityDate: '',
    description: '',
    startDate: '',
    endDate: '',
    items: []
  });
  const [suppliers, setSuppliers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [supplierError, setSupplierError] = useState("");
  const [servicesError, setServicesError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction utilitaire pour normaliser les items
  const normalizeItems = (itemsData) => {
    if (Array.isArray(itemsData)) {
      return itemsData;
    } else if (itemsData && typeof itemsData === 'object' && itemsData.$values) {
      return itemsData.$values;
    } else if (itemsData && typeof itemsData === 'object') {
      // Si c'est un objet mais pas un tableau, convertir en tableau
      return Object.values(itemsData);
    }
    return [];
  };

  useEffect(() => {
    if (devis) {
      // Normaliser les items pour éviter l'erreur "is not iterable"
      const normalizedItems = normalizeItems(devis.items);
      
      setFormData({
        devisNumber: devis.devisNumber || '',
        validityDate: devis.validityDate || '',
        description: devis.description || '',
        startDate: devis.startDate || '',
        endDate: devis.endDate || '',
        items: normalizedItems
      });
      setSelectedSupplier(devis.supplierId || '');
    }
  }, [devis]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSuppliers(true);
        setLoadingServices(true);
        
        const [suppliersData, servicesData] = await Promise.all([
          getSuppliers(),
          getServices()
        ]);
        
        // Traitement des fournisseurs
        let supplierData = [];
        if (suppliersData?.$values) supplierData = suppliersData.$values;
        else if (Array.isArray(suppliersData)) supplierData = suppliersData;

        const transformedSuppliers = supplierData
          .map(supplier => ({
            id: supplier.supplierID || supplier.id,
            name: supplier.name || supplier.companyName || `Fournisseur ${supplier.supplierID || supplier.id}`
          }))
          .filter(supplier => supplier.id);

        setSuppliers(transformedSuppliers);
        setSupplierError(transformedSuppliers.length === 0 ? "Aucun fournisseur disponible" : "");

        // Traitement des services
        let serviceData = [];
        if (servicesData?.$values) serviceData = servicesData.$values;
        else if (Array.isArray(servicesData)) serviceData = servicesData;

        const transformedServices = serviceData
          .map(service => ({
            id: service.serviceID || service.id,
            name: service.name,
            price: service.price || 0,
            tvaRate: service.tvaRate || 0
          }))
          .filter(service => service.id);

        setServices(transformedServices);
        setServicesError(transformedServices.length === 0 ? "Aucun service disponible" : "");

      } catch (error) {
        console.error("Error fetching data:", error);
        setSupplierError("Échec du chargement des fournisseurs");
        setServicesError("Échec du chargement des services");
      } finally {
        setLoadingSuppliers(false);
        setLoadingServices(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    if (field === 'designation' || field === 'serviceId') {
      newItems[index][field] = value;
    } else {
      const numericValue = Math.max(0, Number(value) || 0);
      newItems[index][field] = numericValue;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleServiceChange = (index, serviceId) => {
    if (serviceId) {
      const selectedService = services.find(service => service.id === serviceId);
      if (selectedService) {
        const newItems = [...formData.items];
        newItems[index] = {
          ...newItems[index],
          serviceId: selectedService.id,
          designation: selectedService.name,
          prixUnitaire: selectedService.price,
          tva: selectedService.tvaRate
        };
        setFormData({ ...formData, items: newItems });
      }
    } else {
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        serviceId: null,
        designation: "",
        prixUnitaire: 0,
        tva: 0
      };
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { designation: "", quantite: 1, prixUnitaire: 0, tva: 0, serviceId: null }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const calculateTotalHT = () =>
    formData.items.reduce((total, item) => total + (item.quantite || 0) * (item.prixUnitaire || 0), 0).toFixed(3);

  const calculateTotalVAT = () =>
    formData.items.reduce((total, item) => total + (item.quantite || 0) * (item.prixUnitaire || 0) * ((item.tva || 0) / 100), 0).toFixed(3);

  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT() || 0) + parseFloat(calculateTotalVAT() || 0)).toFixed(3);

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return ((end - start) / (1000 * 60 * 60)).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!selectedSupplier) {
      enqueueSnackbar("Veuillez sélectionner un fournisseur", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        supplierId: selectedSupplier,
        devisNumber: formData.devisNumber,
        totalHT: parseFloat(calculateTotalHT()),
        totalTVA: parseFloat(calculateTotalVAT()),
        totalTTC: parseFloat(calculateTotalTTC()),
        items: formData.items.map(item => ({
          designation: item.designation,
          quantite: item.quantite,
          prixUnitaire: item.prixUnitaire,
          tva: item.tva,
          serviceId: item.serviceId
        })),
        validityDate: formData.validityDate,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await updateDevisPurchase(devis.id, updateData);
      enqueueSnackbar("Devis modifié avec succès", { variant: "success" });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating devis:", error);
      enqueueSnackbar("Erreur lors de la modification du devis", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!devis) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}>
      <DialogTitle>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 2, fontWeight: 600 }}>
          Modifier le Devis de Service
        </Typography>
        <Divider />
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Fournisseur */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" error={!!supplierError}>
              <InputLabel>Fournisseur</InputLabel>
              <Select
                value={selectedSupplier}
                onChange={handleSupplierChange}
                label="Fournisseur"
                disabled={loadingSuppliers || supplierError}
                renderValue={(value) => {
                  const selected = suppliers.find(s => s.id === value);
                  return selected ? selected.name : "Sélectionnez un fournisseur";
                }}
              >
                {loadingSuppliers ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>Chargement des fournisseurs...</Typography>
                  </MenuItem>
                ) : suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{supplier.name}</span>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        ID: {supplier.id}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {supplierError && (
                <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 8 }}>❌</span>
                  {supplierError}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Devis Number */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Numéro de devis"
              fullWidth
              value={formData.devisNumber}
              onChange={(e) => setFormData({ ...formData, devisNumber: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Validity Date */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de validité"
              fullWidth
              type="date"
              value={formData.validityDate}
              onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
              variant="outlined"
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de début"
              fullWidth
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date de fin"
              fullWidth
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Durée */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Durée (heures)"
              fullWidth
              value={calculateDuration()}
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Items Table */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", margin: "24px 0" }}>
            <thead>
              <tr>
                <th style={{ width: "25%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Désignation</th>
                <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Quantité</th>
                <th style={{ width: "20%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Prix Unitaire (TND)</th>
                <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>TVA (%)</th>
                <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ width: "25%", padding: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <Select
                          value={item.serviceId || ""}
                          onChange={(e) => handleServiceChange(index, e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Sélectionner un service</em>
                          </MenuItem>
                          {loadingServices ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} />
                              <Typography variant="body2" sx={{ ml: 1 }}>Chargement...</Typography>
                            </MenuItem>
                          ) : services.map((service) => (
                            <MenuItem key={service.id} value={service.id}>
                              {service.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </td>
                  <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TextField
                        fullWidth
                        type="number"
                        value={item.quantite}
                        onChange={(e) => handleItemChange(index, "quantite", e.target.value)}
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, step: 1 }}
                      />
                    </div>
                  </td>
                  <td style={{ width: "20%", padding: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TextField
                        fullWidth
                        type="number"
                        value={item.prixUnitaire}
                        onChange={(e) => handleItemChange(index, "prixUnitaire", e.target.value)}
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </div>
                  </td>
                  <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TextField
                        fullWidth
                        type="number"
                        value={item.tva}
                        onChange={(e) => handleItemChange(index, "tva", e.target.value)}
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                      />
                    </div>
                  </td>
                  <td style={{ width: "15%", padding: "8px", textAlign: "center" }}>
                    <IconButton onClick={() => handleRemoveItem(index)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Add Item Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddItem}
            sx={{ borderRadius: "8px" }}
          >
            Ajouter un article
          </Button>
        </Box>

        {/* Totals */}
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Total HT: {calculateTotalHT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Total TVA: {calculateTotalVAT()} TND</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="primary">
              Total TTC: {calculateTotalTTC()} TND
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
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
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditDevisDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  devis: PropTypes.shape({
    id: PropTypes.number.isRequired,
    devisNumber: PropTypes.string.isRequired,
    validityDate: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    supplierId: PropTypes.number,
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object // Accepte aussi les objets (pour $values)
    ])
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditDevisDialog;