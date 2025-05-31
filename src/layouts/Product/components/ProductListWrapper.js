import React, { useState, useEffect } from 'react';
import { 
  getProducts,
  deleteProduct, 
  updateProduct  
} from 'services/ProductApi';
import ProductsTable from './ProductsTable';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import {
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

const ProductListWrapper = () => {
  const [allProducts, setAllProducts] = useState([]); // Tous les produits
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        
        // Normalisation des données pour garantir un tableau
        let data = [];
        
        if (Array.isArray(response)) {
          data = response;
        } 
        else if (response && response.data && Array.isArray(response.data)) {
          data = response.data;
        }
        else if (response && response.$values && Array.isArray(response.$values)) {
          data = response.$values;
        }
        else if (response) {
          console.error('Unexpected API response format:', response);
        }
        
        setAllProducts(data);
      } catch (err) {
        setError(err.message);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setAllProducts(prev => prev.filter(product => product.id !== id));
      showNotification('Produit supprimé avec succès', 'success');
    } catch (err) {
      showNotification(`Échec de la suppression: ${err.message}`, 'error');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const productToUpdate = allProducts.find(p => p.id === id);
      const updatedProduct = await updateProduct(id, productToUpdate);
      setAllProducts(prev => 
        prev.map(p => p.id === id ? updatedProduct : p)
      );
      showNotification('Produit mis à jour avec succès', 'success');
    } catch (err) {
      showNotification(`Échec de la mise à jour: ${err.message}`, 'error');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    showNotification('Liste actualisée', 'info');
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ message, severity });
  };

  return (
    <DashboardLayout>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ProductsTable
          allProducts={allProducts}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onRefresh={handleRefresh}
        />
      )}

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert 
          severity={notification?.severity} 
          onClose={() => setNotification(null)}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default ProductListWrapper;