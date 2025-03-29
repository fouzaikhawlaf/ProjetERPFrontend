import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { createDevis } from "services/DevisClientService";
import { getClients } from "services/ApiClient";
import { getProducts } from "services/ProductApi";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import generateDevisPDF from "../pdf/DevisPDF";
import { useSnackbar } from "notistack";

const CreerDevisClientProduit = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [reference, setReference] = useState("DEVIS-CLIENT-");
  const [dateCreation] = useState(new Date().toISOString().split("T")[0]);
  const [expirationDate, setExpirationDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [status, setStatus] = useState(0);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [items, setItems] = useState([
    { product: null, designation: "", quantite: 1, prixUnitaire: 0, tva: 18 },
  ]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState({
    clients: true,
    products: true,
    submitting: false,
  });
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsResponse = await getClients();
        let clientData = [];
        
        if (clientsResponse?.data?.$values) {
          clientData = clientsResponse.data.$values;
        } else if (Array.isArray(clientsResponse?.$values)) {
          clientData = clientsResponse.$values;
        } else if (Array.isArray(clientsResponse?.clients)) {
          clientData = clientsResponse.clients;
        } else if (Array.isArray(clientsResponse?.data)) {
          clientData = clientsResponse.data;
        } else if (Array.isArray(clientsResponse)) {
          clientData = clientsResponse;
        }

        const transformedClients = clientData.map(client => ({
          id: client.clientID || client.$id || client.id,
          name: client.name || `Client ${client.clientID || client.$id || client.id || 'N/A'}`,
        })).filter(client => client.id);

        setClients(transformedClients);
        setIsLoading(prev => ({ ...prev, clients: false }));

        const productsResponse = await getProducts();
        const transformedProducts = productsResponse.map(product => ({
          id: product.productID || product.id,
          name: product.name || product.designation || `Product ${product.productID || product.id || 'N/A'}`,
          price: product.price || product.prixUnitaire || 0,
          tva: product.tvaRate || product.tva || 18,
          designation: product.designation || product.name || '',
          code: product.code || ''
        })).filter(product => product.id);

        setProducts(transformedProducts);
        setIsLoading(prev => ({ ...prev, products: false }));

      } catch (error) {
        console.error("Error fetching data:", error);
        enqueueSnackbar("Erreur lors du chargement des données", { variant: "error" });
        setClients([]);
        setProducts([]);
        setIsLoading({ clients: false, products: false, submitting: false });
      }
    };
    fetchData();
  }, [enqueueSnackbar]);

  const handleProductChange = (index, selectedProduct) => {
    const newItems = [...items];
    if (selectedProduct) {
      newItems[index] = {
        ...newItems[index],
        product: selectedProduct,
        designation: selectedProduct.designation,
        prixUnitaire: selectedProduct.price,
        tva: selectedProduct.tva
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        product: null,
        designation: "",
        prixUnitaire: 0,
        tva: 18
      };
    }
    setItems(newItems);
    calculateTotals(newItems);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedClient) newErrors.client = "Client requis";
    if (!reference) newErrors.reference = "Référence requise";
    
    items.forEach((item, index) => {
      if (!item.product && !item.designation) {
        newErrors[`designation-${index}`] = "Produit ou désignation requis";
      }
      if (item.quantite <= 0) newErrors[`quantite-${index}`] = "Quantité invalide";
      if (item.prixUnitaire <= 0) newErrors[`prixUnitaire-${index}`] = "Prix invalide";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    setItems([...items, { product: null, designation: "", quantite: 1, prixUnitaire: 0, tva: 18 }]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    if (field === 'product') return;
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    const ht = items.reduce((acc, item) => acc + (item.quantite * item.prixUnitaire), 0);
    const tva = items.reduce((acc, item) => acc + (item.quantite * item.prixUnitaire * (item.tva / 100)), 0);
    setTotalHT(ht.toFixed(2));
    setTotalTVA(tva.toFixed(2));
    setTotalTTC((ht + tva).toFixed(2));
  };

  const handlePreviewPdf = () => {
    if (!selectedClient) return;
    
    const selectedClientData = clients.find(c => c.id === selectedClient);
    const pdfDoc = generateDevisPDF(
      {
        reference,
        creationDate: dateCreation,
        expirationDate,
        totalHT,
        totalTVA,
        totalTTC
      },
      selectedClientData,
      items
    );
    
    const pdfBlob = pdfDoc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
    setPdfDialogOpen(true);
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(prev => ({ ...prev, submitting: true }));

    const devisData = {
      clientId: selectedClient,
      reference,
      creationDate: dateCreation,
      expirationDate,
      status,
      totalHT: parseFloat(totalHT),
      totalTVA: parseFloat(totalTVA),
      totalTTC: parseFloat(totalTTC),
      items: items.map(item => ({
        productId: item.product?.id || null,
        designation: item.designation,
        quantity: Number(item.quantite),
        price: Number(item.prixUnitaire),
        tva: Number(item.tva),
        type: item.product ? 0 : 1
      }))
    };

    try {
      await createDevis(devisData);
      enqueueSnackbar("Devis créé avec succès!", { 
        variant: "success",
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      
      const selectedClientData = clients.find(c => c.id === selectedClient);
      const pdfDoc = generateDevisPDF(devisData, selectedClientData, items);
      const pdfBlob = pdfDoc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      setPdfDialogOpen(true);
      
    } catch (error) {
      console.error("Error creating devis:", error);
      enqueueSnackbar("Erreur lors de la création du devis", { 
        variant: "error",
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleDownloadPdf = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${reference}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClosePdfDialog = () => {
    setPdfDialogOpen(false);
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
      navigate("/devis/clientTable");
    }, 300);
  };

  if (isLoading.clients || isLoading.products) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

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
          Créer un Nouveau Devis Client (Produits)
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.client}>
              <InputLabel id="client-select-label">Client</InputLabel>
              <Select
                labelId="client-select-label"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                label="Client"
                disabled={clients.length === 0}
              >
                {clients.length > 0 ? (
                  clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} {client.email && `(${client.email})`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    Aucun client disponible
                  </MenuItem>
                )}
              </Select>
              {errors.client && (
                <Typography color="error" variant="caption">
                  {errors.client}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Référence du devis"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              fullWidth
              error={!!errors.reference}
              helperText={errors.reference}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Date de création"
              type="date"
              value={dateCreation}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Date d'expiration"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Statut"
                inputProps={{ readOnly: true }}
                sx={{
                  '& .MuiSelect-icon': { display: 'none' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  backgroundColor: '#f5f5f5',
                  pointerEvents: 'none',
                }}
              >
                <MenuItem value={0}>Brouillon</MenuItem>
                <MenuItem value={1}>Envoyé</MenuItem>
                <MenuItem value={2}>Payé</MenuItem>
                <MenuItem value={3}>Annulé</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Box sx={{ overflowX: 'auto', my: 4, width: '100%' }}>
            <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ width: "25%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Produit</th>
                  <th style={{ width: "25%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Désignation</th>
                  <th style={{ width: "10%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Quantité</th>
                  <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Prix Unitaire</th>
                  <th style={{ width: "15%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>TVA</th>
                  <th style={{ width: "10%", textAlign: "center", fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <Autocomplete
                        size="small"
                        options={products}
                        getOptionLabel={(option) => option.code || option.name}
                        value={item.product}
                        onChange={(e, newValue) => handleProductChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText="Aucun produit"
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <TextField
                        fullWidth
                        value={item.designation}
                        onChange={(e) => handleItemChange(index, "designation", e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <TextField
                        fullWidth
                        type="number"
                        value={item.quantite}
                        onChange={(e) => handleItemChange(index, "quantite", e.target.value)}
                        variant="outlined"
                        size="small"
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <TextField
                        fullWidth
                        type="number"
                        value={item.prixUnitaire}
                        onChange={(e) => handleItemChange(index, "prixUnitaire", e.target.value)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">TND</InputAdornment>,
                        }}
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <TextField
                        fullWidth
                        type="number"
                        value={item.tva}
                        onChange={(e) => handleItemChange(index, "tva", e.target.value)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <IconButton 
                        onClick={() => handleDeleteItem(index)} 
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Grid container justifyContent="flex-start" sx={{ my: 2, width: '100%' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ borderRadius: "8px" }}
            >
              Ajouter un article
            </Button>
          </Grid>

          <Divider sx={{ my: 3, width: '100%' }} />
          <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid item xs={4}>
              <Typography>Total HT: {totalHT} TND</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Total TVA: {totalTVA} TND</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Total TTC: {totalTTC} TND</Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, width: '100%', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handlePreviewPdf}
              disabled={!selectedClient || items.length === 0}
            >
              Prévisualiser PDF
            </Button>
            
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={isLoading.submitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              onClick={onSubmit}
              sx={{ minWidth: 200 }}
              disabled={isLoading.submitting || clients.length === 0 || products.length === 0}
            >
              {isLoading.submitting ? 'Enregistrement...' : 'Valider le Devis'}
            </Button>
          </Box>
        </Grid>

        <Dialog
          open={pdfDialogOpen}
          onClose={handleClosePdfDialog}
          maxWidth="lg"
          fullWidth
          sx={{ '& .MuiDialog-paper': { height: '90vh' } }}
        >
          <DialogTitle>Prévisualisation du Devis</DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Devis PDF Preview"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePdfDialog}>Fermer</Button>
            <Button 
              onClick={handleDownloadPdf} 
              variant="contained" 
              color="primary"
              startIcon={<PictureAsPdfIcon />}
            >
              Télécharger PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </DashboardLayout>
  );
};

export default CreerDevisClientProduit;