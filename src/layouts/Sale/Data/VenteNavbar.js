import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  Email as EmailIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Add as AddIcon,
  CheckCircleOutline as ConfirmIcon,
  Visibility as PreviewIcon,
} from "@mui/icons-material";

const VenteInterface = () => {
  return (
    <div>
      {/* Navigation principale */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          {/* Logo ERP */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <HomeIcon fontSize="large" sx={{ marginRight: 1 }} />
            ERP Vente
          </Typography>

          {/* Menus principaux */}
          <Tabs value={false} textColor="inherit" indicatorColor="secondary">
            <Tab label="Ventes" />
            <Tab label="Commandes" />
            <Tab label="À Facturer" />
            <Tab label="Produits" />
            <Tab label="Analyse" />
            <Tab label="Configuration" />
          </Tabs>

          {/* Actions utilisateur */}
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" aria-label="notifications">
              <EmailIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="settings">
              <SettingsIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="profile">
              <PersonIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Barre secondaire : Actions spécifiques */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="15px 24px"
        sx={{ backgroundColor: "#f8f9fa" }}
      >
        {/* Breadcrumb pour navigation */}
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
            Devis
          </Link>
          <Typography color="text.primary">Nouveau</Typography>
        </Breadcrumbs>

        {/* Boutons d'actions principales */}
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              "&:hover": { backgroundColor: "#43a047" },
            }}
          >
            Nouveau
          </Button>
          <Button
            variant="contained"
            startIcon={<ConfirmIcon />}
            sx={{
              backgroundColor: "#2196f3",
              color: "#fff",
              "&:hover": { backgroundColor: "#1e88e5" },
            }}
          >
            Confirmer
          </Button>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            sx={{
              color: "#555",
              borderColor: "#ddd",
              "&:hover": { borderColor: "#bbb" },
            }}
          >
            Aperçu
          </Button>
        </Box>
      </Box>

      {/* Contenu principal */}
      <Box padding="20px 24px">
        <Typography variant="h5" gutterBottom>
          Gestion des Devis
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Créez, modifiez et gérez vos devis clients facilement depuis cette interface.
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: "#ffffff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6">Liste des Devis</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ borderRadius: "20px" }}
          >
            Ajouter un Devis
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default VenteInterface;
