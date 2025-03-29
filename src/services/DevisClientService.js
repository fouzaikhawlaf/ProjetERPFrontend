import apiErp from './api';

// Individual named exports for all methods
export const getDevisById = async (id) => {
  try {
    const response = await apiErp.get(`/devis/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching devis:', error);
    throw error;
  }
};

// In your getAllDevis function (and similar for others)
export const getAllDevis = async () => {
  try {
    const response = await apiErp.get('/devis');
    return response.data.$values || response.data; // Handle both formats
  } catch (error) {
    console.error('Error fetching all devis:', error);
    throw error;
  }
};

export const createDevis = async (createDevisDto) => {
  try {
    const response = await apiErp.post('/devis', createDevisDto);
    return response.data;
  } catch (error) {
    console.error('Error creating devis:', error);
    throw error;
  }
};

export const updateDevis = async (id, updateDevisDto) => {
  try {
    await apiErp.put(`/devis/${id}`, updateDevisDto);
  } catch (error) {
    console.error('Error updating devis:', error);
    throw error;
  }
};

export const deleteDevis = async (id) => {
  try {
    await apiErp.delete(`/devis/${id}`);
  } catch (error) {
    console.error('Error deleting devis:', error);
    throw error;
  }
};

// Status Management
export const acceptDevis = async (id) => {
  try {
    await apiErp.put(`/devis/${id}/accept`);
  } catch (error) {
    console.error('Error accepting devis:', error);
    throw error;
  }
};

export const rejectDevis = async (id) => {
  try {
    await apiErp.put(`/devis/${id}/reject`);
  } catch (error) {
    console.error('Error rejecting devis:', error);
    throw error;
  }
};

export const updateDevisStatus = async (id, newStatus) => {
  try {
    await apiErp.put(`/devis/${id}/status`, { newStatus });
  } catch (error) {
    console.error('Error updating devis status:', error);
    throw error;
  }
};

// Specialized Queries
export const getArchivedDevis = async () => {
  try {
    const response = await apiErp.get('/devis/archived');
    return response.data;
  } catch (error) {
    console.error('Error fetching archived devis:', error);
    throw error;
  }
};

export const getDraftDevis = async () => {
  try {
    const response = await apiErp.get('/devis/draft');
    return response.data;
  } catch (error) {
    console.error('Error fetching draft devis:', error);
    throw error;
  }
};

export const getDevisByStatus = async (status) => {
  try {
    const response = await apiErp.get(`/devis/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching devis by status:', error);
    throw error;
  }
};

export const searchDevis = async (term) => {
  try {
    const response = await apiErp.get('/devis/search', { params: { term } });
    return response.data;
  } catch (error) {
    console.error('Error searching devis:', error);
    throw error;
  }
};

// Business Operations
export const generateDevisReference = async () => {
  try {
    const response = await apiErp.get('/devis/generate-reference');
    return response.data;
  } catch (error) {
    console.error('Error generating devis reference:', error);
    throw error;
  }
};

export const validateDevis = async (id) => {
  try {
    const response = await apiErp.get(`/devis/${id}/validate`);
    return response.data;
  } catch (error) {
    console.error('Error validating devis:', error);
    throw error;
  }
};

export const linkDevisToOrder = async (devisId, orderId) => {
  try {
    await apiErp.post(`/devis/${devisId}/link-order/${orderId}`);
  } catch (error) {
    console.error('Error linking devis to order:', error);
    throw error;
  }
};

export const archiveDevis = async (id) => {
  try {
    await apiErp.put(`/devis/${id}/archive`);
  } catch (error) {
    console.error('Error archiving devis:', error);
    throw error;
  }
};

export const convertDevisToOrder = async (id) => {
  try {
    const response = await apiErp.post(`/devis/${id}/convert-to-order`);
    return response.data;
  } catch (error) {
    console.error('Error converting devis to order:', error);
    throw error;
  }
};

// Default export with all methods as an object
const DevisClientService = {
  getDevisById,
  getAllDevis,
  createDevis,
  updateDevis,
  deleteDevis,
  acceptDevis,
  rejectDevis,
  updateDevisStatus,
  getArchivedDevis,
  getDraftDevis,
  getDevisByStatus,
  searchDevis,
  generateDevisReference,
  validateDevis,
  linkDevisToOrder,
  archiveDevis,
  convertDevisToOrder
};

export default DevisClientService;