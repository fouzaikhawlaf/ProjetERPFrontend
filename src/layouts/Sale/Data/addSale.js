import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import SoftButton from 'components/SoftButton';  // Correct path
import SoftInput from 'components/SoftInput';    // Correct path
import SoftBox from 'components/SoftBox';        // Correct path
 



import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Exemple de données clients, commandes et produits (simulées)
const clientsData = [
  { id: 1, name: 'Client A' },
  { id: 2, name: 'Client B' },
  { id: 3, name: 'Client C' },
];

const orderTypesData = [
  { id: 1, type: 'Devis' },
  { id: 2, type: 'Bon de commande' },
  { id: 3, type: 'Bon de réception' },
  { id: 4, type: 'Bon de livraison' },
];

const productsData = [
  { id: 1, name: 'Produit A' },
  { id: 2, name: 'Produit B' },
  { id: 3, name: 'Produit C' },
];

export default function AddSale() {
  const [orderType, setOrderType] = useState('');
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [clients, setClients] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [products, setProducts] = useState([]);

  const [workflowStarted, setWorkflowStarted] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données via une API
    setClients(clientsData);
    setOrderTypes(orderTypesData);
    setProducts(productsData);
  }, []);

  const handleStartWorkflow = () => {
    // Logique pour démarrer le workflow
    setWorkflowStarted(true);
    console.log("Starting workflow with:", orderType, client, product);
  };

  return (
    <DashboardLayout>
     
      <SoftBox py={3} px={5}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                  Ajouter une Vente
                </Typography>

                <SoftBox mb={3}>
                  {/* Sélection du type de commande */}
                  <Typography variant="subtitle1">Type de commande :</Typography>
                  <SoftInput
                    select
                    value={orderType}
                    onChange={e => setOrderType(e.target.value)}
                    fullWidth
                    placeholder="Sélectionner un type"
                  >
                    <option value="">Sélectionner un type</option>
                    {orderTypes.map((type, index) => (
                      <option key={type.id} value={type.type}>{type.type}</option>
                    ))}
                  </SoftInput>
                </SoftBox>

                <SoftBox mb={3}>
                  {/* Sélection du client */}
                  <Typography variant="subtitle1">Client :</Typography>
                  <SoftInput
                    select
                    value={client}
                    onChange={e => setClient(e.target.value)}
                    fullWidth
                    placeholder="Sélectionner un client"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client, index) => (
                      <option key={client.id} value={client.name}>{client.name}</option>
                    ))}
                  </SoftInput>
                </SoftBox>

                <SoftBox mb={3}>
                  {/* Sélection du produit */}
                  <Typography variant="subtitle1">Produit :</Typography>
                  <SoftInput
                    select
                    value={product}
                    onChange={e => setProduct(e.target.value)}
                    fullWidth
                    placeholder="Sélectionner un produit"
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.map((product, index) => (
                      <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                  </SoftInput>
                </SoftBox>

                <SoftButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handleStartWorkflow}
                  disabled={!orderType || !client || !product}
                >
                  Démarrer le workflow
                </SoftButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Afficher le formulaire de commande après avoir démarré le workflow */}
        {workflowStarted && (
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    Formulaire de Commande
                  </Typography>
                  <SoftInput label="Quantité" fullWidth margin="normal" />
                  <SoftInput label="Prix" fullWidth margin="normal" />
                  <SoftButton variant="gradient" color="success" fullWidth>
                    Soumettre la commande
                  </SoftButton>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </SoftBox>
    </DashboardLayout>
  );
}
