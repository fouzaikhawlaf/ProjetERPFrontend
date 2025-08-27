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
  Receipt
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ViewDevisDialog = ({ open, onClose, devis }) => {
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

  const handleDownloadPDF = () => {
    if (!devis) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;

    // En-tête
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`DEVIS SERVICE - ${devis.devisNumber}`, 105, 15, { align: "center" });

    // Informations générales
    doc.setFontSize(12);
    doc.text(`Date de création: ${new Date(devis.dateCreation).toLocaleDateString()}`, 20, 30);
    doc.text(`Statut: ${devis.statutDevis === 0 ? 'En Cours' : devis.statutDevis === 1 ? 'Accepté' : 'Rejeté'}`, 20, 40);
    doc.text(`Description: ${devis.description || 'Non spécifiée'}`, 20, 50);

    // Tableau des articles
    const headers = [["Désignation", "Quantité", "Prix Unitaire", "TVA", "Total HT"]];
    
    // Utiliser la fonction de normalisation pour les items
    const items = normalizeItems(devis.items);
    
    const data = items.map(item => [
      item.designation || 'N/A',
      item.quantite || 0,
      `${item.prixUnitaire || 0} TND`,
      `${item.tva || 0}%`,
      `${((item.quantite || 0) * (item.prixUnitaire || 0)).toFixed(2)} TND`
    ]);

    doc.autoTable({
      startY: 60,
      head: headers,
      body: data,
      theme: "grid"
    });

    // Totaux
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total HT: ${devis.totalHT || 0} TND`, 140, finalY);
    doc.text(`Total TVA: ${devis.totalTVA || 0} TND`, 140, finalY + 10);
    doc.text(`Total TTC: ${devis.totalTTC || 0} TND`, 140, finalY + 20);

    // Téléchargement
    doc.save(`Devis_${devis.devisNumber}.pdf`);
  };

  if (!devis) return null;

  // Normaliser les items pour éviter l'erreur "is not iterable"
  const items = normalizeItems(devis.items);

  const getStatusIcon = () => {
    switch (devis.statutDevis) {
      case 0: return <Schedule />;
      case 1: return <CheckCircle />;
      case 2: return <Cancel />;
      default: return <Description />;
    }
  };

  const getStatusColor = () => {
    switch (devis.statutDevis) {
      case 0: return 'warning';
      case 1: return 'success';
      case 2: return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = () => {
    switch (devis.statutDevis) {
      case 0: return 'En Cours';
      case 1: return 'Accepté';
      case 2: return 'Rejeté';
      default: return 'Inconnu';
    }
  };

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
            bgcolor: devis.statutDevis === 1 ? '#4caf50' : devis.statutDevis === 2 ? '#f44336' : '#ff9800', 
            mr: 2,
            width: 40, 
            height: 40
          }}>
            {getStatusIcon()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Devis {devis.devisNumber}
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
                  <Typography><strong>Référence:</strong> {devis.devisNumber || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Date de création:</strong> {new Date(devis.dateCreation).toLocaleDateString()}</Typography>
                </Grid>
                {devis.validityDate && (
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Date de validité:</strong> {devis.validityDate}</Typography>
                  </Grid>
                )}
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
              </Grid>
            </Paper>
          </Grid>

          {/* Section Description */}
          {devis.description && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} /> Description
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#f9f9f9', 
                  p: 2, 
                  borderRadius: 1,
                  borderLeft: '3px solid #1976d2'
                }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {devis.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}

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
                            {((item.quantite || 0) * (item.prixUnitaire || 0)).toFixed(2)} TND
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantite || 0} x {item.prixUnitaire || 0} TND
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
                  Aucun article dans ce devis
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Section Totaux */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} /> Totaux
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Total HT:</Typography>
                    <Typography fontWeight="bold">{devis.totalHT || '0.00'} TND</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Total TVA:</Typography>
                    <Typography fontWeight="bold">{devis.totalTVA || '0.00'} TND</Typography>
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
                      {devis.totalTTC || '0.00'} TND
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Section Dates de service */}
          {(devis.startDate || devis.endDate) && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1 }} /> Période de service
                </Typography>
                <Grid container spacing={1}>
                  {devis.startDate && (
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Date de début:</strong> {devis.startDate}</Typography>
                    </Grid>
                  )}
                  {devis.endDate && (
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Date de fin:</strong> {devis.endDate}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          )}
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
          startIcon={<Description />}
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
    devisNumber: PropTypes.string,
    dateCreation: PropTypes.string,
    validityDate: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    statutDevis: PropTypes.number,
    totalHT: PropTypes.number,
    totalTVA: PropTypes.number,
    totalTTC: PropTypes.number,
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object // Accepte aussi les objets (pour $values)
    ])
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ViewDevisDialog.defaultProps = {
  devis: null,
};

export default ViewDevisDialog;