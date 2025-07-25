import apiErp from "./api";

// services/ApiClient.js
export const getClients = async (pageNumber = 1, pageSize = 10, isArchived = false, getCountsOnly = false) => {
  try {
    const response = await apiErp.get('/clients', {
      params: {  
        page: pageNumber,
        pageSize: pageSize,
        isArchived: isArchived ? 1 : 0,
        getCountsOnly: getCountsOnly ? 1 : 0
      }
    });

    // Handle different response structures
    const data = response.data;
    return {
      clients: data.items || data.$values || data || [],
      totalCount: data.totalCount || (Array.isArray(data) ? data.length : 0),
      activeCount: data.activeCount || 0,
      archivedCount: data.archivedCount || 0
    };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return { 
      clients: [], 
      totalCount: 0,
      activeCount: 0,
      archivedCount: 0
    };
  }
};

export const getClient = async (id) => {
  const response = await apiErp.get(`/clients/${id}`);
  return response.data;
};


export const createClient = async (clientData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://localhost:7298/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création du client');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

export const updateClient = async (id, clientDto) => {
  const response = await apiErp.put(`/clients/${id}`, clientDto);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await apiErp.delete(`/clients/${id}`);
  return response.data;
};

export const searchClients = async (query) => {
  const response = await apiErp.get('/clients/search', { params: { query } });
  // Extraction des clients depuis la propriété $values
  return response.data?.$values || response.data;
};

export const archiveClient = async (id) => {
  const response = await apiErp.put(`/clients/archive/${id}`);
  return response.data;
};

