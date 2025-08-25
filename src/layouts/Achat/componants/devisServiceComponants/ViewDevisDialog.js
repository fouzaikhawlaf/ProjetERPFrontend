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
    doc.text(`Statut: ${devis.statut === 0 ? 'En Cours' : devis.statut === 1 ? 'Accepté' : 'Rejeté'}`, 20, 40);
    doc.text(`Description: ${devis.description || 'Non spécifiée'}`, 20, 50);

    // Tableau des articles
    const headers = [["Désignation", "Quantité", "Prix Unitaire", "TVA", "Total HT"]];
    const data = devis.items.map(item => [
      item.designation,
      item.quantite,
      `${item.prixUnitaire} TND`,
      `${item.tva}%`,
      `${(item.quantite * item.prixUnitaire).toFixed(2)} TND`
    ]);

    doc.autoTable({
      startY: 60,
      head: headers,
      body: data,
      theme: "grid"
    });

    // Totaux
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total HT: ${devis.totalHT} TND`, 140, finalY);
    doc.text(`Total TVA: ${devis.totalTVA} TND`, 140, finalY + 10);
    doc.text(`Total TTC: ${devis.totalTTC} TND`, 140, finalY + 20);

    // Téléchargement
    doc.save(`Devis_${devis.devisNumber}.pdf`);
  };

  if (!devis) return null;

  const getStatusIcon = () => {
    switch (devis.statut) {
      case 0: return <Schedule />;
      case 1: return <CheckCircle />;
      case 2: return <Cancel />;
      default: return <Description />;
    }
  };

  const getStatusColor = () => {
    switch (devis.statut) {
      case 0: return 'warning';
      case 1: return 'success';
      case 2: return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = () => {
    switch (devis.statut) {
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
            bgcolor: devis.statut === 1 ? '#4caf50' : devis.statut === 2 ? '#f44336' : '#ff9800', 
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
                <Receipt sx={{ mr: 1 }} /> Articles ({devis.items?.length || 0})
              </Typography>
              <List dense>
                {devis.items?.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography fontWeight="medium">
                          {item.designation || 'Article sans nom'}
                        </Typography>
                        <Typography fontWeight="bold">
                          {(item.quantite * item.prixUnitaire).toFixed(2)} TND
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantite} x {item.prixUnitaire} TND
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          TVA: {item.tva}%
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < devis.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
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
    statut: PropTypes.number,
    totalHT: PropTypes.number,
    totalTVA: PropTypes.number,
    totalTTC: PropTypes.number,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        designation: PropTypes.string,
        quantite: PropTypes.number,
        prixUnitaire: PropTypes.number,
        tva: PropTypes.number,
        serviceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ViewDevisDialog.defaultProps = {
  devis: null,
};

export default ViewDevisDialog;