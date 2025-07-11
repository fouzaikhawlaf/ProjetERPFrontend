// src/components/ClientDetailsModal.js
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
  Grid,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  Clear, 
  LocationOn, 
  Phone, 
  Notes,
  Person,
  Favorite,
  Home,
  Business,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const ClientDetailsModal = ({ client, open, onClose }) => {
  if (!client) return null;

  // Filtrer les adresses de facturation et client
  const billingAddresses = client.addresses?.filter(addr => 
    addr.type?.toLowerCase().includes('billing')
  ) || [];

  const clientAddresses = client.addresses?.filter(addr => 
    addr.type?.toLowerCase().includes('client')
  ) || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ 
            bgcolor: !client.isArchived ? '#4caf50' : '#f44336', 
            mr: 2,
            width: 40, 
            height: 40
          }}>
            {!client.isArchived ? (
              <CheckCircle sx={{ fontSize: 24 }} />
            ) : (
              <Cancel sx={{ fontSize: 24 }} />
            )}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {client.name || 'Nom non disponible'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {!client.isArchived ? 'Client actif' : 'Client archivé'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {/* Section Informations de base */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} /> Informations principales
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Email:</strong> {client.email || 'N/A'}</Typography>
                </Grid>
               
                <Grid item xs={12} md={6}>
                  <Typography><strong>Statut:</strong> 
                    <Chip 
                      label={!client.isArchived ? "Actif" : "Archivé"} 
                      size="small" 
                      color={!client.isArchived ? "success" : "error"}
                      sx={{ ml: 1 }}
                      icon={!client.isArchived ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                    />
                  </Typography>
                </Grid>
                {client.isArchived && client.archivedAt && (
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Date d&#39;archivage:</strong> {client.archivedAt || 'N/A'}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Section Adresses (améliorée) */}
          {(billingAddresses.length > 0 || clientAddresses.length > 0) && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1 }} /> Adresses
                </Typography>
                
                {billingAddresses.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Business sx={{ mr: 1 }} /> Facturation
                    </Typography>
                    <List dense>
                      {billingAddresses.map((address, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemText
                            primary={address.addressLine || 'N/A'}
                            secondary={
                              <>
                                <div>{address.postalCode || ''} {address.region || ''}</div>
                                <div>{address.country || ''}</div>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {clientAddresses.length > 0 && (
                  <Box>
                    <Typography fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Home sx={{ mr: 1 }} /> Client
                    </Typography>
                    <List dense>
                      {clientAddresses.map((address, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemText
                            primary={address.addressLine || 'N/A'}
                            secondary={
                              <>
                                <div>{address.postalCode || ''} {address.region || ''}</div>
                                <div>{address.country || ''}</div>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Paper>
            </Grid>
          )}

          {/* Section Téléphones */}
          {client.phoneNumbers?.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1 }} /> Téléphones
                </Typography>
                <Grid container spacing={1}>
                  {client.phoneNumbers.map((phone, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1 }}>{phone.number || 'N/A'}</Typography>
                        {phone.type && (
                          <Chip 
                            label={phone.type} 
                            size="small" 
                            variant="outlined"
                            color={!client.isArchived ? "primary" : "default"}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Section Notes */}
          {client.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Notes sx={{ mr: 1 }} /> Notes
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#f9f9f9', 
                  p: 2, 
                  borderRadius: 1,
                  borderLeft: '3px solid #1976d2'
                }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {client.notes}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Section Préférences */}
          {client.preferences && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Favorite sx={{ mr: 1 }} /> Préférences
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#fff8e1', 
                  p: 2, 
                  borderRadius: 1,
                  borderLeft: '3px solid #ff9800'
                }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {client.preferences}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1 }}
        >
          Fermer
        </Button>
        {client.isArchived && (
          <Button 
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 1 }}
            onClick={() => {
              // Fonction pour réactiver le client
              alert('Fonctionnalité de réactivation à implémenter');
            }}
          >
            Réactiver le client
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ClientDetailsModal.propTypes = {
  client: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    clientID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isArchived: PropTypes.bool,
    archivedAt: PropTypes.string,
    notes: PropTypes.string,
    preferences: PropTypes.string,
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        addressLine: PropTypes.string,
        region: PropTypes.string,
        postalCode: PropTypes.string,
        country: PropTypes.string,
      })
    ),
    phoneNumbers: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        number: PropTypes.string,
      })
    ),
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ClientDetailsModal.defaultProps = {
  client: null,
};

export default ClientDetailsModal;