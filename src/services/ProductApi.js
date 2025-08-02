import apiErp from './api';


export const createProduct = async (productData) => {
  try {
    const response = await apiErp.post('/Product', productData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      }
    });
    return response.data;
  } catch (error) {
    // Amélioration du logging d'erreur
    console.error('Erreur API:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Meilleure extraction du message d'erreur
    const errorMessage = error.response?.data?.Errors?.[0]?.Message 
      || error.response?.data?.message 
      || error.message 
      || 'Erreur inconnue';
    
    throw new Error(errorMessage);
  }
};




export const getProducts = async () => {
  try {
    const response = await apiErp.get('/Product');

    // Vérification de la structure des données retournées
    if (response.data?.$values && Array.isArray(response.data.$values)) {
      return response.data.$values; // Retourne les produits si $values existe
    } else if (Array.isArray(response.data)) {
      return response.data; // Retourne les produits si data est déjà un tableau
    } else if (response.data?.products && Array.isArray(response.data.products)) {
      return response.data.products; // Si une propriété 'products' existe
    } else {
      console.error('Unexpected API response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Relancer l'erreur pour le gérer à un niveau supérieur
  }
};

// ProductApi.js
export const searchProducts = async (query) => {
  try {
    // Envoyer le paramètre de recherche comme nombre si possible
    const params = {
      query: isNaN(query) ? query : parseFloat(query)
    };

    const response = await apiErp.get('/Product/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Erreur lors de la recherche';
    
    throw new Error(errorMessage);
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
// In ProductApi.js
export const getProduct = async (productId) => {
  try {
    const response = await apiErp.get(`/Product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};