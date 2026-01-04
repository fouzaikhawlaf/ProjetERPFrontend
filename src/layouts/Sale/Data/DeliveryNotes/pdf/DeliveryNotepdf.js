// src/pdf/deliveryNotePdf.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoShamash from "../../../../../images/imageShamash.png";

// ---------- Helpers ----------
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
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });

const safeText = (v) => (typeof v === "string" ? v.trim() : v ?? "");
const pickFirstNonEmpty = (...vals) => {
  for (const v of vals) {
    const s = safeText(v);
    if (s) return s;
  }
  return "";
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("fr-FR");
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "N/A";
  return `${d.toLocaleDateString("fr-FR")} à ${d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const fmtMoney = (n) => `${Number(n || 0).toFixed(3)} TND`;
const fmtPct = (n) => `${Number(n || 0).toFixed(2)}%`;

const normalizeItems = (items) => {
  if (Array.isArray(items)) return items;
  if (Array.isArray(items?.$values)) return items.$values; // .NET
  if (Array.isArray(items?.items)) return items.items;
  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const computeFromItems = (items) => {
  const acc = {
    totalBrutHT: 0,
    totalDiscount: 0,
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
    discountWeightedSum: 0,
    htByRate: {},
    tvaByRate: {},
  };

  (items || []).forEach((item) => {
    const qty = Number(item.quantity ?? item.Quantity ?? 0);
    const unitPrice = Number(item.unitPrice ?? item.price ?? item.Price ?? 0);
    const discount = Number(item.discount ?? item.Discount ?? 0);
    const tvaRate = Number(item.tvaRate ?? item.TvaRate ?? item.TVARate ?? 0);

    const brutHT = qty * unitPrice;

    const lineHT = Number(
      item.lineTotalHT ??
        item.LineTotalHT ??
        brutHT * (1 - discount / 100)
    );

    const lineTVA = Number(
      item.lineTotalTVA ??
        item.LineTotalTVA ??
        lineHT * (tvaRate / 100)
    );

    const lineTTC = Number(
      item.lineTotalTTC ?? item.LineTotalTTC ?? lineHT + lineTVA
    );

    const discountAmount = brutHT - lineHT;

    acc.totalBrutHT += Number.isFinite(brutHT) ? brutHT : 0;
    acc.totalDiscount += Number.isFinite(discountAmount) ? discountAmount : 0;
    acc.totalHT += Number.isFinite(lineHT) ? lineHT : 0;
    acc.totalTVA += Number.isFinite(lineTVA) ? lineTVA : 0;
    acc.totalTTC += Number.isFinite(lineTTC) ? lineTTC : 0;

    acc.discountWeightedSum +=
      Number.isFinite(brutHT) && Number.isFinite(discount) ? brutHT * discount : 0;

    const rateKey = Number.isFinite(tvaRate) ? tvaRate.toFixed(2) : "0.00";
    acc.htByRate[rateKey] =
      (acc.htByRate[rateKey] || 0) + (Number.isFinite(lineHT) ? lineHT : 0);
    acc.tvaByRate[rateKey] =
      (acc.tvaByRate[rateKey] || 0) + (Number.isFinite(lineTVA) ? lineTVA : 0);
  });

  const avgDiscountPct =
    acc.totalBrutHT > 0 ? acc.discountWeightedSum / acc.totalBrutHT : 0;

  const htByRateEntries = Object.entries(acc.htByRate)
    .map(([rate, amount]) => ({ rate: Number(rate), amount }))
    .sort((a, b) => a.rate - b.rate);

  const tvaByRateEntries = Object.entries(acc.tvaByRate)
    .map(([rate, amount]) => ({ rate: Number(rate), amount }))
    .sort((a, b) => a.rate - b.rate);

  const sumTvaByRate = tvaByRateEntries.reduce((s, x) => s + (x.amount || 0), 0);

  return { ...acc, avgDiscountPct, htByRateEntries, tvaByRateEntries, sumTvaByRate };
};

// ---------- Style ----------
const PURPLE = { r: 109, g: 73, b: 181 };
const LIGHT_BG = { r: 245, g: 245, b: 250 };
const BORDER_GRAY = { r: 220, g: 220, b: 220 };

const drawPageFrame = (doc, pageWidth, pageHeight) => {
  doc.setDrawColor(PURPLE.r, PURPLE.g, PURPLE.b);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
};

const drawTopTitle = ({ doc, title }) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(PURPLE.r, PURPLE.g, PURPLE.b);
  doc.text(title, 14, 24);
  doc.setTextColor(0);
};

const drawSeparator = (doc, y, pageWidth) => {
  doc.setDrawColor(PURPLE.r, PURPLE.g, PURPLE.b);
  doc.setLineWidth(1.2);
  doc.line(14, y, pageWidth - 14, y);
};

const drawCompanyBlock = ({ doc, x, y, companyName, companyAddress, companyPhone, companyEmail }) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(companyName || "Société", x, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const lines = [];
  if (companyAddress) lines.push(companyAddress);
  if (companyPhone) lines.push(`Téléphone : ${companyPhone}`);
  if (companyEmail) lines.push(`E-mail : ${companyEmail}`);

  doc.text(lines, x, y + 6);
};

const drawClientBlock = ({
  doc,
  x,
  y,
  clientName,
  clientAddress,
  clientPhone,
  clientEmail,
  align = "right",
}) => {
  const name = pickFirstNonEmpty(clientName, "Client");
  const address = safeText(clientAddress);
  const phone = safeText(clientPhone);
  const email = safeText(clientEmail);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(name, x, y, { align });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const lines = [];
  if (address) lines.push(address);
  if (phone) lines.push(`Téléphone : ${phone}`);
  if (email) lines.push(`E-mail : ${email}`);

  if (lines.length) doc.text(lines, x, y + 6, { align });
};

const drawInfoBox = ({ doc, x, y, w, rows }) => {
  doc.setFillColor(LIGHT_BG.r, LIGHT_BG.g, LIGHT_BG.b);
  doc.setDrawColor(BORDER_GRAY.r, BORDER_GRAY.g, BORDER_GRAY.b);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, 26, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const lineY = y + 8;
  const gap = 6;

  rows.slice(0, 4).forEach((r, idx) => {
    const yy = lineY + idx * gap;
    doc.setFont("helvetica", "normal");
    doc.text(`${r.label} :`, x + 6, yy);
    doc.setFont("helvetica", "bold");
    doc.text(`${r.value ?? "—"}`, x + 44, yy);
  });

  doc.setFont("helvetica", "normal");
};

// Footer minimal : pagination
const drawFooterMinimal = ({ doc, pageWidth, pageHeight }) => {
  const totalPages = doc.getNumberOfPages();
  const current = doc.internal.getCurrentPageInfo().pageNumber;
  doc.setTextColor(120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Page ${current}/${totalPages}`, pageWidth - 14, pageHeight - 10, { align: "right" });
  doc.setTextColor(0);
};

