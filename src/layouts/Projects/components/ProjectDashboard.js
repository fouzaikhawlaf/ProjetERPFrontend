import React from 'react';
import { Box, Grid, Paper, Typography, TextField, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

const ProjectDashboard = () => {
  return (
    <DashboardLayout>
    <Box sx={{ backgroundColor: '#F9FAFB', minHeight: '100vh', p: 2 }}>
      {/* Top Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search..."
          InputProps={{
            startAdornment: <Search />,
          }}
          variant="outlined"
          size="small"
          sx={{ width: '300px' }}
        />
        <Typography>User Profile</Typography>
      </Box>

      {/* Analytics Widgets */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>Active Users</Typography>
            <Typography variant="h4" sx={{ color: 'green' }}>
              222
            </Typography>
            <Typography variant="caption">+5.27% Since last month</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography>Views Per Minute</Typography>
            <Typography variant="h4" sx={{ color: 'red' }}>
              375
            </Typography>
            <Typography variant="caption">-1.08% Since previous week</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Sessions Table */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6">Sessions Overview</Typography>
        <table style={{ width: '100%', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>First</th>
              <th>Last</th>
              <th>Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Larry the Bird</td>
              <td></td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </Paper>
    </Box>
    </DashboardLayout>
  );
};

export default ProjectDashboard;
