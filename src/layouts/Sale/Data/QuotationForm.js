import React, { useState } from 'react';
import './Quotation.css'; // Assuming a CSS file for better styling and modularity
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

const QuotationForm = () => {
  const [client, setClient] = useState('');
  const [expirationDate, setExpirationDate] = useState('2025-01-28');
  const [priceList, setPriceList] = useState('Standard');
  const [paymentTerms, setPaymentTerms] = useState('Immediate');

  return (
    <DashboardLayout>
    <div className="quotation-container">
      <header className="quotation-header">
        <h1>Nouveau</h1>
        <div className="quotation-actions">
          <button className="btn">Envoyer par e-mail</button>
          <button className="btn btn-confirm">Confirmer</button>
          <button className="btn">Aperçu</button>
        </div>
      </header>

      <div className="quotation-body">
        <div className="client-section">
          <label htmlFor="client">Client</label>
          <input
            type="text"
            id="client"
            placeholder="Tapez pour trouver un client..."
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>

        <div className="details-section">
          <div>
            <label>Expiration</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          <div>
            <label>Liste de prix</label>
            <select value={priceList} onChange={(e) => setPriceList(e.target.value)}>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <label>Conditions de paiement</label>
            <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
              <option value="Immediate">Immédiat</option>
              <option value="30 Days">30 jours</option>
            </select>
          </div>
        </div>

        <div className="tabs">
          <button className="tab active">Lignes de commande</button>
          <button className="tab">Produits optionnels</button>
          <button className="tab">Autres informations</button>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Taxes</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="add-row">Ajouter un produit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="quotation-footer">
        <div className="total-section">
          <strong>Total: </strong>
          <span>0,000 DT</span>
        </div>
      </footer>
    </div>
    </DashboardLayout>
  );
};

export default QuotationForm;
