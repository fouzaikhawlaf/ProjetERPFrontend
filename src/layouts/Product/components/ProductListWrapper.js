import React, { useState, useEffect } from 'react';
import { getProducts } from 'services/ProductApi'; // Your API service
import ProductsTable from './ProductsTable'; // Import sans accolades
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
const ProductListWrapper = () => {
  const [products, setProducts] = useState([]); // Store fetched products
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle errors

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(); // Call the API service to get products
        setProducts(data); // Set the data in state
      } catch (err) {
        setError('Failed to fetch products'); // Handle API errors
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchProducts();
  }, []);

  // Delete product and update the table
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id); // Call the delete API
      setProducts(products.filter((product) => product.id !== id)); // Remove deleted product from list
    } catch (err) {
      alert('Failed to delete product'); // Handle delete errors
    }
  };

  // Handle update action (redirect to an update form or show a modal)
  const handleUpdate = (id) => {
    console.log(`Update product with ID: ${id}`); // Example placeholder
  };

  // Show loading or error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Pass data and handlers to ProductsTable
  return (
    <DashboardLayout>
    <ProductsTable
      rows={products} // Pass products as rows
      rowsPerPage={10} // Optional: Pagination rows per page
      onDelete={handleDelete} // Pass delete handler
      onUpdate={handleUpdate} // Pass update handler
    />
     </DashboardLayout>
  );
};

export default ProductListWrapper;
