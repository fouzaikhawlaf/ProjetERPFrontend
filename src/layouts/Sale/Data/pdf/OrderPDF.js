import { jsPDF } from "jspdf";
import "jspdf-autotable";

const generateOrderPDF = (orderData, clientData, items) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('COMMANDE CLIENT', 105, 20, { align: 'center' });
  
  // Info société
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Société: Votre Entreprise', 14, 30);
  doc.text('Adresse: 456 Rue Commerciale', 14, 35);
  doc.text('Tél: +987 654 321', 14, 40);
  doc.text('Email: sales@entreprise.com', 14, 45);
  
  // Info client et commande
  doc.text(`Client: ${clientData?.name || 'Non spécifié'}`, 140, 30);
  doc.text(`N° Commande: ${orderData.orderNumber}`, 140, 35);
  doc.text(`Date: ${orderData.orderDate}`, 140, 40);
  doc.text(`Livraison: ${orderData.deliveryDate}`, 140, 45);
  doc.text(`Paiement: ${orderData.paymentTerms}`, 140, 50);
  
  // Ligne séparatrice
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 55, 196, 55);
  
  // Tableau des articles
  const tableData = items.map((item, index) => [
    index + 1,
    item.productCode || 'N/A',
    item.designation,
    item.quantity,
    `${Number(item.unitPrice).toFixed(2)} TND`,
    `${item.discount || 0}%`,
    `${(item.quantity * item.unitPrice * (1 - (item.discount || 0)/100)).toFixed(2)} TND`
  ]);
  
  doc.autoTable({
    startY: 60,
    head: [['#', 'Référence', 'Désignation', 'Qté', 'Prix Unitaire', 'Remise', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [40, 53, 147],
      textColor: 255
    },
    margin: { left: 14 }
  });
  
  // Totaux
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.text(`Total HT: ${orderData.totalHT} TND`, 140, finalY);
  doc.text(`Total TVA: ${orderData.totalTVA} TND`, 140, finalY + 5);
  doc.text(`Total TTC: ${orderData.totalTTC} TND`, 140, finalY + 10);
  
  // Conditions générales
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(orderData.notes || 'Conditions générales de vente applicables', 14, finalY + 20, {
    maxWidth: 180
  });
  
  // Footer
  doc.text('Merci pour votre commande!', 105, 280, { align: 'center' });
  
  return doc;
};

export default generateOrderPDF;