import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = () => {
  // 1. Initialiser le document
  const doc = new jsPDF("p", "pt", "a4"); // "p" = portrait, "pt" = points, "a4" = format
  const pageWidth = doc.internal.pageSize.getWidth();

  // 2. Récupérer le nom du fournisseur
  const selectedSupplierObj = suppliers.find(
    (sup) => sup.supplierID === selectedSupplier
  );
  const selectedSupplierName = selectedSupplierObj ? selectedSupplierObj.name : "";

  // 3. Entête (vous pouvez ajouter un logo en base64 si besoin)
  doc.setFontSize(16);
  doc.text("Devis N°", 40, 50);

  // Date de création en haut à droite
  doc.setFontSize(10);
  doc.text(`Date : ${new Date().toLocaleDateString()}`, pageWidth - 100, 50);

  // 4. Coordonnées de l'entreprise (en haut à gauche)
  doc.setFontSize(10);
  doc.text("Mon Entreprise", 40, 70);
  doc.text("Adresse", 40, 85);
  doc.text("Ville, Code Postal", 40, 100);
  doc.text("Téléphone, Email", 40, 115);

  // 5. Coordonnées du client / Fournisseur (en haut à droite)
  doc.text(`Fournisseur : ${selectedSupplierName}`, pageWidth - 200, 70);
  doc.text(`Numéro de devis : ${devisNumber}`, pageWidth - 200, 85);
  doc.text(`Date de validité : ${validityDate}`, pageWidth - 200, 100);

  // 6. Informations diverses (Description, Notes, etc.)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Informations du Devis :", 40, 150);

  doc.setFont("helvetica", "normal");
  let yPos = 165;
  doc.text(`Description : ${description}`, 40, yPos);
  yPos += 15;
  doc.text(`Notes : ${notes}`, 40, yPos);
  yPos += 15;
  doc.text(`Type de service : ${serviceType}`, 40, yPos);
  yPos += 15;
  doc.text(`Date de début : ${startDate}`, 40, yPos);
  yPos += 15;
  doc.text(`Date de fin : ${endDate}`, 40, yPos);
  yPos += 15;
  doc.text(`Durée : ${calculateDuration()} heures`, 40, yPos);
  yPos += 30;

  // 7. Tableau des articles (avec autoTable)
  const columns = [
    { header: "Désignation", dataKey: "designation" },
    { header: "Quantité", dataKey: "quantite" },
    { header: "Prix Unitaire (TND)", dataKey: "prixUnitaire" },
    { header: "TVA (%)", dataKey: "tva" },
  ];

  // Transforme votre liste `items` en format pour autoTable
  const rows = items.map((item) => ({
    designation: item.designation,
    quantite: item.quantite,
    prixUnitaire: item.prixUnitaire.toFixed(2),
    tva: item.tva,
  }));

  autoTable(doc, {
    startY: yPos,
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => [
      row.designation,
      row.quantite,
      row.prixUnitaire,
      row.tva,
    ]),
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [220, 220, 220] }, // Couleur d'en-tête
    columnStyles: {
      0: { cellWidth: 150 }, // Largeur première colonne
      1: { cellWidth: 60 },
      2: { cellWidth: 80 },
      3: { cellWidth: 60 },
    },
  });

  // Récupère la coordonnée Y finale du tableau
  const finalY = doc.lastAutoTable.finalY;

  // 8. Section Totaux
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total HT : ${calculateTotalHT()} TND`, 40, finalY + 30);
  doc.text(`Total TVA : ${calculateTotalVAT()} TND`, 40, finalY + 45);
  doc.text(`Total TTC : ${calculateTotalTTC()} TND`, 40, finalY + 60);

  // 9. Footer (Modalités, signature, etc.)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Modalités et conditions :", 40, finalY + 90);
  doc.text("Signature / Bon pour accord :", pageWidth - 200, finalY + 90);

  // 10. Enregistrer / Télécharger le PDF
  doc.save("devis-service.pdf");
};
