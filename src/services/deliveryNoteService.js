// src/services/deliveryNoteService.js
import apiErp from "./api";

// Petit helper pour les listes .NET ($values)
const unwrapDotNetList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values && Array.isArray(data.$values)) return data.$values;
  return [];
};

const normalizeDeliveryItem = (it) => {
  if (!it) return it;

  return {
    id: it.id ?? it.Id ?? 0,
    productId: it.productId ?? it.ProductId ?? null,
    productName: it.productName ?? it.ProductName ?? "",
    quantity: Number(it.quantity ?? it.Quantity ?? 0),

    // backend DTO: UnitPrice / Price parfois
    unitPrice: Number(it.unitPrice ?? it.UnitPrice ?? it.price ?? it.Price ?? 0),

    discount: Number(it.discount ?? it.Discount ?? 0),
    tvaRate: Number(it.tvaRate ?? it.TvaRate ?? it.TVARate ?? 0),

    lineTotalHT: Number(it.lineTotalHT ?? it.LineTotalHT ?? 0),
    lineTotalTVA: Number(it.lineTotalTVA ?? it.LineTotalTVA ?? 0),
    lineTotalTTC: Number(it.lineTotalTTC ?? it.LineTotalTTC ?? 0),
  };
};

const normalizeDeliveryNote = (note) => {
  if (!note) return note;

  const rawItems =
    note.items ??
    note.Items ??
    note.deliveryNoteItems ??
    note.DeliveryNoteItems ??
    note.deliveryNoteItemsDto ??
    note.DeliveryNoteItemsDto;

  const items = unwrapDotNetList(rawItems).map(normalizeDeliveryItem);

  return {
    id: note.id ?? note.Id,
    orderClientId: note.orderClientId ?? note.OrderClientId,
    deliveryDate: note.deliveryDate ?? note.DeliveryDate,

    // ✅ IMPORTANT: DeliveryNumber backend -> deliveryNumber frontend
    deliveryNumber: note.deliveryNumber ?? note.DeliveryNumber ?? "",

    // si tu utilises deliveryMode côté front, mappe selon ton backend
    deliveryMode: note.deliveryMode ?? note.DeliveryMode ?? note.deliveryDetails ?? note.DeliveryDetails ?? "",

    isDelivered: note.isDelivered ?? note.IsDelivered ?? false,
    isArchived: note.isArchived ?? note.IsArchived ?? false,
    status: note.status ?? note.Status ?? "",

    totalHT: Number(note.totalHT ?? note.TotalHT ?? 0),
    totalTVA: Number(note.totalTVA ?? note.TotalTVA ?? 0),
    totalTTC: Number(note.totalTTC ?? note.TotalTTC ?? 0),

    clientName: note.clientName ?? note.ClientName ?? "",
    items, // ✅ maintenant toujours un tableau
  };
};

// 🔹 GET: tous les bons de livraison (avec items chez toi)
export const getAllDeliveryNotes = async () => {
  const res = await apiErp.get("/DeliveryNote");
  return unwrapDotNetList(res.data).map(normalizeDeliveryNote);
};

// 🔹 GET: un bon de livraison par id (avec items)
export const getDeliveryNoteById = async (id) => {
  const res = await apiErp.get(`/DeliveryNote/${id}`);
  return normalizeDeliveryNote(res.data);
};

// 🔹 POST: créer un BL à partir d'une commande (envoie deliveryNumber optionnel)
export async function createDeliveryNoteFromOrder(orderClientId, deliveryDate, deliveryMode, deliveryNumber) {
  const res = await apiErp.post(`/DeliveryNote/createfromorder/${orderClientId}`, {
    deliveryDate,
    deliveryMode,
    deliveryNumber, // optionnel
  });

  // ✅ Retour normalisé: deliveryNumber vient du backend
  return normalizeDeliveryNote(res.data);
}

// 🔹 PUT: update (si tu en as besoin)
export const updateDeliveryNote = async (id, payload) => {
  const res = await apiErp.put(`/DeliveryNote/${id}`, payload);
  return res.data;
};

// 🔹 PUT: livrée
export const markOrderAsDelivered = async (orderClientId) => {
  await apiErp.put(`/DeliveryNote/markasdelivered/${orderClientId}`);
};

// 🔹 DELETE
export const deleteDeliveryNote = async (id) => {
  await apiErp.delete(`/DeliveryNote/${id}`);
};

// 🔹 PUT: archiver
export const markDeliveryNoteAsArchived = async (id) => {
  await apiErp.put(`/DeliveryNote/markasarchived/${id}`);
};

// 🔹 PDF backend
export const downloadDeliveryNotePdf = async (id) => {
  const res = await apiErp.get(`/DeliveryNote/pdf/${id}`, { responseType: "blob" });
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
