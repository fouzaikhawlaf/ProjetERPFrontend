import apiErp from './api';

// Individual named exports for all methods
export const getDevisById = async (id) => {
  try {
    const response = await apiErp.get(`/devis/${id}`);
    // Normaliser la réponse pour gérer les items
    const devis = response.data;
    if (devis && devis.items && !Array.isArray(devis.items) && devis.items.$values) {
      devis.items = devis.items.$values;
    }
    return devis;
  } catch (error) {
    console.error('Error fetching devis:', error);
    throw error;
  }
};

// Fonction améliorée pour récupérer tous les devis avec items
export const getAllDevis = async () => {
  try {
    const response = await apiErp.get('/devis');
    let data = response.data.$values || response.data;
    
    // Normaliser les items pour chaque devis
    if (Array.isArray(data)) {
      data = data.map(devis => {
        if (devis.items && !Array.isArray(devis.items) && devis.items.$values) {
          devis.items = devis.items.$values;
        }
        return devis;
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching all devis:', error);
    throw error;
  }
};

// Fonction spéciale pour récupérer les devis avec diagnostic
export const getAllDevisWithDiagnostic = async () => {
  try {
    const response = await apiErp.get('/devis/diagnostic');
    return response.data;
  } catch (error) {
    console.error('Error fetching devis diagnostic:', error);
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
    await apiErp.put(`/devis/${id}/status`, newStatus);
  } catch (error) {
    console.error('Error updating devis status:', error);
    throw error;
  }
};

// Specialized Queries
export const getArchivedDevis = async () => {
  try {
    const response = await apiErp.get('/devis/archived');
    let data = response.data;
    if (Array.isArray(data)) {
      data = data.map(devis => {
        if (devis.items && !Array.isArray(devis.items) && devis.items.$values) {
          devis.items = devis.items.$values;
        }
        return devis;
      });
    }
    return data;
  } catch (error) {
    console.error('Error fetching archived devis:', error);
    throw error;
  }
};

export const getDraftDevis = async () => {
  try {
    const response = await apiErp.get('/devis/draft');
    let data = response.data;
    if (Array.isArray(data)) {
      data = data.map(devis => {
        if (devis.items && !Array.isArray(devis.items) && devis.items.$values) {
          devis.items = devis.items.$values;
        }
        return devis;
      });
    }
    return data;
  } catch (error) {
    console.error('Error fetching draft devis:', error);
    throw error;
  }
};

export const getDevisByStatus = async (status) => {
  try {
    const response = await apiErp.get(`/devis/status/${status}`);
    let data = response.data;
    if (Array.isArray(data)) {
      data = data.map(devis => {
        if (devis.items && !Array.isArray(devis.items) && devis.items.$values) {
          devis.items = devis.items.$values;
        }
        return devis;
      });
    }
    return data;
  } catch (error) {
    console.error('Error fetching devis by status:', error);
    throw error;
  }
};

export const searchDevis = async (term) => {
  try {
    const response = await apiErp.get('/devis/search', { params: { term } });
    let data = response.data;
    if (Array.isArray(data)) {
      data = data.map(devis => {
        if (devis.items && !Array.isArray(devis.items) && devis.items.$values) {
          devis.items = devis.items.$values;
        }
        return devis;
      });
    }
    return data;
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

export const getDevisByType = async (type) => {
  try {
    const response = await apiErp.get(`/devis/by-type/${type}`);
    let data = response.data;
    if (Array.isArray(data)) {
      data = data.map(devis => {
        if (devis.items && !Array.isArray(devis.items) && devis.items.$values) {
          devis.items = devis.items.$values;
        }
        return devis;
      });
    }
    return data;
  } catch (error) {
    console.error('Error fetching devis by type:', error);
    throw error;
  }
};



export const updateDevisClient = async (id, updateData) => {
  try {
    const response = await apiErp.put(`/devis/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating devis client:', error);
    throw error;
  }
};

// Default export with all methods as an object
const DevisClientService = {
  getDevisById,
  getAllDevis,
  getAllDevisWithDiagnostic,
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
  convertDevisToOrder,
  getDevisByType, 
  updateDevisClient
};

export default DevisClientService;