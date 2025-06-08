import { jsPDF } from "jspdf";
import "jspdf-autotable";

const generateDevisPDF = (devisData, clientData, items) => {
  const doc = new jsPDF();
  
  // Add logo or header
  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('DEVIS CLIENT', 105, 20, { align: 'center' });
  
  // Company info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Votre Société', 14, 30);
  doc.text('Adresse: 123 Rue Principale', 14, 35);
  doc.text('Tél: +123 456 789', 14, 40);
  doc.text('Email: contact@votresociete.com', 14, 45);
  
  // Client info
  doc.text(`Client: ${clientData?.name || 'Non spécifié'}`, 140, 30);
  doc.text(`Référence: ${devisData.reference}`, 140, 35);
  doc.text(`Date: ${devisData.creationDate}`, 140, 40);
  doc.text(`Échéance: ${devisData.expirationDate}`, 140, 45);
  
  // Add a line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 50, 196, 50);
  
  // Items table - ensure numeric values are properly converted
  const tableData = items.map((item, index) => [
    index + 1,
    item.product?.code || 'N/A',
    item.designation,
    item.quantite,
    `${Number(item.prixUnitaire).toFixed(2)} TND`,
    `${item.tva}%`,
    `${(Number(item.quantite) * Number(item.prixUnitaire)).toFixed(2)} TND`
  ]);
  
  doc.autoTable({
    startY: 60,
    head: [['#', 'Code', 'Désignation', 'Qté', 'Prix Unitaire', 'TVA', 'Total HT']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [40, 53, 147],
      textColor: 255
    },
    margin: { left: 14 }
  });
  
  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.text(`Total HT: ${devisData.totalHT} TND`, 140, finalY);
  doc.text(`Total TVA: ${devisData.totalTVA} TND`, 140, finalY + 5);
  doc.text(`Total TTC: ${devisData.totalTTC} TND`, 140, finalY + 10);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Merci pour votre confiance!', 105, 280, { align: 'center' });
  
  return doc;
};

export default generateDevisPDF;