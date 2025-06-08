import React, { useState, useEffect } from "react";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import OrderPDF from '../pdf/OrderPDF';
import { createOrder } from 'services/orderClientService';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import DevisClientService from "services/DevisClientService"; // Chemin relatif corrigé
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CreateClientOrder = () => {
  const navigate = useNavigate();
  
  // States
  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState("");
  const [orderNumber, setOrderNumber] = useState("CMD-CLIENT-");
  const [deliveryDate, setDeliveryDate] = useState(dayjs().add(7, 'day'));
  const [paymentTerms, setPaymentTerms] = useState("30j");
  const [orderDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [notes, setNotes] = useState("");
  const [orderClientItems, setOrderClientItems] = useState([]);
  const [loading, setLoading] = useState({
    quotations: true,
    submission: false
  });
  const [error, setError] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Remplacer la fonction fetchAcceptedQuotations
const fetchAcceptedQuotations = async () => {
  try {
    const data = await DevisClientService.getDevisByStatus('Accepté');
    setAcceptedQuotations(data.$values || data);
  } catch (err) {
    setError("Échec du chargement des devis acceptés");
    setAcceptedQuotations([]);
  } finally {
    setLoading(prev => ({ ...prev, quotations: false }));
  }
};

  // Handle quotation selection
  const handleQuotationSelect = (quotationId) => {
    const selectedQuotation = acceptedQuotations.find(q => q.id === quotationId);
    
    if (selectedQuotation) {
      setSelectedQuotationId(quotationId);
      setOrderNumber(`CMD-CLIENT-${selectedQuotation.quotationNumber}`);
      
      const mappedItems = selectedQuotation.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0
      }));
      
      setOrderClientItems(mappedItems);
    }
  };

  const handlePreviewPDF = () => {
    setShowPDFPreview(true);
  };

  // Item management
  const handleAddItem = () => {
    setOrderClientItems([...orderClientItems, { 
      productId: "",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0
    }]);
  };

  const handleDeleteItem = (index) => {
    setOrderClientItems(orderClientItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderClientItems];
    newItems[index][field] = value;
    setOrderClientItems(newItems);
  };

  // Calculations
  const calculateSubTotal = () => 
    orderClientItems.reduce((total, item) => 
      total + (item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)), 0).toFixed(2);

  const calculateTotal = () => 
    orderClientItems.reduce((total, item) => 
      total + (item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)), 0).toFixed(2);

  const onSubmit = async () => {
    setLoading(prev => ({ ...prev, submission: true }));
    setError(null);
  
    try {
      const orderDto = {
        orderNumber,
        orderDate,
        deliveryDate: deliveryDate?.format('YYYY-MM-DD'),
        paymentTerms,
        notes,
        quotationId: selectedQuotationId,
        orderClientItems,
        subTotal: calculateSubTotal(),
        total: calculateTotal()
      };

      const createdOrder = await createOrder(orderDto);

      if (createdOrder) {
        setSuccessModalOpen(true);
        setTimeout(() => navigate("/client-orders"), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Échec de la création de commande");
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
          Création de Commande Client
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {loading.quotations ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Devis Accepté</InputLabel>
                <Select
                  value={selectedQuotationId}
                  onChange={(e) => handleQuotationSelect(e.target.value)}
                  label="Devis Accepté"
                >
                  <MenuItem value="">
                    <em>Sélectionner un devis</em>
                  </MenuItem>
                  {acceptedQuotations.map((quotation) => (
                    <MenuItem key={quotation.id} value={quotation.id}>
                      {quotation.quotationNumber} - {quotation.clientName} - {quotation.totalAmount} €
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Numéro de commande"
                fullWidth
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DatePicker
                label="Date de livraison"
                value={deliveryDate}
                onChange={(newValue) => setDeliveryDate(newValue)}
                minDate={dayjs().add(1, 'day')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Conditions de paiement</InputLabel>
                <Select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  label="Conditions de paiement"
                >
                  <MenuItem value="30j">30 jours fin de mois</MenuItem>
                  <MenuItem value="45j">45 jours fin de mois</MenuItem>
                  <MenuItem value="60j">60 jours fin de mois</MenuItem>
                  <MenuItem value="comptant">Paiement comptant</MenuItem>
                  <MenuItem value="acompte">Acompte + solde</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableHeaderStyle}>Produit</TableCell>
                      <TableCell sx={tableHeaderStyle}>Quantité</TableCell>
                      <TableCell sx={tableHeaderStyle}>Prix Unitaire</TableCell>
                      <TableCell sx={tableHeaderStyle}>Remise (%)</TableCell>
                      <TableCell sx={tableHeaderStyle}>Total</TableCell>
                      <TableCell sx={tableHeaderStyle}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderClientItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            value={item.productName}
                            onChange={(e) => 
                              handleItemChange(index, 'productName', e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            fullWidth
                            value={item.quantity}
                            onChange={(e) => 
                              handleItemChange(index, 'quantity', Number(e.target.value))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            fullWidth
                            value={item.unitPrice}
                            onChange={(e) => 
                              handleItemChange(index, 'unitPrice', Number(e.target.value))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            fullWidth
                            value={item.discount}
                            onChange={(e) => 
                              handleItemChange(index, 'discount', Number(e.target.value))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {(item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)).toFixed(2)} €
                        </TableCell>
                        <TableCell>
                          <Button
                            color="error"
                            onClick={() => handleDeleteItem(index)}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={handleAddItem}
                sx={{ mt: 2 }}
              >
                Ajouter un produit
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={4}>
                  <Typography variant="h6" align="right">
                    Sous-total: {calculateSubTotal()} €
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" align="right">
                    Total: {calculateTotal()} €
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={onSubmit}
                disabled={loading.submission}
                sx={{ mr: 2 }}
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
              >
                Prévisualiser PDF
              </Button>
            </Grid>
          </Grid>
        )}

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
              Aperçu de la commande client
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
              <OrderPDF 
                order={{
                  orderNumber,
                  orderDate,
                  deliveryDate: deliveryDate?.format('YYYY-MM-DD'),
                  paymentTerms,
                  items: orderClientItems,
                  subTotal: calculateSubTotal(),
                  total: calculateTotal(),
                  notes
                }}
              />
            </PDFViewer>

            <PDFDownloadLink
              document={
                <OrderPDF 
                  order={{
                    orderNumber,
                    orderDate,
                    deliveryDate: deliveryDate?.format('YYYY-MM-DD'),
                    paymentTerms,
                    items: orderClientItems,
                    subTotal: calculateSubTotal(),
                    total: calculateTotal(),
                    notes
                  }}
                />
              }
              fileName={`commande_client_${orderNumber}.pdf`}
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

        <Modal 
          open={successModalOpen} 
          onClose={() => setSuccessModalOpen(false)}
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
              🎉 Commande client créée !
            </Typography>
            <Typography 
              id="confirmation-modal-description" 
              align="center"
              sx={{ mt: 2 }}
            >
              Redirection vers la liste des commandes clients...
            </Typography>
          </Box>
        </Modal>
      </Paper>
    </DashboardLayout>
  );
};

const tableHeaderStyle = {
  fontWeight: "bold",
  backgroundColor: '#f5f5f5'
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

export default CreateClientOrder;