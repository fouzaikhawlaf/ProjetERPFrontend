import apiErp from "./api";

export const getClients = async (pageNumber = 1, pageSize = 20) => {
  try {
    const response = await apiErp.get('/clients', {
      params: { pageNumber, pageSize },
    });

   console.log("API Response:", response.data.$values);

    // Adjust based on your API response structure
    const clients = response.data.$values || [];
   // console.log(clients );
    const totalCount = response.data?.totalCount || response.data?.data?.totalCount || 0;

    return {
clients,
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching clients:', error.message);
    throw new Error('Failed to fetch clients');
  }
};


export const getClient = async (id) => {
  const response = await apiErp.get(`/clients/${id}`);
  return response.data;
};


export const createClient = async (clientData) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJscy5zdG9yZS50ZWFtQGdtYWlsLmNvbSIsImVtYWlsIjoibHMuc3RvcmUudGVhbUBnbWFpbC5jb20iLCJqdGkiOiI3M2EwOWQ0MS05MTZmLTQ4NGYtOWM2MS1jYzUyY2IxOTExNDkiLCJleHAiOjE3MzI5ODEyODUsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImxvY2FsaG9zdCJ9.pBmnBmh_WfRe__RlZKXYnLlwBlAOiz6DICn2gW6nGNs';
  try {
    const token = localStorage.getItem('token'); // Get token from local storage (or another method if different)
    
    const response = await fetch('https://localhost:7298/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Add authorization header
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
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
  const response = await apiErp.get('/clients/search', {
    params: { query }
  });
  return response.data;
};

export const archiveClient = async (id) => {
  const response = await apiErp.put(`/clients/archive/${id}`);
  return response.data;
};

