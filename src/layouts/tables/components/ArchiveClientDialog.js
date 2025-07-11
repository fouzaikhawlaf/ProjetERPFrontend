import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import { Archive, Unarchive } from '@mui/icons-material';

const ArchiveClientDialog = ({
  open,
  onClose,
  clientToArchive,
  onArchive
}) => {
  // Vérifier si clientToArchive est null ou undefined
  if (!clientToArchive) {
    return null; // Retourne rien si le client n'est pas défini
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {clientToArchive.isArchived ? 'Désarchiver le client' : 'Archiver le client'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {clientToArchive.isArchived
            ? `Voulez-vous réactiver le client "${clientToArchive.name}" ?`
            : `Voulez-vous archiver le client "${clientToArchive.name}" ?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button
          onClick={onArchive}
          color={clientToArchive.isArchived ? "success" : "warning"}
          variant="contained"
          startIcon={clientToArchive.isArchived ? <Unarchive /> : <Archive />}
        >
          {clientToArchive.isArchived ? 'Réactiver' : 'Archiver'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ArchiveClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clientToArchive: PropTypes.shape({
    isArchived: PropTypes.bool,
    name: PropTypes.string,
    clientID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onArchive: PropTypes.func.isRequired
};

ArchiveClientDialog.defaultProps = {
  clientToArchive: null
};

export default ArchiveClientDialog;