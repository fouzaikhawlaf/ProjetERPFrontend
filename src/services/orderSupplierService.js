import apiErp from './api'; // Utilise votre instance existante

class OrderSupplierService {
  // GET: Récupérer une commande par ID
  async getOrderById(orderId) {
    try {
      const response = await apiErp.get(`/ordersupplier/${orderId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erreur lors de la récupération de la commande ${orderId}`);
    }
  }

  // GET: Récupérer les commandes par fournisseur
  async getOrdersBySupplier(supplierId) {
    try {
      const response = await apiErp.get(`/ordersupplier/supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erreur lors de la récupération des commandes du fournisseur ${supplierId}`);
    }
  }

  // GET: Récupérer toutes les commandes
  async getAllOrders() {
    try {
      const response = await apiErp.get('/ordersupplier');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erreur lors de la récupération de toutes les commandes');
    }
  }

  // PUT: Approuver une commande
  async approveOrder(orderId) {
    try {
      const response = await apiErp.put(`/ordersupplier/${orderId}/approve`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erreur lors de l'approbation de la commande ${orderId}`);
    }
  }

  // PUT: Rejeter une commande
  async rejectOrder(orderId) {
    try {
      await apiErp.put(`/ordersupplier/${orderId}/reject`);
      return true;
    } catch (error) {
      this.handleError(error, `Erreur lors du rejet de la commande ${orderId}`);
    }
  }

  // GET: Récupérer les commandes par statut
  async getOrdersByStatus(status) {
    try {
      const response = await apiErp.get(`/ordersupplier/status/${status}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erreur lors de la récupération des commandes avec le statut ${status}`);
    }
  }

  // POST: Générer un PDF
  async generateOrderPdf(orderIds) {
    try {
      const response = await apiErp.post('/ordersupplier/pdf', orderIds, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Erreur lors de la génération du PDF');
    }
  }

  // POST: Créer une commande à partir d'un devis
  async createOrderFromDevis(devisId) {
    try {
      const response = await apiErp.post(`/ordersupplier/convert-devis/${devisId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Erreur lors de la création de la commande depuis le devis ${devisId}`);
    }
  }

  // Gestion centralisée des erreurs
  handleError(error, defaultMessage) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error('Ressource non trouvée');
        case 400:
          throw new Error(error.response.data || 'Requête invalide');
        case 500:
          throw new Error('Erreur interne du serveur');
        default:
          throw new Error(defaultMessage);
      }
    } else {
      throw new Error('Erreur de connexion au serveur');
    }
  }
}

// Export par défaut
const orderSupplierService = new OrderSupplierService();
export default orderSupplierService;

// Exports nommés pour les méthodes spécifiques (SEULEMENT les méthodes existantes)
export const {
  getOrderById,
  getOrdersBySupplier,
  getAllOrders,
  approveOrder,
  rejectOrder,
  getOrdersByStatus,
  generateOrderPdf,
  createOrderFromDevis,
  handleError
} = orderSupplierService;