// src/layouts/roles/components/UserManagementDashboard.js
import React, { useState } from 'react';
import { Grid, Paper, Typography, IconButton, Button, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CreateUserModal from './CreateUserModal';
import RolePermissions from './RolePermissions';

const UserManagementDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const users = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'Employee' },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid container spacing={3} sx={{ padding: 2 }}>
      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleShowModal}
        >
          Add User Account
        </Button>
        <CreateUserModal show={showModal} handleClose={handleCloseModal} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={4} key={user.id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="subtitle1">Role: {user.role}</Typography>
                <IconButton color="primary" aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Example for managing Role Permissions */}
      <Grid item xs={12}>
        <RolePermissions />
      </Grid>
    </Grid>
  );
};

export default UserManagementDashboard;
