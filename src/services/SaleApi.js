import apiErp from './api'; // Assurez-vous que ce chemin est correct

// Fonction pour obtenir toutes les ventes
export const getSales = async () => {
  try {
    const response = await apiErp.get('/sale');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

// Fonction pour obtenir une vente par ID
export const getSaleById = async (saleId) => {
  try {
    const response = await apiErp.get(`/sale/${saleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sale with ID ${saleId}:`, error);
    throw error;
  }
};

// Fonction pour rechercher des ventes
export const searchSales = async (query) => {
  try {
    const response = await apiErp.get(`/sale/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching sales:', error);
    throw error;
  }
};

// Fonction pour mettre à jour une vente
export const updateSale = async (saleId, updatedData) => {
  try {
    const response = await apiErp.put(`/sale/${saleId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating sale:', error);
    throw error;
  }
};

// Fonction pour supprimer une vente
export const deleteSale = async (saleId) => {
  try {
    const response = await apiErp.delete(`/sale/${saleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

// Fonction pour archiver une vente
export const archiveSale = async (saleId) => {
  try {
    const response = await apiErp.put(`/sale/archive/${saleId}`);
    return response.data;
  } catch (error) {
    console.error('Error archiving sale:', error);
    throw error;
  }
};