// ---------- Main ----------
export const generateDeliveryNotePdfBlob = async ({
  deliveryNumber,
  deliveryDate,
  deliveryMode,
  orderClientId,

  // ✅ on accepte plusieurs noms/champs (au cas où ton objet change)
  clientName,
  clientAddress,
  clientPhone,
  clientEmail,

  // ✅ option : tu peux passer un objet client directement
  client, // { name, address, phone, email } (optionnel)

  items,
  totalHT,
  totalTVA,
  totalTTC,

  deliveredAt,
  driverName = "",
  signatureName = "",

  logoUrl,
  companyName = "Société Shamash IT",
  companyAddress = "étage B03, Centre Urbain Nord, Imm cercle des bureaux",
  companyPhone = "+216 29 511 251",
  companyEmail = "contact@shamash-it.com",
} = {}) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ✅ FIX: pas de "logoSh" : uniquement logoShamash
    const effectiveLogoUrl = logoUrl || logoShamash || null;
    let logoDataUrl = null;
    if (effectiveLogoUrl) {
      try {
        logoDataUrl = await loadImageAsDataUrl(effectiveLogoUrl);
      } catch {}
    }

    // ✅ Normalisation client (fallbacks)
    const finalClientName = pickFirstNonEmpty(
      clientName,
      client?.name,
      client?.clientName,
      client?.nom
    );

    const finalClientAddress = pickFirstNonEmpty(
      clientAddress,
      client?.address,
      client?.adresse,
      client?.clientAddress
    );

    const finalClientPhone = pickFirstNonEmpty(
      clientPhone,
      client?.phone,
      client?.telephone,
      client?.tel
    );

    const finalClientEmail = pickFirstNonEmpty(
      clientEmail,
      client?.email,
      client?.mail
    );

    const normalizedItems = normalizeItems(items);
    const calc = computeFromItems(normalizedItems);

    const tHT = Number.isFinite(Number(totalHT)) ? Number(totalHT) : calc.totalHT;
    const tTVA = Number.isFinite(Number(totalTVA)) ? Number(totalTVA) : calc.totalTVA;
    const tTTC = Number.isFinite(Number(totalTTC)) ? Number(totalTTC) : calc.totalTTC;

    const renderStaticHeader = () => {
      drawPageFrame(doc, pageWidth, pageHeight);
      drawTopTitle({ doc, title: "BON DE LIVRAISON" });

      if (logoDataUrl) {
        try {
          doc.addImage(logoDataUrl, "PNG", pageWidth - 52, 14, 36, 18);
        } catch {}
      }

      drawCompanyBlock({
        doc,
        x: 14,
        y: 34,
        companyName,
        companyAddress,
        companyPhone,
        companyEmail,
      });

      drawClientBlock({
        doc,
        x: pageWidth - 14,
        y: 34,
        clientName: finalClientName || "Non spécifié",
        clientAddress: finalClientAddress,
        clientPhone: finalClientPhone,
        clientEmail: finalClientEmail,
        align: "right",
      });

      drawInfoBox({
        doc,
        x: 14,
        y: 60,
        w: 92,
        rows: [
          { label: "Référence", value: deliveryNumber || "N/A" },
          { label: "Date livraison", value: deliveryDate ? formatDate(deliveryDate) : "N/A" },
          { label: "N° commande", value: orderClientId || "N/A" },
          { label: "Mode", value: deliveryMode || "N/A" },
        ],
      });

      drawSeparator(doc, 96, pageWidth);
    };

    renderStaticHeader();

    // ---------- Items ----------
    const tableStartY = 102;

    const head = [[
      "Réf. Produit",
      "Quantité",
      "PU HT",
      "Remise",
      "TVA",
      "Total TTC",
    ]];

    const body = normalizedItems.map((item) => {
      const qty = Number(item.quantity ?? item.Quantity ?? 0);
      const unitPrice = Number(item.unitPrice ?? item.price ?? item.Price ?? 0);
      const discount = Number(item.discount ?? item.Discount ?? 0);
      const tvaRate = Number(item.tvaRate ?? item.TvaRate ?? item.TVARate ?? 0);

      const brutHT = qty * unitPrice;
      const lineHT = Number(item.lineTotalHT ?? item.LineTotalHT ?? brutHT * (1 - discount / 100));
      const lineTVA = Number(item.lineTotalTVA ?? item.LineTotalTVA ?? lineHT * (tvaRate / 100));
      const lineTTC = Number(item.lineTotalTTC ?? item.LineTotalTTC ?? lineHT + lineTVA);

      const name =
        item.productName ||
        item.ProductName ||
        item.designation ||
        `Produit #${item.productId || item.ProductId || ""}`;

      return [
        name,
        qty.toFixed(2),
        fmtMoney(unitPrice),
        discount ? fmtPct(discount) : "—",
        tvaRate ? fmtPct(tvaRate) : "—",
        fmtMoney(lineTTC),
      ];
    });

    autoTable(doc, {
      startY: tableStartY,
      head,
      body,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2.5, overflow: "linebreak" },
      headStyles: { fontStyle: "bold", textColor: 0 },
      didParseCell: (data) => {
        data.cell.styles.lineWidth = 0.2;
        data.cell.styles.lineColor = [220, 220, 220];
      },
      // Réf produit réduit
      columnStyles: {
        0: { cellWidth: 74 },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: 24, halign: "right" },
        3: { cellWidth: 18, halign: "right" },
        4: { cellWidth: 14, halign: "right" },
        5: { cellWidth: 34, halign: "right" },
      },
      margin: { left: 14, right: 14, top: 104, bottom: 26 },
      didDrawPage: () => {
        renderStaticHeader();
      },
    });

    // ---------- Bas fixe ----------
    const FOOTER_SAFE = 18;
    const RESERVED_BOTTOM = 74;
    let yStartBottom = pageHeight - FOOTER_SAFE - RESERVED_BOTTOM;

    if (doc.lastAutoTable.finalY > yStartBottom - 6) {
      doc.addPage();
      renderStaticHeader();
      yStartBottom = pageHeight - FOOTER_SAFE - RESERVED_BOTTOM;
    }

    let y = yStartBottom;

    // Totaux à droite (sans tableau)
    doc.setFontSize(11);
    const xLabel = pageWidth - 80;
    const xValue = pageWidth - 14;

    const line = (label, value, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.text(label, xLabel, y, { align: "right" });
      doc.text(value, xValue, y, { align: "right" });
      y += 6;
    };

    line("TOTAL HT :", fmtMoney(tHT));
    line("TOTAL TVA :", fmtMoney(tTVA));
    line("TOTAL TTC :", fmtMoney(tTTC));

    y += 2;
    doc.setDrawColor(BORDER_GRAY.r, BORDER_GRAY.g, BORDER_GRAY.b);
    doc.setLineWidth(0.3);
    doc.line(pageWidth - 120, y, pageWidth - 14, y);
    y += 6;

    line("MONTANT À PAYER :", fmtMoney(tTTC), true);

    y += 2;
    drawSeparator(doc, y, pageWidth);
    y += 10;

    // Livraison + signature
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Informations de livraison", 14, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 8;

    doc.text(
      `Date et heure de livraison : ${deliveredAt ? formatDateTime(deliveredAt) : formatDate(deliveryDate)}`,
      14,
      y
    );
    y += 6;

    doc.text(`Livreur : ${driverName || "—"}`, 14, y);

    doc.setFont("helvetica", "bold");
    doc.text("Signature :", pageWidth / 2 + 6, y - 6);

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 + 6, y + 10, pageWidth - 14, y + 10);

    doc.setFont("helvetica", "normal");
    if (signatureName) doc.text(signatureName, pageWidth / 2 + 6, y + 6);

    // Pagination
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawFooterMinimal({ doc, pageWidth, pageHeight });
    }

    return doc.output("blob");
  } catch (error) {
    console.error("Erreur de génération PDF bon de livraison :", error);
    throw error;
  }
};

export const downloadDeliveryNotePdf = async (params, fileName = "bon-de-livraison.pdf") => {
  const blob = await generateDeliveryNotePdfBlob(params);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
