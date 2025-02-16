import React, { useState, useEffect } from "react";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import CommandePDF from '../pdfForm/CommandePDF';
import {
  Paper,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getDevisByStatut } from "services/devisPurchaseService";

const CreateCommandeSupplier = () => {
  const navigate = useNavigate();
  
  // States
  const [acceptedDevis, setAcceptedDevis] = useState([]);
  const [selectedDevisNumber, setSelectedDevisNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState("CMD-FOURNISSEUR-");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [description, setDescription] = useState("");
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState({
    devis: true,
    submission: false
  });
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch accepted devis on mount
  useEffect(() => {
    const fetchAcceptedDevis = async () => {
      try {
        const data = await getDevisByStatut('Accepter');
        
        if (data && Array.isArray(data.$values)) {
          setAcceptedDevis(data.$values);
        } else {
          setAcceptedDevis([]);
          setError("Format de données invalide");
        }
      } catch (err) {
        setError("Échec du chargement des devis");
        setAcceptedDevis([]);
      } finally {
        setLoading(prev => ({ ...prev, devis: false }));
      }
    };
    fetchAcceptedDevis();
  }, []);

  // Handle devis selection
  const handleDevisSelect = (devisNumber) => {
    const selectedDevis = acceptedDevis.find(d => d.devisNumber === devisNumber);
    
    if (selectedDevis) {
      setSelectedDevisNumber(devisNumber);
      setOrderNumber(`CMD-${selectedDevis.devisNumber}`);
      setDeliveryDate(selectedDevis.expectedDeliveryDate?.split('T')[0] || "");
      
      const mappedItems = selectedDevis.items?.$values?.map(item => ({
        designation: item.designation || "",
        quantity: item.quantite || 0,
        unitPrice: item.prixUnitaire || 0,
        tva: item.tva || 0
      })) || [];
      
      setItems(mappedItems);
      setDescription(`Totaux importés - HT: ${selectedDevis.totalHT} TND, TVA: ${selectedDevis.totalTVA} TND, TTC: ${selectedDevis.totalTTC} TND`);
    }
  };

  const handlePreviewPDF = () => {
    setShowPDFPreview(true);
  };

  // Item management
  const handleAddItem = () => {
    setItems([...items, { 
      designation: "", 
      quantity: 0, 
      unitPrice: 0, 
      tva: 0 
    }]);
  };

  useEffect(() => {
    if(pdfGenerated) {
      const timer = setTimeout(() => {
        setShowPDFPreview(false);
        setPdfGenerated(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [pdfGenerated]);

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Calculations
  const calculateTotalHT = () => 
    items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0).toFixed(2);

  const calculateTotalVAT = () =>
    items.reduce((total, item) => 
      total + (item.quantity * item.unitPrice * (item.tva / 100)), 0).toFixed(2);

  const calculateTotalTTC = () => 
    (parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(2);

  // Form submission
  const onSubmit = async () => {
    setLoading(prev => ({ ...prev, submission: true }));
    setError(null);

    try {
      // Logique d'appel API ici
      setModalOpen(true);
      setTimeout(() => navigate("/CommandesFournisseur"), 3000);
    } catch (err) {
      setError("Échec de la création de commande");
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

  return (
    <DashboardLayout>
      <Paper elevation={4} sx={{ 
        p: 4, 
        width: "90%", 
        maxWidth: 1200, 
        margin: "auto", 
        mt: 4, 
        borderRadius: 3 
      }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Création de Commande Fournisseur
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {loading.devis ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {/* Sélection Devis */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Devis Accepté</InputLabel>
                <Select
                  value={selectedDevisNumber}
                  onChange={(e) => handleDevisSelect(e.target.value)}
                  label="Devis Accepté"
                >
                  <MenuItem value="">
                    <em>Sélectionner un devis</em>
                  </MenuItem>
                  {acceptedDevis.map((devis) => (
                    <MenuItem key={devis.id} value={devis.devisNumber}>
                      {devis.devisNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Détails Commande */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Numéro de commande"
                fullWidth
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Date de livraison prévue"
                type="date"
                fullWidth
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Tableau des articles */}
            <Grid item xs={12}>
              <table style={{ 
                width: "100%", 
                tableLayout: "fixed", 
                borderCollapse: "collapse", 
                margin: "24px 0" 
              }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Désignation</th>
                    <th style={tableHeaderStyle}>Quantité</th>
                    <th style={tableHeaderStyle}>Prix Unitaire</th>
                    <th style={tableHeaderStyle}>TVA</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={tableCellStyle}>
                        <TextField
                          fullWidth
                          value={item.designation}
                          onChange={(e) => 
                            handleItemChange(index, 'designation', e.target.value)
                          }
                        />
                      </td>
                      <td style={tableCellStyle}>
                        <TextField
                          type="number"
                          fullWidth
                          value={item.quantity}
                          onChange={(e) => 
                            handleItemChange(index, 'quantity', Number(e.target.value))
                          }
                        />
                      </td>
                      <td style={tableCellStyle}>
                        <TextField
                          type="number"
                          fullWidth
                          value={item.unitPrice}
                          onChange={(e) => 
                            handleItemChange(index, 'unitPrice', Number(e.target.value))
                          }
                        />
                      </td>
                      <td style={tableCellStyle}>
                        <TextField
                          type="number"
                          fullWidth
                          value={item.tva}
                          onChange={(e) => 
                            handleItemChange(index, 'tva', Number(e.target.value))
                          }
                        />
                      </td>
                      <td style={tableCellStyle}>
                        <Button
                          color="error"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <DeleteIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={handleAddItem}
                sx={{ mt: 2 }}
              >
                Ajouter un produit
              </Button>
            </Grid>

            {/* Totaux */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="h6">
                    Total HT: {calculateTotalHT()} TND
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">
                    Total TVA: {calculateTotalVAT()} TND
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">
                    Total TTC: {calculateTotalTTC()} TND
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Soumission */}
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={onSubmit}
                disabled={loading.submission}
              >
                {loading.submission ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Valider la commande"
                )}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePreviewPDF}
                sx={{ ml: 2 }}
              >
                Prévisualiser PDF
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Modal Aperçu PDF */}
        <Modal
          open={showPDFPreview}
          onClose={() => setShowPDFPreview(false)}
          aria-labelledby="pdf-preview-title"
          slots={{ backdrop: 'div' }}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(3px)'
              }
            }
          }}
        >
          <Box sx={previewModalStyle}>
            <Typography 
              id="pdf-preview-title" 
              variant="h6" 
              component="h2" 
              sx={{ mb: 2, textAlign: 'center' }}
            >
              Aperçu de la commande
            </Typography>
            
            <Button 
              variant="contained" 
              onClick={() => setShowPDFPreview(false)}
              sx={{ position: 'absolute', top: 10, right: 10 }}
            >
              Fermer
            </Button>

            <PDFViewer 
              width="100%" 
              height="90%"
              style={{ border: 'none' }}
            >
              <CommandePDF 
                commande={{
                  orderNumber,
                  deliveryDate,
                  items,
                  totalHT: calculateTotalHT(),
                  totalVAT: calculateTotalVAT(),
                  totalTTC: calculateTotalTTC()
                }}
              />
            </PDFViewer>

            <PDFDownloadLink
              document={
                <CommandePDF 
                  commande={{
                    orderNumber,
                    deliveryDate,
                    items,
                    totalHT: calculateTotalHT(),
                    totalVAT: calculateTotalVAT(),
                    totalTTC: calculateTotalTTC()
                  }}
                />
              }
              fileName={`commande_${orderNumber}.pdf`}
              onRender={() => setPdfGenerated(true)}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ 
                    position: 'absolute', 
                    bottom: 20, 
                    right: 20,
                    visibility: pdfGenerated ? 'hidden' : 'visible'
                  }}
                >
                  {loading ? 'Génération...' : 'Télécharger PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </Box>
        </Modal>

        {/* Modal de confirmation */}
        <Modal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)}
          aria-labelledby="confirmation-modal-title"
          aria-describedby="confirmation-modal-description"
          slots={{ backdrop: 'div' }}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)'
              }
            }
          }}
        >
          <Box sx={confirmationModalStyle}>
            <Typography 
              id="confirmation-modal-title" 
              variant="h5" 
              component="h2" 
              align="center" 
              gutterBottom
            >
              🎉 Commande créée !
            </Typography>
            <Typography 
              id="confirmation-modal-description" 
              align="center"
              sx={{ mt: 2 }}
            >
              Redirection vers la liste des commandes...
            </Typography>
          </Box>
        </Modal>

      </Paper>
    </DashboardLayout>
  );
};

// Styles constants
const tableHeaderStyle = {
  width: "20%",
  textAlign: "center",
  fontWeight: "bold",
  padding: "8px",
  borderBottom: "1px solid #ddd"
};

const tableCellStyle = {
  padding: "8px",
  textAlign: "center"
};

const previewModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none'
};

const confirmationModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none'
};

export default CreateCommandeSupplier;