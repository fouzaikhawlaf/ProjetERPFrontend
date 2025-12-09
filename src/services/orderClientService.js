import apiErp from "./api"; // Import de l'instance Axios configurée

// 🔹 Helper pour déballer une liste .NET (avec $values)
const unwrapDotNetList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values && Array.isArray(data.$values)) return data.$values;
  return [];
};

// 🔹 Normaliser une commande : s'assurer que OrderClientItems est un vrai array
const normalizeOrder = (order) => {
  if (!order) return order;

  let items = order.orderClientItems || order.OrderClientItems;

  if (items && !Array.isArray(items) && items.$values) {
    items = items.$values;
  }

  if (!Array.isArray(items)) {
    items = [];
  }

  return {
    ...order,
    orderClientItems: items, // toujours en camelCase côté front
  };
};

// 🔹 Récupérer toutes les commandes (AVEC items)
const getAllOrders = async () => {
  try {
    // 👉 On cible bien l'endpoint qui renvoie les commandes avec items
    // Si ton [HttpGet] principal renvoie déjà les items, tu peux remplacer
    // "/OrderClient/with-items" par juste "/OrderClient"
    const response = await apiErp.get("/OrderClient/with-items");

    const rawList = unwrapDotNetList(response.data);
    const normalized = rawList.map(normalizeOrder);

    console.log("Commandes avec items récupérées:", normalized);
    return normalized;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes (avec items):",
      error
    );
    throw error;
  }
};

// 🔹 Récupérer une commande par ID (avec items normalisés si présents)
const getOrderById = async (id) => {
  try {
    const response = await apiErp.get(`/OrderClient/${id}`);
    const order = normalizeOrder(response.data);
    console.log("Commande trouvée:", order);
    return order;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la commande ${id}:`,
      error
    );
    throw error;
  }
};

// 🔹 Créer une nouvelle commande
const createOrder = async (orderData) => {
  try {
    const response = await apiErp.post("/OrderClient", orderData);
    const created = normalizeOrder(response.data);
    console.log("Commande créée:", created);
    return created;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
};

// 🔹 Mettre à jour une commande
const updateOrder = async (id, updateData) => {
  try {
    const response = await apiErp.put(`/OrderClient/${id}`, updateData);
    const updated = normalizeOrder(response.data);
    console.log("Commande mise à jour:", updated);
    return updated;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la commande ${id}:`,
      error
    );
    throw error;
  }
};

// 🔹 Supprimer une commande
const deleteOrder = async (id) => {
  try {
    await apiErp.delete(`/OrderClient/${id}`);
    console.log(`Commande ${id} supprimée`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de la commande ${id}:`, error);
    throw error;
  }
};

// 🔹 Archiver une commande
const archiveOrder = async (id) => {
  try {
    const response = await apiErp.patch(`/OrderClient/${id}/archive`);
    const archived = normalizeOrder(response.data);
    console.log(`Commande ${id} archivée`);
    return archived;
  } catch (error) {
    console.error(
      `Erreur lors de l'archivage de la commande ${id}:`,
      error
    );
    throw error;
  }
};

// 🔹 Rechercher des commandes
const searchOrders = async (keyword) => {
  try {
    const response = await apiErp.get("/OrderClient/search", {
      params: { keyword },
    });

    const list = unwrapDotNetList(response.data).map(normalizeOrder);
    console.log("Résultats de recherche:", list);
    return list;
  } catch (error) {
    console.error("Erreur lors de la recherche des commandes:", error);
    throw error;
  }
};

// 🔹 Générer le PDF d'une commande
const generateOrderPdf = async (orderId) => {
  try {
    const response = await apiErp.get(`/OrderClient/${orderId}/pdf`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Commande_${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`PDF généré pour la commande ${orderId}`);
  } catch (error) {
    console.error(
      `Erreur lors de la génération du PDF pour la commande ${orderId}:`,
      error
    );
    throw error;
  }
};

// 🔹 Récupérer les commandes par client (avec items si renvoyés par l'API)
const getOrdersByClientId = async (clientId) => {
  try {
    const response = await apiErp.get(`/OrderClient/client/${clientId}`);

    const list = unwrapDotNetList(response.data).map(normalizeOrder);
    console.log(`Commandes pour le client ${clientId}:`, list);
    return list;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des commandes du client ${clientId}:`,
      error
    );
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
  getOrdersByClientId,
};
