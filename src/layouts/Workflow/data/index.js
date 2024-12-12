// src/dashboard/WorkflowDashboard.js
import React, { useState } from 'react';
import { Grid, Card, Button, Box, Typography, Divider } from '@mui/material';
import WorkflowDiagram from './WorkflowDiagram';
import WorkflowTableData from './WorkflowTableData';
import WorkflowStats from './WorkflowStats'; // فرضنا إضافة مكون الإحصائيات
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import WorkflowHeader from './WorkflowHeader';

import WorkflowChart from './WorkflowChart';
import WorkflowConfigurator from './WorkflowConfigurator'; 
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
// Define columns for the table
const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nom' },
  { id: 'status', label: 'Statut' },
];

// Sample data for the table
const rows = [
  { id: '1', name: 'Tâche 1', status: 'Complété' },
  { id: '2', name: 'Tâche 2', status: 'En cours' },
];

// Sample data for stats
const stats = [
  { title: 'Total Workflows', count: 12, description: 'Nombre total de workflows' },
  { title: 'Workflows En Cours', count: 5, description: 'Workflows actuellement en cours' },
  { title: 'Workflows Complétés', count: 7, description: 'Workflows complétés avec succès' },
];

const WorkflowDashboard = () => {
  const [open, setOpen] = useState(false);
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleOpen = () => {
    setOpen(true);
    setSnackbar({ open: true, message: 'Workflow ajouté avec succès !', severity: 'success' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleConfiguratorOpen = () => {
    setConfiguratorOpen(true);
  };
  
  const handleConfiguratorClose = () => {
    setConfiguratorOpen(false);
  };

  return (
    <DashboardLayout>
      <WorkflowHeader />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard des Workflows
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Gérez et visualisez vos workflows ici.
        </Typography>

        {/* Grid for stats and diagram */}
        <Grid container spacing={3}>
          {/* Stats Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Statistiques des Workflows
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <WorkflowStats stats={stats} />
            </Card>
          </Grid>

          {/* Diagram and Table */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ padding: 2, boxShadow: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Diagramme des Workflows
                  </Typography>
                  <WorkflowDiagram />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ padding: 3, boxShadow: 4, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Workflow Distribution
                  </Typography>
                  <WorkflowChart /> {/* This is where the new chart will go */}
                </Card>
              </Grid>

          <Box sx={{ padding: 3 }}>
      {/* Autres sections */}
      <Button variant="contained" color="primary" onClick={handleConfiguratorOpen}>
        Configurer un Workflow
      </Button>
      <WorkflowConfigurator open={configuratorOpen} onClose={handleConfiguratorClose} />
         </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Add Workflow Button */}
        <Box sx={{ marginTop: 2, textAlign: 'right' }}>
          
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default WorkflowDashboard;
