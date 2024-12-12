import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  LinearProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { MonetizationOn, Receipt, AttachMoney, LocalAtm } from '@mui/icons-material';

function BuildByDevelopers() {
  const [salesData, setSalesData] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  });

  const [invoiceData, setInvoiceData] = useState({
    unpaid: { count: 0, total: 0 },
    paid: { count: 0, total: 0 },
  });

  const [chequesData, setChequesData] = useState({
    received: [
      { id: 1, number: '82304982930492', holder: 'LKJD', amount: 500000, status: 'En cours', date: '30 sept. 2022', delay: '-55j' },
      { id: 2, number: '1224545', holder: '12', amount: 1429085, status: 'En cours', date: '30 juin 2022', delay: '-147j' },
    ],
    issued: [
      // Similar data structure for issued cheques
    ],
  });

  const calculateInvoicePercentage = () => {
    const totalInvoices = invoiceData.unpaid.count + invoiceData.paid.count;
    return totalInvoices > 0 ? (invoiceData.unpaid.count / totalInvoices) * 100 : 0;
  };

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Votre compte expire dans 0 jour. Veuillez renouveler votre abonnement pour continuer à utiliser nos services.
      </Typography>

      {/* Sales Section */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: '1.5rem', textAlign: 'center', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <MonetizationOn />
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>{salesData.today.toLocaleString()} TND</Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Ventes aujourdhui</Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Repeat for other sales periods */}
      </Grid>

      {/* Invoices Section */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '1.5rem', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Factures</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Receipt />
              </Avatar>
              <Box sx={{ width: '100%', ml: 2 }}>
                <Typography variant="subtitle1">Impayées:</Typography>
                <LinearProgress variant="determinate" value={calculateInvoicePercentage()} sx={{ height: 10, borderRadius: 5, mt: 1 }} />
                <Typography variant="subtitle1" sx={{ mt: 1 }}>{invoiceData.unpaid.count} / {invoiceData.unpaid.count + invoiceData.paid.count} factures</Typography>
              </Box>
            </Box>
            {/* Repeat for paid invoices */}
          </Paper>
        </Grid>
      </Grid>

      {/* Cheques Section */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: '1.5rem', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Chèques en cours Reçu</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Numéro</TableCell>
                    <TableCell>Titulaire</TableCell>
                    <TableCell align="right">Montant (TND)</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Délai</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chequesData.received.map((cheque) => (
                    <TableRow key={cheque.id}>
                      <TableCell>{cheque.number}</TableCell>
                      <TableCell>{cheque.holder}</TableCell>
                      <TableCell align="right">{cheque.amount.toLocaleString()}</TableCell>
                      <TableCell>{cheque.status}</TableCell>
                      <TableCell>{cheque.date}</TableCell>
                      <TableCell>{cheque.delay}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Repeat similar structure for "Chèques en cours émis" */}
      </Grid>
    </Box>
  );
}

export default BuildByDevelopers;
