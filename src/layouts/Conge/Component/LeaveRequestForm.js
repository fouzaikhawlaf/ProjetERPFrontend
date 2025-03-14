import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import fr from "date-fns/locale/fr"; // Pour la localisation en français
import EventIcon from "@mui/icons-material/Event"; // Icône pour les dates
import DescriptionIcon from "@mui/icons-material/Description"; // Icône pour la raison
import WorkIcon from "@mui/icons-material/Work"; // Icône pour le type de congé
import CongeService from "services/CongeService"; // Import du service

const LeaveRequestForm = () => {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [leaveType, setLeaveType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Validation basique
      if (!reason || !startDate || !endDate || !leaveType) {
        throw new Error("Tous les champs sont obligatoires");
      }
  
      // Formatage des dates
      const leaveRequestData = {
        reason,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        leaveType,
      };
  
      // Appel du service
      const response = await CongeService.createLeaveRequest(leaveRequestData);
  
      setSnackbarMessage("Demande de congé soumise avec succès !");
      setSeverity("success");
  
      // Réinitialisation du formulaire
      setReason("");
      setStartDate(null);
      setEndDate(null);
      setLeaveType("");
    } catch (error) {
      setSnackbarMessage(error.message || "Erreur lors de la soumission de la demande");
      setSeverity("error");
    } finally {
      setIsSubmitting(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Card>
            <CardHeader
              title="Demande de Congé"
              titleTypographyProps={{ variant: "h4", align: "center", color: "primary" }}
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Champ pour le type de congé */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="leave-type-label">Type de Congé</InputLabel>
                      <Select
                        labelId="leave-type-label"
                        id="leaveType"
                        value={leaveType}
                        label="Type de Congé"
                        onChange={(e) => setLeaveType(e.target.value)}
                        required
                        startAdornment={
                          <InputAdornment position="start">
                            <WorkIcon color="primary" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="annuel">Congé Annuel</MenuItem>
                        <MenuItem value="maladie">Congé Maladie</MenuItem>
                        <MenuItem value="maternite">Congé Maternité</MenuItem>
                        <MenuItem value="autre">Autre</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Champ pour la raison */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="reason"
                      label="Raison"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      multiline
                      rows={4}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Champ pour la date de début */}
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                      <DatePicker
                        label="Date de début"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Champ pour la date de fin */}
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                      <DatePicker
                        label="Date de fin"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Bouton de soumission */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{ mt: 2 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Soumettre"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Snackbar pour le feedback utilisateur */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default LeaveRequestForm;