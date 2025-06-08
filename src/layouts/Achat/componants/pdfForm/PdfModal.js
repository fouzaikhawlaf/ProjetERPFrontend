import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import CommandePDF from '../pdfForm/CommandePDF';
import PropTypes from 'prop-types'; // Add this import
const PdfModal = ({ commande, onClose }) => {
  const pdfRef = useRef();

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
    onAfterPrint: () => onClose(), // Close modal after printing
  });

  // Handle saving
  const handleSave = () => {
    // Logic to save the PDF (e.g., using a download link)
    // After saving, close the modal
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {/* PDF Preview */}
        <div style={{ display: 'none' }}>
          <CommandePDF ref={pdfRef} commande={commande} />
        </div>

        {/* Buttons */}
        <div className="modal-actions">
          <button onClick={handlePrint}>Print</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
// Add prop-type validation
PdfModal.propTypes = {
    commande: PropTypes.shape({
      orderNumber: PropTypes.string.isRequired,
      supplierName: PropTypes.string,
      validityDate: PropTypes.string,
      reference: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          designation: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          unitPrice: PropTypes.number.isRequired,
          tva: PropTypes.number.isRequired,
        })
      ).isRequired,
      totalHT: PropTypes.string.isRequired,
      totalVAT: PropTypes.string.isRequired,
      totalTTC: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired, // Add this
  };
export default PdfModal;