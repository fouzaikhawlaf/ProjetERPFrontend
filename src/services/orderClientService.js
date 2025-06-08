import apiErp from './api'; // Import de l'instance Axios configurée

// Récupérer toutes les commandes
const getAllOrders = async () => {
  try {
    const response = await apiErp.get('/OrderClient');
    console.log('Commandes récupérées:', response.data.$values);
    return response.data.$values;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
};

// Récupérer une commande par ID
const getOrderById = async (id) => {
  try {
    const response = await apiErp.get(`/OrderClient/${id}`);
    console.log('Commande trouvée:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
    throw error;
  }
};

// Créer une nouvelle commande
const createOrder = async (orderData) => {
  try {
    const response = await apiErp.post('/OrderClient', orderData);
    console.log('Commande créée:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    throw error;
  }
};

// Mettre à jour une commande
const updateOrder = async (id, updateData) => {
  try {
    const response = await apiErp.put(`/OrderClient/${id}`, updateData);
    console.log('Commande mise à jour:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la commande ${id}:`, error);
    throw error;
  }
};

// Supprimer une commande
const deleteOrder = async (id) => {
  try {
    await apiErp.delete(`/OrderClient/${id}`);
    console.log(`Commande ${id} supprimée`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de la commande ${id}:`, error);
    throw error;
  }
};

// Archiver une commande
const archiveOrder = async (id) => {
  try {
    const response = await apiErp.patch(`/OrderClient/${id}/archive`);
    console.log(`Commande ${id} archivée`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'archivage de la commande ${id}:`, error);
    throw error;
  }
};

// Rechercher des commandes
const searchOrders = async (keyword) => {
  try {
    const response = await apiErp.get('/OrderClient/search', {
      params: { keyword }
    });
    console.log('Résultats de recherche:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche des commandes:', error);
    throw error;
  }
};

// Générer le PDF d'une commande
const generateOrderPdf = async (orderId) => {
  try {
    const response = await apiErp.get(`/OrderClient/${orderId}/pdf`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Commande_${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`PDF généré pour la commande ${orderId}`);
  } catch (error) {
    console.error(`Erreur lors de la génération du PDF pour la commande ${orderId}:`, error);
    throw error;
  }
};

// Récupérer les commandes par client
const getOrdersByClientId = async (clientId) => {
  try {
    const response = await apiErp.get(`/OrderClient/client/${clientId}`);
    console.log(`Commandes pour le client ${clientId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des commandes du client ${clientId}:`, error);
    throw error;
  }
};

export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  archiveOrder,
  searchOrders,
  generateOrderPdf,
  getOrdersByClientId
};