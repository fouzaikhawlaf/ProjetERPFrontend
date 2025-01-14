import apiErp from './api'; // Import the axios instance

// Récupérer tous les devis
export const getAllDevisPurchases = async () => {
  try {
    const response = await apiErp.get('/DevisPurchase');
    return response.data;
  } catch (error) {
    console.error('Error fetching devis purchases:', error);
    throw error;
  }
};

// Récupérer un devis par ID
export const getDevisPurchaseById = async (id) => {
  try {
    const response = await apiErp.get(`/DevisPurchase/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching devis purchase with ID ${id}:`, error);
    throw error;
  }
};

// Créer un devis
export const createDevisPurchase = async (createDevisPurchaseDto) => {
  try {
    const response = await apiErp.post('/DevisPurchase', createDevisPurchaseDto);
    return response.data;
  } catch (error) {
    console.error('Error creating devis purchase:', error);
    throw error;
  }
};

// Créer un service de devis
export const createDevisService = async (devisServiceDto) => {
  try {
    const response = await apiErp.post('/DevisPurchase/create-service', devisServiceDto);
    return response.data;
  } catch (error) {
    console.error('Error creating devis service:', error);
    throw error;
  }
};

// Créer un produit de devis
export const createDevisProduct = async (devisProduitDto) => {
  try {
    const response = await apiErp.post('/DevisPurchase/create-product', devisProduitDto);
    return response.data;
  } catch (error) {
    console.error('Error creating devis product:', error);
    throw error;
  }
};

// Mettre à jour un devis
export const updateDevisPurchase = async (id, updateDevisPurchaseDto) => {
  try {
    const response = await apiErp.put(`/DevisPurchase/${id}`, updateDevisPurchaseDto);
    return response.data;
  } catch (error) {
    console.error(`Error updating devis purchase with ID ${id}:`, error);
    throw error;
  }
};

// Accepter un devis
export const acceptDevis = async (id) => {
  try {
    const response = await apiErp.post(`/DevisPurchase/${id}/accept`);
    return response.data;
  } catch (error) {
    console.error(`Error accepting devis with ID ${id}:`, error);
    throw error;
  }
};

// Rejeter un devis
export const rejectDevis = async (id) => {
  try {
    const response = await apiErp.post(`/DevisPurchase/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error(`Error rejecting devis with ID ${id}:`, error);
    throw error;
  }
};

// Récupérer tous les services de devis
export const getAllDevisServices = async () => {
  try {
    const response = await apiErp.get('/DevisPurchase/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching devis services:', error);
    throw error;
  }
};

// Récupérer tous les produits de devis
export const getAllDevisProducts = async () => {
  try {
    const response = await apiErp.get('/DevisPurchase/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching devis products:', error);
    throw error;
  }
};

// Rechercher des devis
export const searchDevis = async (searchTerm, type = null) => {
  try {
    const response = await apiErp.get('/DevisPurchase/search', {
      params: { searchTerm, type },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching devis:', error);
    throw error;
  }
};

// Récupérer les devis par statut
export const getDevisByStatut = async (statut) => {
  try {
    const response = await apiErp.get(`/DevisPurchase/by-status/${statut}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching devis by statut ${statut}:`, error);
    throw error;
  }
};

// Calculer le total TTC d'un devis
export const calculateTotalTTC = async (id) => {
  try {
    const response = await apiErp.get(`/DevisPurchase/${id}/calculate-total-ttc`);
    return response.data;
  } catch (error) {
    console.error(`Error calculating total TTC for devis with ID ${id}:`, error);
    throw error;
  }
};

// Ajouter un item à un devis produit
export const addItemToDevisProduit = async (id, itemDto) => {
  try {
    const response = await apiErp.post(`/DevisPurchase/${id}/add-item`, itemDto);
    return response.data;
  } catch (error) {
    console.error(`Error adding item to devis produit with ID ${id}:`, error);
    throw error;
  }
};

// Supprimer un item d'un devis produit
export const removeItemFromDevisProduit = async (devisId, itemId) => {
  try {
    const response = await apiErp.delete(`/DevisPurchase/${devisId}/remove-item/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing item from devis produit with ID ${devisId}:`, error);
    throw error;
  }
};

// Mettre à jour un item dans un devis produit
export const updateItemInDevisProduit = async (devisId, itemDto) => {
  try {
    const response = await apiErp.put(`/DevisPurchase/${devisId}/update-item`, itemDto);
    return response.data;
  } catch (error) {
    console.error(`Error updating item in devis produit with ID ${devisId}:`, error);
    throw error;
  }
};

// Récupérer les devis par fournisseur
export const getDevisBySupplier = async (supplierId) => {
  try {
    const response = await apiErp.get(`/DevisPurchase/by-supplier/${supplierId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching devis by supplier ID ${supplierId}:`, error);
    throw error;
  }
};

// Récupérer les devis par plage de dates
export const getDevisByDateRange = async (startDate, endDate) => {
  try {
    const response = await apiErp.get('/DevisPurchase/by-date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching devis by date range:', error);
    throw error;
  }
};

// Récupérer le statut d'un devis
export const getDevisStatus = async (id) => {
  try {
    const response = await apiErp.get(`/DevisPurchase/${id}/status`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching status for devis with ID ${id}:`, error);
    throw error;
  }
};