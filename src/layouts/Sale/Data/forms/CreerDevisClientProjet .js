import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,FormHelperText // <-- Ajouté ici
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getClients } from "services/ApiClient";
import { getProjects } from "services/ProjectService";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useSnackbar } from "notistack";

const DevisProjetForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    clientId: "",
    reference: `DEV-PROJ-${dayjs().format('YYMMDD')}-`,
    expirationDate: dayjs().add(15, 'day'),
    items: [{ projectId: "", quantity: 1 }],
    notes: "",
    status: "DRAFT"
  });

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState({
    clients: true,
    projects: true,
    submitting: false
  });
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsResponse, projectsResponse] = await Promise.all([
          getClients(),
          getProjects({ include: 'manager' })
        ]);

        const clientsData = (
          Array.isArray(clientsResponse?.$values) ? clientsResponse.$values : []
        ).filter(c => !!c.id);

        const projectsData = (
          Array.isArray(projectsResponse?.$values) ? projectsResponse.$values : []
        ).filter(p => p.status === 'ACTIVE');

        setClients(clientsData);
        setProjects(projectsData.map(p => ({
          id: p.id,
          name: p.name,
          price: p.budget,
          tva: mapTvaType(p.tvaType),
          manager: p.manager?.name
        })));

      } catch (err) {
        enqueueSnackbar("Erreur de chargement des données", { variant: "error" });
      } finally {
        setIsLoading({ clients: false, projects: false, submitting: false });
      }
    };
    loadData();
  }, [enqueueSnackbar]);

  const mapTvaType = (tvaType) => {
    const tvaValues = { STANDARD: 20, REDUCED: 10, EXEMPT: 0 };
    return tvaValues[tvaType] || 0;
  };

  const handleProjectSelect = (index, project) => {
    const newItems = [...state.items];
    newItems[index] = {
      ...newItems[index],
      projectId: project?.id || "",
      designation: project?.name || "",
      prixUnitaire: project?.price || 0,
      tva: project?.tva || 0
    };
    setState(prev => ({ ...prev, items: newItems }));
  };

  const calculateTotals = () => {
    return state.items.reduce((acc, item) => {
      const ht = item.quantity * (item.prixUnitaire || 0);
      const tva = ht * (item.tva / 100);
      return {
        totalHT: acc.totalHT + ht,
        totalTVA: acc.totalTVA + tva,
        totalTTC: acc.totalTTC + ht + tva
      };
    }, { totalHT: 0, totalTVA: 0, totalTTC: 0 });
  };

  const { totalHT, totalTVA, totalTTC } = calculateTotals();

  const validateForm = () => {
    const newErrors = {};
    if (!state.clientId) newErrors.client = "Client requis";
    if (!state.reference) newErrors.reference = "Référence requise";
    
    state.items.forEach((item, index) => {
      if (!item.projectId) newErrors[`project-${index}`] = "Projet requis";
      if (item.quantity <= 0) newErrors[`quantity-${index}`] = "Quantité invalide";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(prev => ({ ...prev, submitting: true }));

    const payload = {
      ...state,
      expirationDate: state.expirationDate.format('YYYY-MM-DD'),
      totalHT,
      totalTVA,
      totalTTC,
      items: state.items.map(item => ({
        projectId: item.projectId,
        quantity: item.quantity,
        tva: item.tva,
        prixUnitaire: item.prixUnitaire
      }))
    };

    try {
      // await DevisClientService.create(payload);
      enqueueSnackbar("Devis créé avec succès!", { variant: "success" });
      handlePreviewPdf();
    } catch (error) {
      enqueueSnackbar("Erreur lors de la création du devis", { variant: "error" });
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const handlePreviewPdf = () => {
    const pdfDoc = generateDevisPDF(state, clients.find(c => c.id === state.clientId), state.items);
    const pdfBlob = pdfDoc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
    setPdfDialogOpen(true);
  };

  const handleDownloadPdf = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${state.reference}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClosePdfDialog = () => {
    setPdfDialogOpen(false);
    navigate("/devis");
  };

  if (isLoading.clients || isLoading.projects) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "90%",
            maxWidth: "1200px",
            margin: "auto",
            mt: 4,
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3, fontWeight: 600 }}>
            Nouveau Devis Projet
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.client}>
                <InputLabel>Client</InputLabel>
                <Select
                  value={state.clientId}
                  onChange={(e) => setState(p => ({ ...p, clientId: e.target.value }))}
                  label="Client"
                >
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} - {client.reference}
                    </MenuItem>
                  ))}
                </Select>
                {errors.client && <FormHelperText error>{errors.client}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date d'expiration"
                value={state.expirationDate}
                onChange={(date) => setState(p => ({ ...p, expirationDate: date }))}
                format="DD/MM/YYYY"
                sx={{ width: '100%' }}
              />
            </Grid>

            <Box sx={{ overflowX: 'auto', my: 4, width: '100%' }}>
              <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ width: "30%", padding: "8px", borderBottom: "1px solid #ddd" }}>Projet</th>
                    <th style={{ width: "15%", padding: "8px", borderBottom: "1px solid #ddd" }}>Quantité</th>
                    <th style={{ width: "20%", padding: "8px", borderBottom: "1px solid #ddd" }}>Prix Unitaire</th>
                    <th style={{ width: "15%", padding: "8px", borderBottom: "1px solid #ddd" }}>TVA</th>
                    <th style={{ width: "10%", padding: "8px", borderBottom: "1px solid #ddd" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "8px" }}>
                        <Autocomplete
                          options={projects}
                          getOptionLabel={(option) => option.name}
                          value={projects.find(p => p.id === item.projectId) || null}
                          onChange={(e, newValue) => handleProjectSelect(index, newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              error={!!errors[`project-${index}`]}
                              helperText={errors[`project-${index}`]}
                            />
                          )}
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...state.items];
                            newItems[index].quantity = Math.max(1, e.target.value);
                            setState(p => ({ ...p, items: newItems }));
                          }}
                          InputProps={{ inputProps: { min: 1 } }}
                          fullWidth
                          size="small"
                          error={!!errors[`quantity-${index}`]}
                          helperText={errors[`quantity-${index}`]}
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <TextField
                          value={item.prixUnitaire?.toFixed(2) || ''}
                          InputProps={{
                            readOnly: true,
                            startAdornment: <InputAdornment position="start">TND</InputAdornment>,
                          }}
                          fullWidth
                          size="small"
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <TextField
                          value={item.tva}
                          InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          fullWidth
                          size="small"
                        />
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        <IconButton 
                          onClick={() => setState(p => ({
                            ...p,
                            items: p.items.filter((_, i) => i !== index)
                          }))}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Grid container justifyContent="flex-start" sx={{ my: 2, width: '100%' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setState(p => ({
                  ...p,
                  items: [...p.items, { projectId: "", quantity: 1 }]
                }))}
              >
                Ajouter un projet
              </Button>
            </Grid>

            <Divider sx={{ my: 3, width: '100%' }} />

            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid item xs={4}>
                <Typography variant="h6">Total HT: {totalHT.toFixed(2)} TND</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">Total TVA: {totalTVA.toFixed(2)} TND</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" color="primary">
                  Total TTC: {totalTTC.toFixed(2)} TND
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, width: '100%', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<PictureAsPdfIcon />}
                onClick={handlePreviewPdf}
              >
                Prévisualiser PDF
              </Button>
              
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={isLoading.submitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                onClick={handleSubmit}
                sx={{ minWidth: 200 }}
                disabled={isLoading.submitting}
              >
                {isLoading.submitting ? 'Enregistrement...' : 'Valider le Devis'}
              </Button>
            </Box>
          </Grid>

          <Dialog
            open={pdfDialogOpen}
            onClose={handleClosePdfDialog}
            maxWidth="lg"
            fullWidth
            sx={{ '& .MuiDialog-paper': { height: '90vh' } }}
          >
            <DialogTitle>Prévisualisation du Devis</DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="Devis PDF Preview"
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePdfDialog}>Fermer</Button>
              <Button 
                onClick={handleDownloadPdf} 
                variant="contained" 
                color="primary"
                startIcon={<PictureAsPdfIcon />}
              >
                Télécharger PDF
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </LocalizationProvider>
    </DashboardLayout>
  );
};

export default DevisProjetForm;