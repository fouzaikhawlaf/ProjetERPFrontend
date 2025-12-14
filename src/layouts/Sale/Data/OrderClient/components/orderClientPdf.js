// src/pdf/orderClientPdf.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoShamash from "../../../../../images/imageShamash.png"; // chemin relatif depuis ce fichier (vérifier existence)


const loadImageAsDataUrl = (src) =>
  new Promise((resolve, reject) => {
    if (!src) return resolve(null);

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = (err) => reject(err);
    img.src = src;
  });
/**
 * Génère un Blob PDF pour une commande client
 */
export const generateOrderClientPdfBlob = async ({
  orderNumber,
  clientName,
  orderDate,
  deliveryDate,
  paymentTerms,
  items,
  totalHT,
  totalTVA,
  totalTTC,
  logoUrl, // ⬅️ on passe une URL (import React)
  companyName = "Société Shamash IT",
  companyAddress = "étage B03, Centre Urbain Nord, Imm cercle des bureaux",
  companyPhone = "+216 29 511 251",
  companyEmail = "contact@shamash-it.com",
}) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1️⃣ Charger le logo : priorité au logoUrl passé, fallback sur import logoShamash
    const effectiveLogoUrl = logoUrl || logoShamash || null;
    console.debug("Logo utilisé pour PDF :", effectiveLogoUrl);
    let logoDataUrl = null;
    if (effectiveLogoUrl) {
      try {
        logoDataUrl = await loadImageAsDataUrl(effectiveLogoUrl);
      } catch (e) {
        console.warn("Impossible de convertir le logo en DataURL :", e);
      }
    }

    if (logoDataUrl) {
      try {
        // place logo on the right, 10px margin from right edge
        const logoWidth = 30;
        const logoHeight = 30;
        const xPos = pageWidth - 10 - logoWidth; // 10px right margin
        doc.addImage(logoDataUrl, "PNG", xPos, 10, logoWidth, logoHeight);
      } catch (e) {
        console.warn("Logo non ajouté au PDF :", e);
      }
    }

    // 2️⃣ Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      `COMMANDE CLIENT N° ${orderNumber || "N/A"}`,
      pageWidth / 2,
      20,
      { align: "center" }
    );

    // 3️⃣ Bloc infos société
    const companyInfo = [
      ["Société :", companyName],
      ["Adresse :", companyAddress],
      ["Tél :", companyPhone],
      ["Email :", companyEmail],
    ];

    autoTable(doc, {
      startY: 28,
      body: companyInfo,
      theme: "plain",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 30 },
        1: { cellWidth: 120 },
      },
      styles: { fontSize: 9 },
      margin: { left: 10, right: 10 },
    });

    const orderInfoStartY = doc.lastAutoTable.finalY + 8;

    // 4️⃣ Bloc infos commande/client
    const orderInfo = [
      ["Client :", clientName || "Non spécifié"],
      [
        "Date commande :",
        orderDate ? formatDate(orderDate) : "Non spécifiée",
      ],
      [
        "Date livraison :",
        deliveryDate ? formatDate(deliveryDate) : "Non spécifiée",
      ],
      ["Conditions de paiement :", paymentTerms || "Non spécifiées"],
      ["Référence :", orderNumber || "N/A"],
    ];

    autoTable(doc, {
      startY: orderInfoStartY,
      body: orderInfo,
      theme: "plain",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 45 },
        1: { cellWidth: 105 },
      },
      styles: { fontSize: 9 },
      margin: { left: 10, right: 10 },
    });

    const startItemsY = doc.lastAutoTable.finalY + 10;

    // 5️⃣ Tableau des articles
    const headers = [
      ["N°", "Désignation", "Qté", "P.U. HT", "Remise", "TVA", "Total HT"],
    ];

    const body = (items || []).map((item, index) => {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
      const discount = Number(item.discount || 0); // %
      const tvaRate = Number(item.tvaRate ?? 0); // %

      const lineHt = quantity * unitPrice * (1 - discount / 100);

      return [
        index + 1,
        item.productName || item.designation || "-",
        quantity.toFixed(2),
        `${unitPrice.toFixed(3)} TND`,
        `${discount.toFixed(2)}%`,
        `${tvaRate.toFixed(2)}%`,
        `${lineHt.toFixed(3)} TND`,
      ];
    });

    autoTable(doc, {
      startY: startItemsY,
      head: headers,
      body,
      theme: "grid",
      margin: { left: 10, right: 10 },
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 },
      },
    });

    // 6️⃣ Totaux
    const totalsY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    const totals = [
      { label: "Total HT :", value: Number(totalHT || 0) },
      { label: "Total TVA :", value: Number(totalTVA || 0) },
      { label: "Total TTC :", value: Number(totalTTC || 0) },
    ];

    totals.forEach((t, idx) => {
      doc.text(
        `${t.label} ${t.value.toFixed(3)} TND`,
        pageWidth - 60,
        totalsY + idx * 7
      );
    });

    // 7️⃣ Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${companyName} - RCS Tunis B123456 - TVA FR40123456789`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    return doc.output("blob");
  } catch (error) {
    console.error("Erreur de génération PDF commande client :", error);
    throw error;
  }
};

/**
 * Génère et télécharge directement le PDF (async)
 */
export const downloadOrderClientPdf = async (
  params,
  fileName = "commande-client.pdf"
) => {
  const blob = await generateOrderClientPdfBlob(params);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

// Helper date FR
const formatDate = (value) => {
  if (!value) return "N/A";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("fr-FR");
};