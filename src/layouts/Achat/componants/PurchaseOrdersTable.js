// src/layouts/Sale/Data/PurchaseOrdersTable.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Table, Button } from 'react-bootstrap';

const PurchaseOrdersTable = ({ orders, onOpenBonReceptionForm, onOpenInvoiceForm }) => {
  return (
    <>
      
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Supplier</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.supplier}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
              <td>
                <Button variant="success" className="me-2" onClick={() => onOpenBonReceptionForm(order.id)}>
                  Bon de Réception
                </Button>
                <Button variant="info" onClick={() => onOpenInvoiceForm(order.id)}>
                  Invoice
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

// Add prop-types validation
PurchaseOrdersTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      supplier: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onOpenBonReceptionForm: PropTypes.func.isRequired, // Validate that this is a function
  onOpenInvoiceForm: PropTypes.func.isRequired, // Validate that this is a function
};

export default PurchaseOrdersTable;
