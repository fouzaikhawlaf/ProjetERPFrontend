// src/services/deliveryNoteService.js
import apiErp from "./api";

// Petit helper pour les listes .NET ($values)
const unwrapDotNetList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values && Array.isArray(data.$values)) return data.$values;
  return [];
};

const normalizeDeliveryNote = (note) => {
  if (!note) return note;
  // Ici tu peux normaliser les noms de props si besoin
  return note;
};

// 🔹 GET: tous les bons de livraison
export const getAllDeliveryNotes = async () => {
  const res = await apiErp.get("/DeliveryNote");
  const list = unwrapDotNetList(res.data).map(normalizeDeliveryNote);
  console.log("Delivery notes:", list);
  return list;
};

// 🔹 GET: un bon de livraison par id
export const getDeliveryNoteById = async (id) => {
  const res = await apiErp.get(`/DeliveryNote/${id}`);
  return normalizeDeliveryNote(res.data);
};

// 🔹 POST: créer un BL à partir d'une commande
export async function createDeliveryNoteFromOrder(orderClientId, deliveryDate) {
  try {
    console.log(
      "[deliveryNoteService] createDeliveryNoteFromOrder...",
      { orderClientId, deliveryDate }
    );

    // ⚠️ baseURL = https://localhost:7298/api
    // donc on N'AJOUTE PAS /api ici :
    const response = await apiErp.post(
      `/DeliveryNote/createfromorder/${orderClientId}`,
      { deliveryDate } // 👈 JSON body
    );

    console.log(
      "[deliveryNoteService] Réponse API createFromOrder :",
      response.data
    );

    return normalizeDeliveryNote(response.data);
  } catch (error) {
    console.error(
      `Erreur lors de la création du BL pour la commande ${orderClientId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// 🔹 PUT: marquer une commande comme livrée (via DeliveryNoteController)
export const markOrderAsDelivered = async (orderClientId) => {
  await apiErp.put(`/DeliveryNote/markasdelivered/${orderClientId}`);
};

// 🔹 DELETE: supprimer un BL
export const deleteDeliveryNote = async (id) => {
  await apiErp.delete(`/DeliveryNote/${id}`);
};

// 🔹 GET: recherche des bons de livraison
export const searchDeliveryNotes = async ({ orderClientId, deliveryDate }) => {
  const params = {};
  if (orderClientId) params.orderClientId = orderClientId;
  if (deliveryDate) params.deliveryDate = deliveryDate;

  const res = await apiErp.get("/DeliveryNote/search", { params });
  return unwrapDotNetList(res.data).map(normalizeDeliveryNote);
};

// 🔹 GET: bons de livraison archivés
export const getArchivedDeliveryNotes = async () => {
  const res = await apiErp.get("/DeliveryNote/archived");
  return unwrapDotNetList(res.data).map(normalizeDeliveryNote);
};

// 🔹 PUT: marquer un BL comme archivé
export const markDeliveryNoteAsArchived = async (id) => {
  await apiErp.put(`/DeliveryNote/markasarchived/${id}`);
};

// 🔹 GET: télécharger le PDF du BL
export const downloadDeliveryNotePdf = async (id) => {
  const res = await apiErp.get(`/DeliveryNote/pdf/${id}`, {
    responseType: "blob",
  });

  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Bon_Livraison_${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
