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
  Grid,
  Modal,
  Chip,
  Card,
  CardContent
} from "@mui/material";
import { Add, Delete, Clear } from "@mui/icons-material";
import { updateDevis } from "services/DevisClientService";
import { getClients } from "services/ApiClient";
import { getProducts } from "services/ProductApi";
import { getServices } from "services/ServiceApi";
import { getProjects } from "services/ProjectService.js";
import { useSnackbar } from "notistack";
import PropTypes from 'prop-types';

const EditDevisClientDialog = ({ open, onClose, devis, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    reference: '',
    creationDate: '',
    expirationDate: '',
    clientId: '',
    items: []
  });
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [clientError, setClientError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Fonction utilitaire pour normaliser les items
  const normalizeItems = (itemsData) => {
    if (!itemsData) return [];
    
    if (Array.isArray(itemsData)) {
      return itemsData;
    } else if (itemsData && typeof itemsData === 'object' && itemsData.$values) {
      return itemsData.$values;
    } else if (itemsData && typeof itemsData === 'object') {
      return [itemsData];
    }
    return [];
  };

  const handleModalClose = () => {
    setModalOpen(false);
    onUpdate();
    onClose();
  };

  useEffect(() => {
    if (devis) {
      const normalizedItems = normalizeItems(devis.items);
      setFormData({
        reference: devis.reference || '',
        creationDate: devis.creationDate ? devis.creationDate.split('T')[0] : '',
        expirationDate: devis.expirationDate ? devis.expirationDate.split('T')[0] : '',
        clientId: devis.clientId || '',
        items: normalizedItems.map(item => ({
          id: item.id,
          type: item.type || 1,
          productId: item.productId || null,
          serviceId: item.serviceId || null,
          projectId: item.projectId || null,
          designation: item.designation || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          tvaRate: item.tvaRate || 0
        }))
      });
    }
  }, [devis]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingClients(true);
        setLoadingProducts(true);
        setLoadingServices(true);
        setLoadingProjects(true);

        // Récupération des clients (on augmente le pageSize)
        const clientsResponse = await getClients(1, 1000, false, false);
        console.log("Réponse clients:", clientsResponse);
        
        let clientData = [];
        if (clientsResponse && clientsResponse.clients) {
          clientData = clientsResponse.clients;
        } else if (clientsResponse?.$values) {
          clientData = clientsResponse.$values;
        } else if (Array.isArray(clientsResponse)) {
          clientData = clientsResponse;
        } else if (clientsResponse && Array.isArray(clientsResponse.items)) {
          clientData = clientsResponse.items;
        }

        let transformedClients = clientData
          .map(client => ({
            id: client.clientId || client.id,
            name: client.name || client.nom || client.clientName || `Client ${client.clientId || client.id}`
          }))
          .filter(client => client.id && client.name);

        // S'assurer que le client du devis est présent dans la liste
        if (devis?.clientId && devis?.clientName) {
          const exists = transformedClients.some(
            (c) => Number(c.id) === Number(devis.clientId)
          );

          if (!exists) {
            transformedClients.push({
              id: devis.clientId,
              name: devis.clientName,
            });
          }
        }

        console.log("Clients transformés:", transformedClients);
        setClients(transformedClients);
        setClientError(transformedClients.length === 0 ? "Aucun client disponible" : "");

        // Récupération des produits
        const productsResponse = await getProducts();
        console.log("Réponse produits:", productsResponse);
        
        let productsData = [];
        if (productsResponse?.$values) {
          productsData = productsResponse.$values;
        } else if (Array.isArray(productsResponse)) {
          productsData = productsResponse;
        } else if (productsResponse && Array.isArray(productsResponse.items)) {
          productsData = productsResponse.items;
        }

        const transformedProducts = productsData
          .map(product => ({
            id: product.productId || product.id,
            name: product.name,
            price: product.price || 0,
            tvaRate: product.tvaRate || 0
          }))
          .filter(product => product.id);

        setProducts(transformedProducts);

        // Récupération des services
        const servicesResponse = await getServices();
        console.log("Réponse services:", servicesResponse);
        
        let servicesData = [];
        if (servicesResponse?.$values) {
          servicesData = servicesResponse.$values;
        } else if (Array.isArray(servicesResponse)) {
          servicesData = servicesResponse;
        } else if (servicesResponse && Array.isArray(servicesResponse.items)) {
          servicesData = servicesResponse.items;
        }

        const transformedServices = servicesData
          .map(service => ({
            id: service.serviceId || service.id,
            name: service.name,
            price: service.price || 0,
            tvaRate: service.tvaRate || 0
          }))
          .filter(service => service.id);

        setServices(transformedServices);

        // Récupération des projets
        const projectsResponse = await getProjects();
        console.log("Réponse projets:", projectsResponse);
        
        let projectsData = [];
        if (projectsResponse?.$values) {
          projectsData = projectsResponse.$values;
        } else if (Array.isArray(projectsResponse)) {
          projectsData = projectsResponse;
        } else if (projectsResponse && Array.isArray(projectsResponse.items)) {
          projectsData = projectsResponse.items;
        }

        const transformedProjects = projectsData
          .map(project => ({
            id: project.projectId || project.id,
            name: project.name,
            price: project.price || 0,
            tvaRate: project.tvaRate || 0
          }))
          .filter(project => project.id);

        setProjects(transformedProjects);

      } catch (error) {
        console.error("Error fetching data:", error);
        setClientError("Échec du chargement des données");
      } finally {
        setLoadingClients(false);
        setLoadingProducts(false);
        setLoadingServices(false);
        setLoadingProjects(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, devis?.clientId, devis?.clientName]);

  // Fonction pour obtenir le nom du client actuel
  const getCurrentClientName = () => {
    // Si rien n'est sélectionné mais que le devis a déjà un nom de client
    if (!formData.clientId) {
      return devis?.clientName || "Aucun client sélectionné";
    }
    
    const currentClient = clients.find(
      (client) => Number(client.id) === Number(formData.clientId)
    );

    // Priorité : client trouvé dans la liste, sinon clientName venant du devis
    return currentClient?.name || devis?.clientName || "Client non trouvé";
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    if (field === 'designation') {
      newItems[index][field] = value;
    } else if (field === 'type') {
      newItems[index] = {
        ...newItems[index],
        type: parseInt(value),
        productId: null,
        serviceId: null,
        projectId: null,
        designation: '',
        price: 0,
        tvaRate: 0
      };
    } else {
      const numericValue = field === 'quantity' ? Math.max(1, Number(value) || 1) : Math.max(0, Number(value) || 0);
      newItems[index][field] = numericValue;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleEntityChange = (index, entityType, entityId) => {
    if (entityId) {
      let selectedEntity = null;
      
      switch (entityType) {
        case 1: // Produit
          selectedEntity = products.find(product => product.id === entityId);
          break;
        case 2: // Service
          selectedEntity = services.find(service => service.id === entityId);
          break;
        case 3: // Projet
          selectedEntity = projects.find(project => project.id === entityId);
          break;
        default:
          break;
      }

      if (selectedEntity) {
        const newItems = [...formData.items];
        newItems[index] = {
          ...newItems[index],
          [`${entityType === 1 ? 'product' : entityType === 2 ? 'service' : 'project'}Id`]: selectedEntity.id,
          designation: selectedEntity.name,
          price: selectedEntity.price,
          tvaRate: selectedEntity.tvaRate
        };
        setFormData({ ...formData, items: newItems });
      }
    } else {
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        productId: null,
        serviceId: null,
        projectId: null,
        designation: "",
        price: 0,
        tvaRate: 0
      };
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { 
        type: 1, 
        productId: null, 
        serviceId: null, 
        projectId: null, 
        designation: "", 
        quantity: 1, 
        price: 0, 
        tvaRate: 0 
      }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateItemTotalHT = (item) => (item.quantity * item.price).toFixed(2);
  
  const calculateItemVAT = (item) => {
    const tvaPercentage = item.tvaRate === 1 ? 0.05 : item.tvaRate === 2 ? 0.07 : item.tvaRate === 3 ? 0.19 : 0;
    return (item.quantity * item.price * tvaPercentage).toFixed(2);
  };

  const calculateTotalHT = () =>
    formData.items.reduce((total, item) => total + (item.quantity || 0) * (item.price || 0), 0).toFixed(2);

  const calculateTotalVAT = () =>
    formData.items.reduce((total, item) => {
      const tvaPercentage = item.tvaRate === 1 ? 0.05 : item.tvaRate === 2 ? 0.07 : item.tvaRate === 3 ? 0.19 : 0;
      return total + (item.quantity || 0) * (item.price || 0) * tvaPercentage;
    }, 0).toFixed(2);

  const calculateTotalTTC = () =>
    (parseFloat(calculateTotalHT() || 0) + parseFloat(calculateTotalVAT() || 0)).toFixed(2);

  const getTVALabel = (tvaRate) => {
    switch (tvaRate) {
      case 0: return '0%';
      case 1: return '5%';
      case 2: return '7%';
      case 3: return '19%';
      default: return '0%';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 1: return 'Produit';
      case 2: return 'Service';
      case 3: return 'Projet';
      default: return 'Inconnu';
    }
  };

  const handleSubmit = async () => {
    if (!formData.clientId) {
      enqueueSnackbar("Veuillez sélectionner un client", { variant: "error" });
      return;
    }

    if (formData.items.length === 0) {
      enqueueSnackbar("Veuillez ajouter au moins un article", { variant: "error" });
      return;
    }

    // Validation : chaque item doit avoir exactement un ID (produit, service ou projet)
    for (let item of formData.items) {
      const idCount = [item.productId, item.serviceId, item.projectId].filter(id => id !== null).length;
      if (idCount !== 1) {
        enqueueSnackbar("Chaque article doit avoir exactement un produit, service ou projet", { variant: "error" });
        return;
      }
    }

    setLoading(true);
    try {
      const updateData = {
        id: devis.id,
        clientId: parseInt(formData.clientId),
        reference: formData.reference,
        creationDate: formData.creationDate,
        expirationDate: formData.expirationDate,
        items: formData.items.map(item => ({
          id: item.id || 0,
          type: item.type,
          productId: item.productId,
          serviceId: item.serviceId,
          projectId: item.projectId,
          designation: item.designation,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          tvaRate: item.tvaRate
        }))
      };

      console.log("Données envoyées pour modification:", updateData);
      await updateDevis(devis.id, updateData);
      setModalOpen(true);
    } catch (error) {
      console.error("Error updating devis client:", error);
      enqueueSnackbar("Erreur lors de la modification du devis", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!devis) return null;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xl" 
        fullWidth
        sx={{ 
          '& .MuiDialog-paper': { 
            borderRadius: '12px',
            width: '95%',
            maxWidth: '1200px',
            height: '95vh',
            maxHeight: '900px'
          } 
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'white',
          py: 2
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            📝 Modifier le Devis Client
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Clear />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, overflow: 'auto' }}>
          <Grid container spacing={3}>
            {/* Informations générales */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
                    Informations Générales
                  </Typography>
                  <Grid container spacing={3}>
                    {/* Client */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined" error={!!clientError}>
                        <InputLabel>Client *</InputLabel>
                        <Select
                          value={formData.clientId}
                          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                          label="Client *"
                          disabled={loadingClients || !!clientError}
                        >
                          {loadingClients ? (
                            <MenuItem disabled>
                              <CircularProgress size={24} />
                              <Typography variant="body2" sx={{ ml: 2 }}>Chargement des clients...</Typography>
                            </MenuItem>
                          ) : clients.length > 0 ? (
                            clients.map((client) => (
                              <MenuItem key={client.id} value={client.id}>
                                <Box>
                                  <Typography variant="body1">{client.name}</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    ID: {client.id}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              Aucun client disponible
                            </MenuItem>
                          )}
                        </Select>
                        {clientError && (
                          <FormHelperText error>
                            {clientError}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Affichage du nom du client sélectionné */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: 'grey.50', 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body1">
                          <strong>Client sélectionné :</strong> {getCurrentClientName()}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Référence */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Référence du devis"
                        fullWidth
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        variant="outlined"
                      />
                    </Grid>

                    {/* Date de création */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Date de création"
                        fullWidth
                        type="date"
                        value={formData.creationDate}
                        onChange={(e) => setFormData({ ...formData, creationDate: e.target.value })}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Date d'expiration */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Date d'expiration"
                        fullWidth
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Section Articles */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Articles ({formData.items.length})
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddItem}
                      sx={{ borderRadius: "8px" }}
                    >
                      Ajouter un article
                    </Button>
                  </Box>
                  
                  {formData.items.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        Aucun article ajouté. Cliquez sur &quot;Ajouter un article&quot; pour commencer.
                      </Typography>
                    </Box>
                  ) : (
                    formData.items.map((item, index) => (
                      <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CardContent>
                          <Grid container spacing={2} alignItems="flex-start">
                            {/* Type d'article */}
                            <Grid item xs={12} md={2}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select
                                  value={item.type}
                                  onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                  label="Type"
                                >
                                  <MenuItem value={1}>Produit</MenuItem>
                                  <MenuItem value={2}>Service</MenuItem>
                                  <MenuItem value={3}>Projet</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            {/* Sélection de l'entité selon le type */}
                            <Grid item xs={12} md={3}>
                              <FormControl fullWidth size="small">
                                <InputLabel>{getTypeLabel(item.type)}</InputLabel>
                                <Select
                                  value={
                                    item.type === 1 ? item.productId : 
                                    item.type === 2 ? item.serviceId : 
                                    item.projectId
                                  }
                                  onChange={(e) => handleEntityChange(index, item.type, e.target.value)}
                                  label={getTypeLabel(item.type)}
                                >
                                  <MenuItem value="">
                                    <em>Sélectionner un {getTypeLabel(item.type).toLowerCase()}</em>
                                  </MenuItem>
                                  {(item.type === 1 ? products : item.type === 2 ? services : projects).map(entity => (
                                    <MenuItem key={entity.id} value={entity.id}>
                                      {entity.name} - {entity.price} TND
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            {/* Désignation */}
                            <Grid item xs={12} md={3}>
                              <TextField
                                label="Désignation"
                                fullWidth
                                size="small"
                                value={item.designation}
                                onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                                multiline
                                maxRows={2}
                              />
                            </Grid>

                            {/* Quantité */}
                            <Grid item xs={6} md={1}>
                              <TextField
                                label="Quantité"
                                fullWidth
                                type="number"
                                size="small"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                inputProps={{ min: 1 }}
                              />
                            </Grid>

                            {/* Prix unitaire */}
                            <Grid item xs={6} md={1}>
                              <TextField
                                label="Prix unitaire"
                                fullWidth
                                type="number"
                                size="small"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>

                            {/* TVA */}
                            <Grid item xs={6} md={1}>
                              <FormControl fullWidth size="small">
                                <InputLabel>TVA</InputLabel>
                                <Select
                                  value={item.tvaRate}
                                  onChange={(e) => handleItemChange(index, 'tvaRate', e.target.value)}
                                  label="TVA"
                                >
                                  <MenuItem value={0}>0%</MenuItem>
                                  <MenuItem value={1}>5%</MenuItem>
                                  <MenuItem value={2}>7%</MenuItem>
                                  <MenuItem value={3}>19%</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            {/* Total HT et Actions */}
                            <Grid item xs={6} md={1}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                  {calculateItemTotalHT(item)} TND
                                </Typography>
                                <IconButton 
                                  onClick={() => handleRemoveItem(index)} 
                                  color="error" 
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Détails TVA et totaux par article */}
                          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={`Total HT: ${calculateItemTotalHT(item)} TND`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip 
                              label={`TVA: ${getTVALabel(item.tvaRate)} - ${calculateItemVAT(item)} TND`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                            <Chip 
                              label={`Total TTC: ${(parseFloat(calculateItemTotalHT(item)) + parseFloat(calculateItemVAT(item))).toFixed(2)} TND`}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Totaux généraux */}
          {formData.items.length > 0 && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Totaux du Devis
                </Typography>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: 'grey.50', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">Total HT:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {calculateTotalHT()} TND
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">Total TVA:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {calculateTotalVAT()} TND
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total TTC:</Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {calculateTotalTTC()} TND
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 2, backgroundColor: 'grey.50' }}>
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
            disabled={loading || formData.items.length === 0}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de succès */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "400px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
          }}
        >
          <Typography
            id="success-modal-title"
            variant="h5"
            component="h2"
            sx={{ mb: 2, color: 'success.main' }}
          >
            ✅ Devis modifié avec succès!
          </Typography>
          <Typography id="success-modal-description" variant="body1" sx={{ mb: 3 }}>
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

EditDevisClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  devis: PropTypes.shape({
    id: PropTypes.number.isRequired,
    reference: PropTypes.string.isRequired,
    creationDate: PropTypes.string,
    expirationDate: PropTypes.string,
    clientId: PropTypes.number,
    clientName: PropTypes.string,
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ])
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditDevisClientDialog;
