import React from 'react';
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
  IconButton,
  Chip,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import {
  Clear,
  Description,
  AttachMoney,
  CalendarToday,
  Person,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
  PictureAsPdf
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ViewDevisDialog = ({ open, onClose, devis }) => {
  // Fonction utilitaire améliorée pour normaliser les items
  const normalizeItems = (itemsData) => {
    if (!itemsData) return [];
    
    if (Array.isArray(itemsData)) {
      return itemsData;
    } else if (itemsData && typeof itemsData === 'object' && itemsData.$values) {
      return itemsData.$values;
    } else if (itemsData && typeof itemsData === 'object') {
      // Si c'est un objet simple, le convertir en tableau
      return [itemsData];
    }
    return [];
  };

  const handleDownloadPDF = () => {
    if (!devis) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;

    // En-tête
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`DEVIS - ${devis.reference || 'N/A'}`, 105, 15, { align: "center" });

    // Informations générales
    doc.setFontSize(10);
    doc.text(`Client: ${devis.clientName || 'N/A'}`, 20, 30);
    doc.text(`Date de création: ${new Date(devis.creationDate).toLocaleDateString()}`, 20, 37);
    doc.text(`Date d'expiration: ${devis.expirationDate ? new Date(devis.expirationDate).toLocaleDateString() : 'N/A'}`, 20, 44);
    doc.text(`Statut: ${getStatusLabel()}`, 20, 51);

    // Tableau des articles
    const headers = [["Désignation", "Quantité", "Prix Unitaire", "TVA", "Total HT"]];
    
    // Utiliser la fonction de normalisation pour les items
    const items = normalizeItems(devis.items);
    
    const data = items.map(item => [
      item.designation || 'N/A',
      item.quantity || 0,
      `${item.price || 0} TND`,
      `${getTVALabel(item.tvaRate)}`,
      `${((item.quantity || 0) * (item.price || 0)).toFixed(2)} TND`
    ]);

    doc.autoTable({
      startY: 60,
      head: headers,
      body: data,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Totaux
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Total HT: ${devis.totalHT?.toFixed(2) || '0.00'} TND`, 140, finalY);
    doc.text(`Total TVA: ${devis.totalTVA?.toFixed(2) || '0.00'} TND`, 140, finalY + 8);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total TTC: ${devis.totalTTC?.toFixed(2) || '0.00'} TND`, 140, finalY + 18);

    // Téléchargement
    doc.save(`Devis_${devis.reference || devis.id}.pdf`);
  };

  if (!devis) return null;

  // Normaliser les items pour éviter l'erreur "is not iterable"
  const items = normalizeItems(devis.items);

  const getStatusIcon = () => {
    const status = devis.status;
    switch (status) {
      case 0: return <Schedule />; // Brouillon
      case 1: return <CheckCircle />; // En attente
      case 2: return <CheckCircle />; // Accepté
      case 3: return <Cancel />; // Rejeté
      case 4: return <CheckCircle />; // Archivé
      case 5: return <CheckCircle />; // Converti
      default: return <Description />;
    }
  };

  const getStatusColor = () => {
    const status = devis.status;
    switch (status) {
      case 0: return 'default'; // Brouillon
      case 1: return 'warning'; // En attente
      case 2: return 'success'; // Accepté
      case 3: return 'error'; // Rejeté
      case 4: return 'secondary'; // Archivé
      case 5: return 'primary'; // Converti
      default: return 'default';
    }
  };

  const getStatusLabel = () => {
    const status = devis.status;
    switch (status) {
      case 0: return 'Brouillon';
      case 1: return 'En attente';
      case 2: return 'Accepté';
      case 3: return 'Rejeté';
      case 4: return 'Archivé';
      case 5: return 'Converti en commande';
      default: return 'Inconnu';
    }
  };

  const getTVALabel = (tvaRate) => {
    switch (tvaRate) {
      case 0: return '0%';
      case 1: return '5%';
      case 2: return '7%';
      case 3: return '19%';
      default: return '0%';
    }
  };

  console.log("Détails du devis :", devis);
  console.log("Items normalisés :", items);

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
            bgcolor: 
              devis.status === 2 ? '#4caf50' : // Accepté
              devis.status === 3 ? '#f44336' : // Rejeté
              devis.status === 1 ? '#ff9800' : // En attente
              devis.status === 4 ? '#9e9e9e' : // Archivé
              devis.status === 5 ? '#2196f3' : // Converti
              '#757575', // Brouillon
            mr: 2,
            width: 40, 
            height: 40
          }}>
            {getStatusIcon()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Devis {devis.reference}
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
        <Grid container spacing={2}>
          {/* Section Informations générales */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} /> Informations générales
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Référence:</strong> {devis.reference || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Date de création:</strong> {new Date(devis.creationDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Date d&#39;expiration:</strong> {devis.expirationDate ? new Date(devis.expirationDate).toLocaleDateString() : 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Statut:</strong> 
                    <Chip 
                      label={getStatusLabel()} 
                      size="small" 
                      color={getStatusColor()}
                      sx={{ ml: 1 }}
                      icon={getStatusIcon()}
                    />
                  </Typography>
                </Grid>
                {devis.clientName && (
                  <Grid item xs={12}>
                    <Typography><strong>Client:</strong> {devis.clientName}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Typography><strong>Total HT:</strong> {devis.totalHT?.toFixed(2) || '0.00'} TND</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Total TVA:</strong> {devis.totalTVA?.toFixed(2) || '0.00'} TND</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Total TTC:</strong> {devis.totalTTC?.toFixed(2) || '0.00'} TND</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Section Articles */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
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
                            {((item.quantity || 0) * (item.price || 0)).toFixed(2)} TND
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity || 0} x {item.price || 0} TND
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            TVA: {getTVALabel(item.tvaRate)}
                          </Typography>
                        </Box>
                        {/* Affichage du type d'item */}
                        {item.type !== undefined && (
                          <Box sx={{ width: '100%', mt: 0.5 }}>
                            <Chip 
                              label={`Type: ${item.type === 1 ? 'Produit' : item.type === 2 ? 'Service' : 'Projet'}`}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </Box>
                        )}
                      </ListItem>
                      {index < items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Aucun article dans ce devis
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Section Totaux détaillée */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} /> Récapitulatif financier
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Sous-total HT:</Typography>
                    <Typography>{devis.totalHT?.toFixed(2) || '0.00'} TND</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>TVA totale:</Typography>
                    <Typography>{devis.totalTVA?.toFixed(2) || '0.00'} TND</Typography>
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
                      {devis.totalTTC?.toFixed(2) || '0.00'} TND
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
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
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1 }}
          startIcon={<PictureAsPdf />}
        >
          Télécharger PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewDevisDialog.propTypes = {
  devis: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reference: PropTypes.string,
    creationDate: PropTypes.string,
    expirationDate: PropTypes.string,
    status: PropTypes.number,
    totalHT: PropTypes.number,
    totalTVA: PropTypes.number,
    totalTTC: PropTypes.number,
    clientName: PropTypes.string,
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ])
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ViewDevisDialog.defaultProps = {
  devis: null,
};

export default ViewDevisDialog;