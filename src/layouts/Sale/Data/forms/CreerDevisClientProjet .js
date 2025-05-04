import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  InputAdornment,
  FormHelperText
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
    reference: `DEV-PROJ-${dayjs().format('YYMMDD')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    expirationDate: dayjs().add(15, 'day'),
    items: [{ projectId: "", quantity: 1 }],
    notes: "",
    status: "DRAFT"
  });

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState({
    clients: true,
    projects: true,
    submitting: false
  });
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();

  const projectsMap = useMemo(() => 
    new Map(projects.map(p => [p.id, p])),
    [projects]
  );

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [clientsResponse, projectsResponse] = await Promise.all([
          getClients(1, 1000),
          getProjects()
        ]);

        if (isMounted) {
          const clientsData = (clientsResponse.clients || [])
            .filter(c => c?.id)
            .map(client => ({
              id: String(client.id),
              name: client.name || client.companyName || 'Client sans nom',
              reference: client.reference || client.clientCode || 'N/A',
              email: client.email || client.contactEmail || 'Non spécifié',
              rawData: client
            }));

          const projectsData = (projectsResponse || [])
            .filter(p => p.status === 0)
            .map(project => ({
              id: String(project.id),
              name: project.name || 'Projet sans nom',
              price: parseFloat(project.budget) || parseFloat(project.actualCost) || 0,
              tva: 20,
              startDate: dayjs(project.startDate),
              endDate: dayjs(project.endDate),
              manager: project.manager?.fullName || 
                      project.employees?.$values?.[0]?.name || 
                      'Non assigné',
              description: project.description || '',
              riskLevel: project.riskLevel || 0,
              rawData: project
            }));

          setClients(clientsData);
          setProjects(projectsData);

          if (projectsData.length === 0) {
            enqueueSnackbar("Aucun projet actif disponible", { variant: "warning" });
          }
        }
      } catch (error) {
        enqueueSnackbar(`Erreur de chargement: ${error.message}`, { variant: "error" });
      } finally {
        if (isMounted) {
          setIsLoading(prev => ({
            ...prev,
            clients: false,
            projects: false
          }));
        }
      }
    };

    loadData();
    return () => { isMounted = false };
  }, [enqueueSnackbar]);

  const handleProjectSelect = useCallback((index, project) => {
    const newItems = [...state.items];
    newItems[index] = {
      ...newItems[index],
      projectId: project?.id || "",
      designation: project?.name || "",
      prixUnitaire: project?.price || 0,
      tva: project?.tva || 20
    };
    setState(prev => ({ ...prev, items: newItems }));
  }, [state.items]);

  const calculateTotals = useMemo(() => {
    return state.items.reduce((acc, item) => {
      const ht = item.quantity * (item.prixUnitaire || 0);
      const tva = ht * (item.tva / 100);
      return {
        totalHT: acc.totalHT + ht,
        totalTVA: acc.totalTVA + tva,
        totalTTC: acc.totalTTC + ht + tva
      };
    }, { totalHT: 0, totalTVA: 0, totalTTC: 0 });
  }, [state.items]);

  const { totalHT, totalTVA, totalTTC } = calculateTotals;

  const validateForm = () => {
    const newErrors = {};
    
    if (!state.clientId || !clients.some(c => c.id === state.clientId)) {
      newErrors.client = "Sélectionnez un client valide";
    }

    state.items.forEach((item, index) => {
      const project = projectsMap.get(item.projectId);
      
      if (!project || project.rawData.status !== 0) {
        newErrors[`project-${index}`] = "Projet non valide ou inactif";
      }
      
      if (item.quantity <= 0 || item.quantity > 1000) {
        newErrors[`quantity-${index}`] = "Quantité invalide (1-1000)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      enqueueSnackbar("Veuillez corriger les erreurs du formulaire", { variant: "warning" });
      return;
    }

    setIsLoading(prev => ({ ...prev, submitting: true }));

    const payload = {
      ...state,
      expirationDate: state.expirationDate.format('YYYY-MM-DD'),
      totalHT: totalHT.toFixed(2),
      totalTVA: totalTVA.toFixed(2),
      totalTTC: totalTTC.toFixed(2),
      items: state.items.map(item => ({
        projectId: item.projectId,
        quantity: item.quantity,
        tva: item.tva,
        prixUnitaire: item.prixUnitaire
      }))
    };

    try {
      enqueueSnackbar("Devis créé avec succès !", { variant: "success" });
      handlePreviewPdf();
    } catch (error) {
      enqueueSnackbar("Échec de la création du devis", { variant: "error" });
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const handlePreviewPdf = async () => {
    try {
      const mockPdfUrl = "https://example.com/dummy.pdf";
      setPdfUrl(mockPdfUrl);
      setPdfDialogOpen(true);
    } catch (error) {
      enqueueSnackbar("Erreur lors de la génération du PDF", { variant: "error" });
    }
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
          <Typography variant="h6" sx={{ ml: 2 }}>Chargement des données...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper elevation={4} sx={{
          p: 4,
          width: "90%",
          maxWidth: "1200px",
          margin: "auto",
          mt: 4,
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        }}>
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
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) return <em>Sélectionnez un client</em>;
                    const client = clients.find(c => c.id === selected);
                    return client ? `${client.name} (${client.reference})` : '';
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Sélectionnez un client</em>
                  </MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1">{client.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {client.reference} • {client.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.client && <FormHelperText error>{errors.client}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Référence"
                value={state.reference}
                InputProps={{ readOnly: true }}
                fullWidth
                variant="outlined"
                helperText="Référence automatique générée"
                error={!!errors.reference}
              />
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
                    <th style={{ width: "35%", padding: "8px", borderBottom: "1px solid #ddd" }}>Projet</th>
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
                          getOptionLabel={(option) => `${option.name} - ${option.price.toFixed(2)}TND`}
                          value={projects.find(p => p.id === item.projectId) || null}
                          onChange={(e, newValue) => handleProjectSelect(index, newValue)}
                          isOptionEqualToValue={(option, value) => option.id === value?.id}
                          filterOptions={(options, state) => 
                            options.filter(option =>
                              option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                            )
                          }
                          noOptionsText="Aucun projet trouvé"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              error={!!errors[`project-${index}`]}
                              helperText={errors[`project-${index}`] || "Sélectionnez un projet"}
                              placeholder="Rechercher un projet..."
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props}>
                              <Box sx={{ width: '100%' }}>
                                <Typography variant="body1">{option.name}</Typography>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="caption">
                                    {dayjs(option.startDate).format('DD/MM/YYYY')} - 
                                    {dayjs(option.endDate).format('DD/MM/YYYY')}
                                  </Typography>
                                  <Typography variant="caption">
                                    Risque: {option.riskLevel}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" display="block">
                                  {option.description}
                                </Typography>
                              </Box>
                            </li>
                          )}
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                      <TextField
  type="number"
  value={item.quantity}
  onChange={(e) => {
    const newItems = [...state.items];
    newItems[index].quantity = Math.max(1, Math.min(1000, parseInt(e.target.value) || 1));
    setState(p => ({ ...p, items: newItems }));
  }}
  InputProps={{ inputProps: { min: 1, max: 1000 } }}
  fullWidth
  size="small"
  error={!!errors[`quantity-${index}`]}
  helperText={errors[`quantity-${index}`]}
/>
                      </td>
                      <td style={{ padding: "8px" }}>
                        <TextField
                          value={item.prixUnitaire?.toFixed(2) || '0.00'}
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
                          disabled={state.items.length === 1}
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
                disabled={!state.clientId}
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