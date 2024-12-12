import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Alert } from '@mui/material';

const CreateUserModal = ({ show, handleClose }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = ['Admin', 'Manager', 'Employee', 'HR', 'Commercial', 'Buyer']; // Roles you mentioned

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userName || !email || !role) {
      setError('Please fill all fields.');
      return;
    }

    // Clear previous errors
    setError('');
    setSuccess('');

    // Payload for the API request
    const newUser = {
      userName,
      email,
      role,
    };

    // Here you would call an API to create the user and send email (mocked here)
    try {
      // Example of what the API call could look like:
      /*
      const response = await api.post('/createUser', newUser);
      if (response.status === 200) {
        setSuccess('User created successfully. Default credentials sent to email.');
      } else {
        setError('Failed to create user.');
      }
      */
      setSuccess('User created successfully. Default credentials sent to email.');
      
      // Clear form fields after success
      setUserName('');
      setEmail('');
      setRole('');
    } catch (error) {
      setError('Failed to create user. Please try again.');
    }
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Create New Employee Account</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          label="Employee Name"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Assign Role"
          select
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          {roles.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;
