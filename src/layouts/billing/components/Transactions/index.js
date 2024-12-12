import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  styled,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
// Check if this import is correct

;
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

import { Link } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

const AccountCard = ({ title, balance }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const handleExpenseDialogOpen = () => {
    setExpenseDialogOpen(true);
  };

  const handleExpenseDialogClose = () => {
    setExpenseDialogOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h5">{balance} TND</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
              <Link to="/Depense" style={{ textDecoration: 'none' }}> 
                <Button variant="contained" color="secondary"   onClick={handleExpenseDialogOpen}>
                  Ajouter une dépense
                </Button>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Button variant="contained" color="primary">
                  Détails
                </Button>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <Divider style={{ margin: '16px 0' }} />
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="body2">Retenue</Typography>
            <Typography variant="body1">0,000 TND</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2">Traites</Typography>
            <Typography variant="body1">0,000 TND</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2">Chèques</Typography>
            <Typography variant="body1">0,000 TND</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2">Espèce</Typography>
            <Typography variant="body1">0,000 TND</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

AccountCard.propTypes = {
  title: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
};

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const Transaction = () => {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false); // Déplacer la définition de la variable d'état ici

  const handleExpenseDialogClose = () => {
    setExpenseDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <StyledContainer>
        <Typography variant="h4" gutterBottom>
          Gestion de la trésorerie
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AccountCard title="Solde secondaire" balance="0,000" />
          </Grid>
          <Grid item xs={12}>
            <AccountCard title="Solde primaire" balance="0,000" />
            <Box mt={2} display="flex" justifyContent="space-between">
              {/* Ajoutez ici d'autres éléments ou composants si nécessaire */}
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>
      
    </DashboardLayout>
  );
};

export default Transaction;

