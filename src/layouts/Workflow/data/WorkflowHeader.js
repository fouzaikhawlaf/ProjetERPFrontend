// src/components/WorkflowHeader.js
import React, { useState } from 'react';
import { Typography, Box, Button, IconButton, Tooltip, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArchiveIcon from '@mui/icons-material/Archive';
import SelectModuleDialog from './addWorkflow';
import PropTypes from 'prop-types';
const WorkflowHeader = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = () => {
      setDialogOpen(true);
    };
  
    const handleDialogClose = () => {
      setDialogOpen(false);
    };
  
    const handleModuleSelect = (module) => {
      console.log('Selected Module:', module);
      // You can handle the selected module here (e.g., set the workflow module in the state)
    };
  

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Workflow Dashboard
          </Typography>
          <Typography variant="subtitle1">
         
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Add New Workflow">
          <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />} 
              sx={{ marginRight: 1 }}
              onClick={handleDialogOpen}
            >
              Ajouter Workflow
            </Button>
            <SelectModuleDialog open={dialogOpen} onClose={handleDialogClose} onSelect={handleModuleSelect} />
          </Tooltip>
          <Tooltip title="Refresh Data">
            <IconButton color="secondary" aria-label="refresh" sx={{ marginRight: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search Workflows">
            <IconButton color="primary" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter Workflows">
            <IconButton color="primary" aria-label="filter" sx={{ marginLeft: 1 }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Archive Workflows">
            <IconButton color="primary" aria-label="archive" sx={{ marginLeft: 1 }}>
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      {/* Additional UI Elements or Descriptive Text */}
      <Typography variant="body2" color="textSecondary">
      
      </Typography>
    </Box>
  );
};




export default WorkflowHeader;
