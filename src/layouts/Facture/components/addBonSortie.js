import React, { useState } from 'react';
import SoftBox from "components/SoftBox";
import { 
    Typography, 
    TextField, 
    Table, 
    TableBody, 
    TableCell, 
    TableRow, 
    TableHead,
    Grid,
    Card,
    CardContent 
} from '@mui/material';

function AddsSortie() {
  const [invoiceData, setInvoiceData] = useState({
    client: '',
    date: '28/05/2024',
    project: '',
    note: '',
    items: [],
  });

  // Function to handle input changes
  const handleChange = (event) => {
    setInvoiceData({
      ...invoiceData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" minHeight="80vh">
    <Grid item xs={12} md={10} lg={6}>
      <Card>
        <CardContent>
          <SoftBox
            sx={{
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
    <div style={{ padding: '2rem' }}> 
      <Typography variant="h4" gutterBottom>
        Bon de sortie
      </Typography>
      <Typography variant="body2" color="textSecondary">

      </Typography>

      <div style={{ marginTop: '2rem' }}>
        <Typography variant="h6" gutterBottom>
          BON DE SORTIE
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="subtitle1">Client</Typography>
            <TextField 
              name="client" 
              value={invoiceData.client} 
              onChange={handleChange} 
              fullWidth 
            />
          </div>

          <div>
            <Typography variant="subtitle1">Détails du document</Typography>
            <TextField 
              label="Date" 
              name="date" 
              value={invoiceData.date} 
              onChange={handleChange} 
            />
            <TextField 
              label="Projet" 
              name="project" 
              value={invoiceData.project} 
              onChange={handleChange} 
            />
            <TextField 
              label="Note" 
              name="note" 
              value={invoiceData.note} 
              onChange={handleChange} 
              multiline 
            />
          </div>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Désignation</TableCell>
            <TableCell>Quantité</TableCell>
            <TableCell>Prix HT</TableCell>
            <TableCell>TVA</TableCell>
            <TableCell>Total HT</TableCell>
            <TableCell>TVA</TableCell>
            <TableCell>Base</TableCell>
            <TableCell>Montant</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through invoiceData.items to display rows */}
        </TableBody>
      </Table>

      <div style={{ textAlign: 'right', marginTop: '2rem' }}>
        <Typography variant="subtitle1">Total HT: 0,000 TND</Typography>
        <Typography variant="subtitle1">Total TVA: 0,000 TND</Typography>
        <Typography variant="subtitle1">Total TTC: 0,000 TND</Typography>
        <Typography variant="subtitle1">Net à payer: 0,000 TND</Typography>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <Typography variant="h6" gutterBottom>
          Entreprise
        </Typography>
        <Typography variant="subtitle1">khawla shop shop</Typography>
        <Typography variant="subtitle1">--</Typography>
        <Typography variant="subtitle1">--</Typography>
        <Typography variant="subtitle1">Matricule fiscal:</Typography>

        <Typography variant="subtitle1" style={{ marginTop: '1rem' }}>
          Coordonnées
        </Typography>
        <Typography variant="subtitle1">----</Typography>
        <Typography variant="subtitle1">--</Typography>
        <Typography variant="subtitle1">--</Typography>
        <Typography variant="subtitle1">Coordonnées bancaires</Typography>
      </div>
    </div>
      
       
       </SoftBox>
       </CardContent>
        </Card>
      </Grid>
    </Grid>

  );
}

export default AddsSortie;
