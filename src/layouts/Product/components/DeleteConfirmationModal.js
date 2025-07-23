import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const DeleteConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message,
  loading 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: '#fff8f8',
        borderBottom: '1px solid #ffebee',
        fontWeight: 600,
        py: 2
      }}>
        <Warning color="error" sx={{ mr: 1.5, fontSize: '1.5rem' }} />
        {title}
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 3 }}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
              {message}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: '1px solid #f5f5f5'
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          sx={{
            minWidth: '100px',
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#e0e0e0',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#fafafa'
            }
          }}
        >
          Annuler
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            minWidth: '130px',
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#c62828',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            },
            '&:disabled': {
              backgroundColor: '#ffcdd2'
            }
          }}
        >
          {loading ? 'Suppression...' : 'Confirmer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  loading: PropTypes.bool
};

DeleteConfirmationModal.defaultProps = {
  title: "Confirmer la suppression",
  message: "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
  loading: false
};

export default DeleteConfirmationModal;