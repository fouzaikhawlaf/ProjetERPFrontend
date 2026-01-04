// src/layouts/Sale/Data/DeliveryNotes/components/EditDeliveryNoteDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
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
  Divider,
  Grid,
  Modal,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Delete, Clear } from "@mui/icons-material";
import { useSnackbar } from "notistack";

// ✅ PDF jsPDF (local)
import { downloadDeliveryNotePdf as downloadDeliveryNotePdfLocal } from "../pdf/DeliveryNotepdf";

// ✅ API (à adapter selon tes services réels)
import {
  getDeliveryNoteById,
  updateDeliveryNote, // ⚠️ si tu ne l'as pas, je te donne plus bas une implémentation
} from "services/deliveryNoteService";

// ✅ si tu as la liste des clients
import { getClients } from "services/ApiClient";

const normalizeItems = (itemsData) => {
  if (!itemsData) return [];
  if (Array.isArray(itemsData)) return itemsData;
  if (itemsData?.$values && Array.isArray(itemsData.$values)) return itemsData.$values; // .NET
  if (itemsData?.items && Array.isArray(itemsData.items)) return itemsData.items;
  if (typeof itemsData === "object") return [itemsData];
  return [];
};

const fmt3 = (n) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(
    Number(n || 0)
  );

const EditDeliveryNoteDialog = ({ open, onClose, deliveryNoteId, onUpdated }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState([]);

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    deliveryNumber: "",
    deliveryDate: "",
    deliveryMode: "",
    orderClientId: "",
    clientId: "",
    clientName: "",
    items: [],
    // Totaux (affichés + envoyés éventuellement)
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
  });

  // Fetch Note + Clients
  useEffect(() => {
    if (!open) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1) Fetch delivery note (avec items)
        const note = await getDeliveryNoteById(deliveryNoteId);

        const items = normalizeItems(note.items || note.Items || note.deliveryNoteItems || note.DeliveryNoteItems);

        setFormData({
          deliveryNumber: note.deliveryNumber ?? note.DeliveryNumber ?? "",
          deliveryDate: (note.deliveryDate ?? note.DeliveryDate ?? "").toString().includes("T")
            ? (note.deliveryDate ?? note.DeliveryDate).split("T")[0]
            : (note.deliveryDate ?? note.DeliveryDate ?? ""),
          deliveryMode: note.deliveryMode ?? note.DeliveryMode ?? "",
          orderClientId: note.orderClientId ?? note.OrderClientId ?? "",
          clientId: note.clientId ?? note.ClientId ?? "",
          clientName: note.clientName ?? note.ClientName ?? "",
          items: items.map((it) => ({
            id: it.id ?? it.Id ?? 0,
            productId: it.productId ?? it.ProductId ?? null,
            productName: it.productName ?? it.ProductName ?? "",
            quantity: Number(it.quantity ?? it.Quantity ?? 1),
            price: Number(it.price ?? it.Price ?? it.unitPrice ?? it.UnitPrice ?? 0),
            discount: Number(it.discount ?? it.Discount ?? 0),
            tvaRate: Number(it.tvaRate ?? it.TvaRate ?? it.TVARate ?? 0),
          })),
          totalHT: Number(note.totalHT ?? note.TotalHT ?? 0),
          totalTVA: Number(note.totalTVA ?? note.TotalTVA ?? 0),
          totalTTC: Number(note.totalTTC ?? note.TotalTTC ?? 0),
        });

        // 2) Clients (optionnel)
        setLoadingClients(true);
        try {
          const res = await getClients(1, 1000, false, false);
          let list = [];
          if (res?.clients) list = res.clients;
          else if (res?.$values) list = res.$values;
          else if (Array.isArray(res)) list = res;
          else if (Array.isArray(res?.items)) list = res.items;

          const transformed = (list || [])
            .map((c) => ({
              id: c.clientId || c.id,
              name: c.name || c.nom || c.clientName || `Client ${c.clientId || c.id}`,
            }))
            .filter((c) => c.id && c.name);

          setClients(transformed);
        } finally {
          setLoadingClients(false);
        }
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Erreur chargement bon de livraison", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [open, deliveryNoteId, enqueueSnackbar]);

  // Totaux recalculés en live (avec remise + TVA)
  const computedTotals = useMemo(() => {
    const items = formData.items || [];
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    items.forEach((it) => {
      const qty = Number(it.quantity || 0);
      const price = Number(it.price || 0);
      const discount = Number(it.discount || 0);
      const tvaRate = Number(it.tvaRate || 0);

      const brut = qty * price;
      const ht = brut * (1 - discount / 100);
      const tva = ht * (tvaRate / 100);
      const ttc = ht + tva;

      totalHT += ht;
      totalTVA += tva;
      totalTTC += ttc;
    });

    return { totalHT, totalTVA, totalTTC };
  }, [formData.items]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];

    if (["quantity", "price", "discount", "tvaRate"].includes(field)) {
      const n =
        field === "quantity"
          ? Math.max(0, Number(value || 0))
          : Math.max(0, Number(value || 0));
      newItems[index][field] = n;
    } else {
      newItems[index][field] = value;
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: 0,
          productId: null,
          productName: "",
          quantity: 1,
          price: 0,
          discount: 0,
          tvaRate: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleDownloadPdf = async () => {
    try {
      const payload = {
        deliveryNumber: formData.deliveryNumber,
        deliveryDate: formData.deliveryDate,
        deliveryMode: formData.deliveryMode,
        orderClientId: formData.orderClientId,
        clientName:
          formData.clientName ||
          clients.find((c) => Number(c.id) === Number(formData.clientId))?.name ||
          "Client",
        items: formData.items,
        totalHT: computedTotals.totalHT,
        totalTVA: computedTotals.totalTVA,
        totalTTC: computedTotals.totalTTC,
      };

      await downloadDeliveryNotePdfLocal(payload, `BL-${formData.deliveryNumber || deliveryNoteId}.pdf`);
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Erreur génération PDF", { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // ✅ payload update (à adapter selon ton backend UpdateDeliveryNoteDto)
      const updatePayload = {
        // Exemple champs:
        deliveryNumber: formData.deliveryNumber,
        deliveryDate: formData.deliveryDate,
        deliveryMode: formData.deliveryMode,
        orderClientId: Number(formData.orderClientId || 0),
        // Items avec remise + TVA
        deliveryNoteItems: (formData.items || []).map((it) => ({
          id: it.id || 0,
          productId: it.productId,
          productName: it.productName,
          quantity: Number(it.quantity || 0),
          price: Number(it.price || 0),
          discount: Number(it.discount || 0),
          tvaRate: Number(it.tvaRate || 0),
        })),
        totalHT: computedTotals.totalHT,
        totalTVA: computedTotals.totalTVA,
        totalTTC: computedTotals.totalTTC,
      };

      await updateDeliveryNote(deliveryNoteId, updatePayload);

      setSuccessModalOpen(true);
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Erreur lors de la modification du bon de livraison", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessModalOpen(false);
    onUpdated?.();
    onClose?.();
  };

  const currentClientName =
    (formData.clientId &&
      clients.find((c) => Number(c.id) === Number(formData.clientId))?.name) ||
    formData.clientName ||
    "Aucun client";

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            width: "95%",
            maxWidth: "1200px",
            height: "95vh",
            maxHeight: "900px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "primary.main",
            color: "white",
            py: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            🚚 Bon de Livraison
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Clear />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflow: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Informations générales */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: "primary.main", mb: 3 }}>
                      Informations Générales
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="N° Bon de livraison"
                          fullWidth
                          value={formData.deliveryNumber}
                          onChange={(e) => setFormData((p) => ({ ...p, deliveryNumber: e.target.value }))}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Date de livraison"
                          fullWidth
                          type="date"
                          value={formData.deliveryDate || ""}
                          onChange={(e) => setFormData((p) => ({ ...p, deliveryDate: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Commande client (ID)"
                          fullWidth
                          value={formData.orderClientId}
                          onChange={(e) => setFormData((p) => ({ ...p, orderClientId: e.target.value }))}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Mode de livraison"
                          fullWidth
                          value={formData.deliveryMode}
                          onChange={(e) => setFormData((p) => ({ ...p, deliveryMode: e.target.value }))}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Client</InputLabel>
                          <Select
                            value={formData.clientId || ""}
                            label="Client"
                            onChange={(e) => setFormData((p) => ({ ...p, clientId: e.target.value }))}
                            disabled={loadingClients}
                          >
                            {loadingClients ? (
                              <MenuItem disabled>
                                <CircularProgress size={22} />
                                <Typography sx={{ ml: 2 }}>Chargement...</Typography>
                              </MenuItem>
                            ) : (
                              clients.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                  {c.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "grey.50",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body1">
                            <strong>Client sélectionné :</strong> {currentClientName}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Articles */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h6" sx={{ color: "primary.main" }}>
                        Articles ({formData.items.length})
                      </Typography>
                      <Button variant="contained" startIcon={<Add />} onClick={handleAddItem} sx={{ borderRadius: "8px" }}>
                        Ajouter un article
                      </Button>
                    </Box>

                    {formData.items.length === 0 ? (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          Aucun article. Clique sur “Ajouter un article”.
                        </Typography>
                      </Box>
                    ) : (
                      formData.items.map((item, index) => {
                        const brut = (Number(item.quantity || 0) * Number(item.price || 0)) || 0;
                        const ht = brut * (1 - Number(item.discount || 0) / 100);
                        const tva = ht * (Number(item.tvaRate || 0) / 100);
                        const ttc = ht + tva;

                        return (
                          <Card key={index} sx={{ mb: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                            <CardContent>
                              <Grid container spacing={2} alignItems="flex-start">
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    label="Désignation"
                                    fullWidth
                                    size="small"
                                    value={item.productName || ""}
                                    onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                                    multiline
                                    maxRows={2}
                                  />
                                </Grid>

                                <Grid item xs={6} md={1.2}>
                                  <TextField
                                    label="Qté"
                                    fullWidth
                                    type="number"
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                    inputProps={{ min: 0 }}
                                  />
                                </Grid>

                                <Grid item xs={6} md={1.6}>
                                  <TextField
                                    label="PU HT"
                                    fullWidth
                                    type="number"
                                    size="small"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                    inputProps={{ min: 0, step: 0.001 }}
                                  />
                                </Grid>

                                <Grid item xs={6} md={1.6}>
                                  <TextField
                                    label="Remise %"
                                    fullWidth
                                    type="number"
                                    size="small"
                                    value={item.discount}
                                    onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                                    inputProps={{ min: 0, step: 0.01 }}
                                  />
                                </Grid>

                                <Grid item xs={6} md={1.6}>
                                  <TextField
                                    label="TVA %"
                                    fullWidth
                                    type="number"
                                    size="small"
                                    value={item.tvaRate}
                                    onChange={(e) => handleItemChange(index, "tvaRate", e.target.value)}
                                    inputProps={{ min: 0, step: 0.01 }}
                                  />
                                </Grid>

                                <Grid item xs={12} md={1.4}>
                                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                      {fmt3(ht)} TND
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveItem(index)} color="error" size="small" sx={{ mt: 0.5 }}>
                                      <Delete />
                                    </IconButton>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Chip label={`Brut HT: ${fmt3(brut)} TND`} size="small" variant="outlined" />
                                <Chip label={`Remise: ${fmt3(brut - ht)} TND`} size="small" color="secondary" variant="outlined" />
                                <Chip label={`TVA: ${fmt3(tva)} TND`} size="small" color="info" variant="outlined" />
                                <Chip label={`TTC: ${fmt3(ttc)} TND`} size="small" color="success" variant="outlined" />
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Totaux */}
              {formData.items.length > 0 && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
                        Totaux du Bon de Livraison
                      </Typography>

                      <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item xs={12} md={5}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "grey.50",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography>Total HT:</Typography>
                              <Typography fontWeight="bold">{fmt3(computedTotals.totalHT)} TND</Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography>Total TVA:</Typography>
                              <Typography fontWeight="bold">{fmt3(computedTotals.totalTVA)} TND</Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="h6">Total TTC:</Typography>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {fmt3(computedTotals.totalTTC)} TND
                              </Typography>
                            </Box>

                            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                              <Button variant="outlined" onClick={handleDownloadPdf} sx={{ borderRadius: "8px" }}>
                                Télécharger PDF
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 2, backgroundColor: "grey.50" }}>
          <Button onClick={onClose} disabled={loading} variant="outlined" sx={{ borderRadius: "8px", px: 3 }}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            {loading ? <CircularProgress size={24} /> : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal succès */}
      <Modal open={successModalOpen} onClose={handleCloseSuccess}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "420px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: "success.main" }}>
            ✅ Bon de livraison modifié !
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Les modifications ont été enregistrées avec succès.
          </Typography>
          <Button variant="contained" color="success" onClick={handleCloseSuccess}>
            Fermer
          </Button>
        </Box>
      </Modal>
    </>
  );
};

EditDeliveryNoteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deliveryNoteId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onUpdated: PropTypes.func,
};

export default EditDeliveryNoteDialog;
