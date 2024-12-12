import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


const PdfBonDeReception = ({ invoice }) => {
  const handleDownloadPdf = () => {
    const input = document.getElementById('invoice');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('invoice.pdf');
      });
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
   
    <div>
      <div id="invoice" style={{ padding: '20px', backgroundColor: '#fff' }}>
        <h2>Facture</h2>
        <p>Numéro de Facture: {invoice.number}</p>
        <p>Date: {invoice.date}</p>
        <p>Client: {invoice.client}</p>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantité</th>
              <th>Prix Unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total: {invoice.total}</h3>
      </div>
      <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
        Exporter en PDF
      </Button>
    </div>
    </DashboardLayout>
  );
};

PdfBonDeReception.propTypes = {
  invoice: PropTypes.shape({
    number: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    client: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unitPrice: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

export default PdfBonDeReception;
