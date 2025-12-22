// src/services/invoiceClientService.js
import apiErp from "./api";

// 🔹 Générer une facture à partir d'une commande + bon de livraison
// orderClientUrl & bonDeLivraisonUrl = URL API de l'order & du BL
export const generateInvoice = async ({ orderClientUrl, bonDeLivraisonUrl }) => {
  const res = await apiErp.post("/InvoiceClient/generate", {
    orderClientUrl,
    bonDeLivraisonUrl,
  });
  // L'API renvoie la facture générée
  return res.data;
};

// 🔹 Récupérer une facture par id
export const getInvoiceById = async (id) => {
  const res = await apiErp.get(`/InvoiceClient/${id}`);
  return res.data;
};

// 🔹 Mettre à jour une facture
export const updateInvoice = async (id, updateDto) => {
  await apiErp.put(`/InvoiceClient/${id}`, updateDto);
};

// 🔹 Supprimer une facture
export const deleteInvoice = async (id) => {
  await apiErp.delete(`/InvoiceClient/${id}`);
};

// 🔹 Export CSV (si ton backend est ajusté pour ne pas exiger le body en query)
export const exportInvoicesToCsv = async () => {
  const res = await apiErp.get("/InvoiceClient/export-csv", {
    responseType: "blob",
  });

  const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoices.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
