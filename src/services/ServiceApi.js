import apiErp from './api';

// Récupérer tous les services
export const getServices = async () => {
  try {
    const response = await apiErp.get(`/Service`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Erreur lors du chargement des services';
    
    throw new Error(errorMessage);
  }
};

// Supprimer un service
export const deleteService = async (serviceId) => {
  try {
    await apiErp.delete(`/Service/${serviceId}`);
  } catch (error) {
    console.error('Error deleting service:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Erreur lors de la suppression';
    
    throw new Error(errorMessage);
  }
};

// Archiver un service - CORRECTION: Utilisation de PUT
export const archiveService = async (serviceId) => {
  try {
    const response = await apiErp.put(`/Service/archive/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error archiving service:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Erreur lors de l\'archivage';
    
    throw new Error(errorMessage);
  }
};

// Rechercher des services
export const searchServices = async (query) => {
  try {
    const response = await apiErp.get(`/Service/search?searchTerm=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching services:', {
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