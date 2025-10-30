import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  IconButton
} from "@mui/material";
import {
  Description,
  AttachMoney,
  CalendarToday,
  Person,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
  PictureAsPdf,
  Edit,
  Delete,
  Clear
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import orderSupplierService from 'services/orderSupplierService';

const CommandeDetailsDialog = ({ open, onClose, commandeId, onCommandeUpdated }) => {
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [status, setStatus] = useState('');

  // Fonction utilitaire pour normaliser les items
  const normalizeItems = (itemsData) => {
    if (Array.isArray(itemsData)) {
      return itemsData;
    } else if (itemsData && typeof itemsData === 'object' && itemsData.$values) {
      return itemsData.$values;
    } else if (itemsData && typeof itemsData === 'object') {
      return Object.values(itemsData);
    }
    return [];
  };

  useEffect(() => {
    if (commandeId) {
      loadCommande();
    }
  }, [commandeId]);

  const loadCommande = async () => {
    try {
      setLoading(true);
      const data = await orderSupplierService.getOrderById(commandeId);
      setCommande(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // ... (identique à l'ancien code)
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await orderSupplierService.deleteOrder(commandeId);
      setDeleteDialogOpen(false);
      onCommandeUpdated(); // Informer le parent de la suppression
      onClose(); // Fermer le dialog
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = () => {
    setStatus(commande.status);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    try {
      await orderSupplierService.updateOrderStatus(commandeId, status);
      setStatusDialogOpen(false);
      loadCommande(); // Recharger les données du dialog
      onCommandeUpdated(); // Informer le parent du changement
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = () => {
    // Rediriger vers la page d'édition? Ou peut-être gérer l'édition dans un autre dialog?
    // Pour l'instant, nous allons fermer le dialog et laisser le parent gérer l'édition.
    onClose();
    // Naviguer vers la page d'édition? Mais nous sommes dans un dialog.
    // Nous pourrions avoir une prop `onEdit` pour que le parent ouvre le dialog d'édition.
    // Cependant, ce n'est pas implémenté dans le code actuel.
    // Pour l'instant, nous allons simplement fermer le dialog.
  };

  const getStatusIcon = () => {
    switch (commande?.status) {
      case 'En attente': return <Schedule />;
      case 'Confirmée': return <CheckCircle />;
      case 'En cours': return <Schedule />;
      case 'Livrée': return <CheckCircle />;
      case 'Annulée': return <Cancel />;
      default: return <Description />;
    }
  };

  const getStatusColor = () => {
    switch (commande?.status) {
      case 'En attente': return 'warning';
      case 'Confirmée': return 'info';
      case 'En cours': return 'primary';
      case 'Livrée': return 'success';
      case 'Annulée': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = () => {
    return commande?.status || 'Inconnu';
  };

  // Si le dialog n'est pas ouvert, ne rien rendre
  if (!open) {
    return null;
  }

  const items = normalizeItems(commande?.items);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ 
            bgcolor: getStatusColor() === 'warning' ? '#ff9800' : 
                     getStatusColor() === 'success' ? '#4caf50' : 
                     getStatusColor() === 'error' ? '#f44336' : 
                     getStatusColor() === 'info' ? '#2196f3' : '#9e9e9e', 
            mr: 2,
            width: 40, 
            height: 40
          }}>
            {getStatusIcon()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Commande {commande?.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getStatusLabel()}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !commande ? (
          <Alert severity="warning">Commande non trouvée</Alert>
        ) : (
          <Grid container spacing={2}>
            {/* Section Informations générales */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Description sx={{ mr: 1 }} /> Informations générales
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Numéro de commande:</strong> {commande.orderNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Date de création:</strong> {commande.dateCreation ? new Date(commande.dateCreation).toLocaleDateString() : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Date de livraison:</strong> {commande.deliveryDate ? new Date(commande.deliveryDate).toLocaleDateString() : 'Non spécifiée'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Fournisseur:</strong> {commande.supplierName || 'Non spécifié'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Statut:</strong> 
                      <Chip 
                        label={getStatusLabel()} 
                        size="small" 
                        color={getStatusColor()}
                        sx={{ ml: 1 }}
                        icon={getStatusIcon()}
                        onClick={handleStatusChange}
                        style={{ cursor: 'pointer' }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Section Notes */}
            {commande.notes && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} /> Notes
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: '#f9f9f9', 
                    p: 2, 
                    borderRadius: 1,
                    borderLeft: '3px solid #1976d2'
                  }}>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                      {commande.notes}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Section Articles */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ mr: 1 }} /> Articles ({items.length})
                </Typography>
                {items.length > 0 ? (
                  <List dense>
                    {items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography fontWeight="medium">
                              {item.designation || 'Article sans nom'}
                            </Typography>
                            <Typography fontWeight="bold">
                              {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(3)} TND
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity || 0} x {item.unitPrice || 0} TND
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              TVA: {item.tva || 0}%
                            </Typography>
                          </Box>
                        </ListItem>
                        {index < items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    Aucun article dans cette commande
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Section Totaux */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1 }} /> Totaux
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Total HT:</Typography>
                      <Typography fontWeight="bold">{commande.totalHT || '0.000'} TND</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Total TVA:</Typography>
                      <Typography fontWeight="bold">{commande.totalTVA || '0.000'} TND</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      pt: 1,
                      borderTop: '2px solid #e0e0e0'
                    }}>
                      <Typography variant="h6">Total TTC:</Typography>
                      <Typography variant="h6" color="primary">
                        {commande.totalTTC || '0.000'} TND
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 1 }}
        >
          Fermer
        </Button>
        <Button 
          startIcon={<PictureAsPdf />}
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1 }}
        >
          Télécharger PDF
        </Button>
        <Button 
          startIcon={<Edit />}
          onClick={handleEdit}
          variant="outlined"
          sx={{ borderRadius: 1 }}
        >
          Modifier
        </Button>
        <Button 
          startIcon={<Delete />}
          onClick={handleDelete}
          variant="outlined"
          color="error"
          sx={{ borderRadius: 1 }}
        >
          Supprimer
        </Button>
      </DialogActions>

      {/* Dialog de confirmation de suppression */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          Confirmer la suppression
          <IconButton onClick={() => setDeleteDialogOpen(false)}>
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          Êtes-vous sûr de vouloir supprimer la commande {commande?.orderNumber} ?
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            variant="contained"
            sx={{ borderRadius: 1 }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de changement de statut */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          Changer le statut
          <IconButton onClick={() => setStatusDialogOpen(false)}>
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <TextField
            select
            fullWidth
            label="Statut"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="En attente">En attente</MenuItem>
            <MenuItem value="Confirmée">Confirmée</MenuItem>
            <MenuItem value="En cours">En cours</MenuItem>
            <MenuItem value="Livrée">Livrée</MenuItem>
            <MenuItem value="Annulée">Annulée</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setStatusDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmStatusChange} 
            color="primary"
            variant="contained"
            sx={{ borderRadius: 1 }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

CommandeDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commandeId: PropTypes.number.isRequired,
  onCommandeUpdated: PropTypes.func.isRequired,
};

export default CommandeDetailsDialog;