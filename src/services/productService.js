import axios from 'axios';

// Setup the base Axios instances
const apiErp = axios.create({
  baseURL: 'https://localhost:7298/api', // Make sure this is correct for ERP
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`, // Ensure the token is dynamically set if needed
  },
});

const apiProduct = axios.create({
  baseURL: 'https://localhost:7298/api/product', // Assuming `/product` is a product-related endpoint
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`, // Add token if required
  },
});

// Product Service Functions
const getAllProducts = async () => {
  const response = await apiProduct.get('/');  // Get all products
  return response.data;
};

const getProductById = async (id) => {
  const response = await apiProduct.get(`/${id}`);  // Get product by ID
  return response.data;
};

const createProduct = async (productData) => {
  const response = await apiProduct.post('/', productData);  // Create a product
  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await apiProduct.put(`/${id}`, productData);  // Update a product by ID
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await apiProduct.delete(`/${id}`);  // Delete a product by ID
  return response.data;
};

// Service Functions
const getAllServices = async () => {
  const response = await apiErp.get('/service');  // Get all services
  return response.data;
};

const getServiceById = async (id) => {
  const response = await apiErp.get(`/service/${id}`);  // Get service by ID
  return response.data;
};

const createService = async (serviceData) => {
  const response = await apiErp.post('/service', serviceData);  // Create a new service
  return response.data;
};

const updateService = async (id, serviceData) => {
  const response = await apiErp.put(`/service/${id}`, serviceData);  // Update service by ID
  return response.data;
};

const deleteService = async (id) => {
  const response = await apiErp.delete(`/service/${id}`);  // Delete service by ID
  return response.data;
};

// Exporting functions
export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
