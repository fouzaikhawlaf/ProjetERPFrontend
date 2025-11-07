import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import orderSupplierService from "services/orderSupplierService";
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
  Snackbar,
  CardContent,
  Card,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getDevisByStatut } from "services/devisPurchaseService";

const CreateCommandeSupplier = () => {
  const navigate = useNavigate();

  // States
  const [acceptedDevis, setAcceptedDevis] = useState([]);
  const [selectedDevisNumber, setSelectedDevisNumber] = useState("");
  const [selectedDevisId, setSelectedDevisId] = useState(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const [orderNumber, setOrderNumber] = useState("CMD-FOURNISSEUR-");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [description, setDescription] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState({ devis: true, submission: false });
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch accepted devis on mount
  useEffect(() => {
    const fetchAcceptedDevis = async () => {
      try {
        const data = await getDevisByStatut("Accepter");
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
        setLoading((prev) => ({ ...prev, devis: false }));
      }
    };
    fetchAcceptedDevis();
  }, []);

  // Helpers pour items
  const newItem = () => ({
    productId: 0,
    designation: "",
    quantity: 1,
    unitPrice: 0,
    tva: 19,
  });

  const updateItem = (idx, key, value) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, [key]: key === "designation" ? value : Number(value) } : it
      )
    );
  };

  const addItemRow = () => setItems((prev) => [...prev, newItem()]);
  const removeItemRow = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  // Handle devis selection
  const handleDevisSelect = (devisNumber) => {
    const selectedDevis = acceptedDevis.find((d) => d.devisNumber === devisNumber);

    if (selectedDevis) {
      setSelectedDevisNumber(devisNumber);
      setSelectedDevisId(selectedDevis.id);
      setSelectedSupplierName(selectedDevis.supplierName || "Non spécifié");
      setOrderNumber(`CMD-${selectedDevis.devisNumber}`);
      setDeliveryDate(selectedDevis.expectedDeliveryDate?.split("T")[0] || "");

      const mappedItems =
        selectedDevis.items?.$values?.map((item) => ({
          productId: item.productId || 0,
          designation: item.designation || "",
          quantity: Number(item.quantite || 0),
          unitPrice: Number(item.prixUnitaire || 0),
          tva: Number(item.tva || 0),
        })) || [];

      setItems(mappedItems.length ? mappedItems : [newItem()]);
      setDescription(
        `Totaux importés - HT: ${selectedDevis.totalHT} TND, TVA: ${selectedDevis.totalTVA} TND, TTC: ${selectedDevis.totalTTC} TND`
      );
    } else {
      setSelectedDevisNumber("");
      setSelectedDevisId(null);
      setSelectedSupplierName("");
      setItems([newItem()]);
      setDescription("");
      setOrderNumber("CMD-FOURNISSEUR-");
    }
  };

  // PDF
  const generatePDFBlob = () => {
    if (!selectedDevisId) {
      alert("Veuillez sélectionner un devis avant de générer le PDF");
      return null;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 15;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`COMMANDE FOURNISSEUR N° ${orderNumber}`, pageWidth / 2, 20, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Société Shamash IT", 140, 15);
      doc.text("Adresse: étage B03,Centre Urbain Nord, Imm cercle des bureaux", 140, 20);
      doc.text("Tél: +216  29 511 251", 140, 25);
      doc.text("Email: contact@shamash-it.com", 140, 30);

      doc.setFont("helvetica", "bold");
      doc.text("Fournisseur:", 10, 40);
      doc.setFont("helvetica", "normal");
      doc.text(selectedSupplierName || "Non spécifié", 40, 40);

      doc.setFont("helvetica", "bold");
      doc.text("Date création:", 10, 47);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString(), 40, 47);

      doc.setFont("helvetica", "bold");
      doc.text("Date livraison:", 10, 54);
      doc.setFont("helvetica", "normal");
      doc.text(deliveryDate || "Non spécifiée", 40, 54);

      doc.setFont("helvetica", "bold");
      doc.text("Référence:", 10, 61);
      doc.setFont("helvetica", "normal");
      doc.text(orderNumber, 40, 61);

      yPosition = 70;

      if (description) {
        doc.setFontSize(12);
        doc.text("Description:", 10, yPosition);
        doc.setFontSize(10);
        const splitDescription = doc.splitTextToSize(description, 180);
        doc.text(splitDescription, 10, yPosition + 7);
        yPosition += splitDescription.length * 5 + 15;
      }

      if (notes) {
        doc.setFontSize(12);
        doc.text("Notes:", 10, yPosition);
        doc.setFontSize(10);
        const splitNotes = doc.splitTextToSize(notes, 180);
        doc.text(splitNotes, 10, yPosition + 7);
        yPosition += splitNotes.length * 5 + 15;
      }

      // Header tableau
      doc.setFont("helvetica", "bold");
      doc.setFillColor(41, 128, 185);
      doc.setTextColor(255, 255, 255);
      doc.rect(10, yPosition, 190, 8, "F");
      doc.text("N°", 15, yPosition + 5);
      doc.text("Désignation du Produit", 30, yPosition + 5);
      doc.text("Qté", 110, yPosition + 5);
      doc.text("P.U. HT", 130, yPosition + 5);
      doc.text("TVA", 160, yPosition + 5);
      doc.text("Total HT", 175, yPosition + 5);

      yPosition += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      items.forEach((item, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.text((index + 1).toString(), 15, yPosition + 5);
        const productName = item.designation || "Produit non spécifié";
        const designationLines = doc.splitTextToSize(productName, 70);
        doc.text(designationLines, 30, yPosition + 5);
        doc.text(Number(item.quantity || 0).toFixed(2), 110, yPosition + 5);
        doc.text(`${Number(item.unitPrice || 0).toFixed(3)} TND`, 130, yPosition + 5); // Ligne corrigée
        doc.text(`${Number(item.tva || 0).toFixed(2)}%`, 160, yPosition + 5);
        doc.text(`${(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(3)} TND`, 175, yPosition + 5);

        yPosition += Math.max(10, designationLines.length * 5);
        doc.line(10, yPosition + 2, 200, yPosition + 2);
        yPosition += 5;
      });

      const totalsY = yPosition + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total HT: ${calculateTotalHT()} TND`, 140, totalsY);
      doc.text(`Total TVA: ${calculateTotalVAT()} TND`, 140, totalsY + 7);
      doc.text(`Total TTC: ${calculateTotalTTC()} TND`, 140, totalsY + 14);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Société Shamash IT - RCS Tunis B123456 - TVA FR40123456789", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

      return doc.output("blob");
    } catch (error) {
      console.error("Erreur de génération PDF:", error);
      alert("Erreur lors de la génération du PDF : " + error.message);
      return null;
    }
  };

  // Preview & Download PDF
  const handlePreviewPDF = () => {
    const blob = generatePDFBlob();
    if (blob) {
      setPdfBlob(blob);
      setPdfPreviewOpen(true);
    }
  };

  const handleDownloadPDF = () => {
    const blob = generatePDFBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Commande_${orderNumber.replace(/[/]/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: "PDF téléchargé avec succès!", severity: "success" });
    }
  };

  // Calculs
  const calculateTotalHT = () =>
    items.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0).toFixed(3);
  const calculateTotalVAT = () =>
    items.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.unitPrice || 0) * (Number(item.tva || 0) / 100), 0).toFixed(3);
  const calculateTotalTTC = () => (parseFloat(calculateTotalHT()) + parseFloat(calculateTotalVAT())).toFixed(3);

  // Soumission via devis - CORRIGÉ
  const onSubmitWithDevis = async () => {
    if (!selectedDevisId) {
      setSnackbar({ open: true, message: "Veuillez sélectionner un devis", severity: "error" });
      return;
    }

    if (!orderNumber.trim()) {
      setSnackbar({ open: true, message: "Veuillez saisir un numéro de commande", severity: "error" });
      return;
    }

    const invalidItems = items.filter((item) => !item.designation.trim());
    if (invalidItems.length > 0) {
      setSnackbar({ open: true, message: "Veuillez remplir la désignation pour tous les produits", severity: "error" });
      return;
    }

    setLoading((prev) => ({ ...prev, submission: true }));
    setError(null);

    try {
      const payload = {
        orderNumber: orderNumber.trim(),
        expectedDeliveryDate: deliveryDate || null,
        notes: notes || "",
        items: items.map((item) => ({
          productId: item.productId || 0,
          designation: item.designation.trim(),
          quantity: Number(item.quantity || 0),
          price: Number(item.unitPrice || 0),
          tva: Number(item.tva || 0),
        })),
      };

      console.log("📤 Envoi du payload:", { devisId: selectedDevisId, payload });

      const createdOrder = await orderSupplierService.createOrderFromDevis(selectedDevisId, payload);

      if (createdOrder) {
        setModalOpen(true);
        setSnackbar({ open: true, message: "Commande créée avec succès depuis le devis!", severity: "success" });
        setTimeout(() => navigate("/CommandesFournisseur"), 3000);
      }
    } catch (err) {
      const errorMessage = err.message || "Échec de la création de commande depuis le devis";
      setError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
      console.error("❌ Erreur complète:", err);
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  const onSubmit = async () => {
    if (selectedDevisId) {
      await onSubmitWithDevis();
    } else {
      setSnackbar({ open: true, message: "Veuillez sélectionner un devis pour créer une commande", severity: "warning" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    if (modalOpen) {
      const timer = setTimeout(() => {
        navigate("/Achat/Commande/Liste");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modalOpen, navigate]);

  return (
    <DashboardLayout>
      <Paper elevation={4} sx={{ p: 4, width: "90%", maxWidth: 1200, margin: "auto", mt: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Création de Commande Fournisseur
        </Typography>
        <Typography variant="subtitle1" align="center" color="primary" sx={{ mb: 2 }}>
          {selectedDevisId ? "✓ Conversion depuis devis accepté" : "Sélectionnez un devis accepté pour créer une commande"}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {loading.devis ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
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
                <Select value={selectedDevisNumber} onChange={(e) => handleDevisSelect(e.target.value)} label="Devis Accepté">
                  <MenuItem value="">
                    <em>Sélectionner un devis</em>
                  </MenuItem>
                  {acceptedDevis.map((devis) => (
                    <MenuItem key={devis.id} value={devis.devisNumber}>
                      {devis.devisNumber} - {devis.supplierName || `Fournisseur ${devis.supplierId}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedDevisId && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Le devis sélectionné sera converti en commande automatiquement
                  {selectedSupplierName && (
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                      Fournisseur: {selectedSupplierName}
                    </Typography>
                  )}
                </Alert>
              )}
            </Grid>

            {/* Détails Commande */}
            {selectedDevisId && (
              <>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
                        Détails de la Commande
                      </Typography>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.secondary" }}>
                            Fournisseur: <span style={{ fontWeight: 700 }}>{selectedSupplierName}</span>
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: "text.primary", fontWeight: 600 }}>
                              Numéro de commande
                            </Typography>
                            <TextField
                              fullWidth
                              value={orderNumber}
                              onChange={(e) => setOrderNumber(e.target.value)}
                              placeholder="Ex : CMD-2025-001"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: "text.primary", fontWeight: 600 }}>
                              Date de livraison prévue
                            </Typography>
                            <TextField type="date" fullWidth value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Articles (tableau HTML pur) */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Articles
                  </Typography>

                  <Box component={Paper} variant="outlined">
                    <Box sx={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
                        <thead>
                          <tr style={{ backgroundColor: "white" }}>
                            <th style={thStyleLeft}>Désignation du Produit</th>
                            <th style={thStyleCenter}>Quantité</th>
                            <th style={thStyleCenter}>Prix Unitaire (TND)</th>
                            <th style={thStyleCenter}>TVA (%)</th>
                            <th style={thStyleCenter}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={tdStyle}>
                                <TextField
                                  fullWidth
                                  value={item.designation}
                                  onChange={(e) => updateItem(index, "designation", e.target.value)}
                                  placeholder="Ex: Laptop Dell 15"
                                  variant="standard"
                                  error={!item.designation}
                                  helperText={!item.designation ? "Requis" : ""}
                                />
                              </td>
                              <td style={{ ...tdStyle, textAlign: "center" }}>
                                <TextField
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                  inputProps={{ min: 0, step: 1 }}
                                  variant="standard"
                                  sx={{ width: 80 }}
                                />
                              </td>
                              <td style={{ ...tdStyle, textAlign: "center" }}>
                                <TextField
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                                  inputProps={{ min: 0, step: 0.001 }}
                                  variant="standard"
                                  sx={{ width: 100 }}
                                />
                              </td>
                              <td style={{ ...tdStyle, textAlign: "center" }}>
                                <TextField
                                  type="number"
                                  value={item.tva}
                                  onChange={(e) => updateItem(index, "tva", e.target.value)}
                                  inputProps={{ min: 0, step: 0.1 }}
                                  variant="standard"
                                  sx={{ width: 80 }}
                                />
                              </td>
                              <td style={{ ...tdStyle, textAlign: "center" }}>
                                <Tooltip title="Supprimer la ligne">
                                  <IconButton onClick={() => removeItemRow(index)} size="small" color="error">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={5} style={{ padding: "12px" }}>
                              <Button startIcon={<AddCircleIcon />} onClick={addItemRow}>
                                Ajouter un produit
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                </Grid>
              </>
            )}

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes (optionnel)"
                fullWidth
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mt: 2 }}
                placeholder="Ajoutez des notes supplémentaires pour la commande..."
              />
            </Grid>

            {/* Totaux */}
            {items.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6">Total HT: {calculateTotalHT()} TND</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6">Total TVA: {calculateTotalVAT()} TND</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6">Total TTC: {calculateTotalTTC()} TND</Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* Boutons d'action */}
            <Grid item xs={12} sx={{ textAlign: "right", mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={onSubmit}
                disabled={loading.submission || !selectedDevisId}
              >
                {loading.submission ? <CircularProgress size={24} color="inherit" /> : "Convertir le devis en commande"}
              </Button>
              {selectedDevisId && (
                <Button variant="contained" color="secondary" onClick={handlePreviewPDF} sx={{ ml: 2 }}>
                  Prévisualiser PDF
                </Button>
              )}
            </Grid>
          </Grid>
        )}

        {/* Modal Aperçu PDF */}
        <Modal
          open={pdfPreviewOpen}
          onClose={() => setPdfPreviewOpen(false)}
          aria-labelledby="pdf-preview-title"
          slots={{ backdrop: "div" }}
          slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(3px)" } } }}
        >
          <Box sx={previewModalStyle}>
            <Typography id="pdf-preview-title" variant="h6" component="h2" sx={{ mb: 2, textAlign: "center" }}>
              Aperçu de la commande - {orderNumber}
              {selectedSupplierName && (
                <Typography variant="subtitle1" color="text.secondary">
                  Fournisseur: {selectedSupplierName}
                </Typography>
              )}
            </Typography>
            <Button variant="contained" onClick={() => setPdfPreviewOpen(false)} sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
              Fermer
            </Button>
            {pdfBlob && <iframe src={URL.createObjectURL(pdfBlob)} width="100%" height="90%" style={{ border: "none" }} title="Aperçu PDF de la commande" />}
            <Button variant="contained" color="success" sx={{ position: "absolute", bottom: 20, right: 20 }} onClick={handleDownloadPDF}>
              Télécharger PDF
            </Button>
          </Box>
        </Modal>

        {/* Modal de confirmation */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="confirmation-modal-title"
          aria-describedby="confirmation-modal-description"
          slots={{ backdrop: "div" }}
          slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(2px)" } } }}
        >
          <Box sx={confirmationModalStyle}>
            <Typography id="confirmation-modal-title" variant="h5" component="h2" align="center" gutterBottom>
              🎉 Commande créée !
            </Typography>
            <Typography id="confirmation-modal-description" align="center" sx={{ mt: 2 }}>
              La commande a été créée avec succès depuis le devis.
              {selectedSupplierName && (
                <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                  Fournisseur: {selectedSupplierName}
                </Typography>
              )}
              <br />
              Redirection vers la liste des commandes...
            </Typography>
          </Box>
        </Modal>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </DashboardLayout>
  );
};

// Styles pour le tableau HTML
const thBase = {
  fontWeight: "bold",
  color: "black", // Changer la couleur en noir
  padding: "10px 8px",
  borderBottom: "1px solid #1565c0",
};
const thStyleLeft = { ...thBase, textAlign: "left" };
const thStyleCenter = { ...thBase, textAlign: "center" };

const tdStyle = {
  padding: "8px",
  verticalAlign: "middle",
};

const previewModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  height: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: "none",
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
  outline: "none",
};

export default CreateCommandeSupplier;
