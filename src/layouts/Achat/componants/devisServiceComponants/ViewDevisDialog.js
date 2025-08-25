import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PropTypes from 'prop-types';

const ViewDevisDialog = ({ open, onClose, devis }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Détails du Devis - {devis.devisNumber}
        <Chip 
          label={devis.statut === 0 ? 'En Cours' : devis.statut === 1 ? 'Accepté' : 'Rejeté'} 
          color={devis.statut === 0 ? 'warning' : devis.statut === 1 ? 'success' : 'error'}
          sx={{ ml: 2 }}
        />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Informations générales</Typography>
          <Typography>Référence: {devis.devisNumber}</Typography>
          <Typography>Date de création: {new Date(devis.dateCreation).toLocaleDateString()}</Typography>
          <Typography>Description: {devis.description || 'Non spécifiée'}</Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Articles</Typography>
        <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
          {devis.items && devis.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="subtitle2">{item.designation}</Typography>
              <Typography>Quantité: {item.quantite}</Typography>
              <Typography>Prix unitaire: {item.prixUnitaire} TND</Typography>
              <Typography>TVA: {item.tva}%</Typography>
              <Typography fontWeight="bold">
                Total: {(item.quantite * item.prixUnitaire).toFixed(2)} TND
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: 'right' }}>
          <Typography>Total HT: {devis.totalHT} TND</Typography>
          <Typography>Total TVA: {devis.totalTVA} TND</Typography>
          <Typography variant="h6" color="primary">
            Total TTC: {devis.totalTTC} TND
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Télécharger PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewDevisDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  devis: PropTypes.shape({
    devisNumber: PropTypes.string.isRequired,
    dateCreation: PropTypes.string.isRequired,
    statut: PropTypes.number.isRequired,
    description: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        designation: PropTypes.string.isRequired,
        quantite: PropTypes.number.isRequired,
        prixUnitaire: PropTypes.number.isRequired,
        tva: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalHT: PropTypes.number.isRequired,
    totalTVA: PropTypes.number.isRequired,
    totalTTC: PropTypes.number.isRequired,
  }).isRequired,
};

export default ViewDevisDialog;