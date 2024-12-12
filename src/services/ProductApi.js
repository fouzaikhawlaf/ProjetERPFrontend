import apiErp from './api';

// Function to create a new product
export const createProduct = async (productData) => {
  try {
    const response = await apiErp.post('/Product', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Existing functions
export const getProducts = async () => {
  try {
    const response = await apiErp.get('/Product');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await apiErp.get(`/Product/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await apiErp.put(`/Product/${productId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await apiErp.delete(`/Product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const archiveProduct = async (productId) => {
  try {
    const response = await apiErp.put(`/Product/archive/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error archiving product:', error);
    throw error;
  }
};
