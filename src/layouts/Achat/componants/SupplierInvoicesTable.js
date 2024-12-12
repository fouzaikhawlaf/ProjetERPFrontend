// src/layouts/Sale/Data/SupplierInvoicesTable.js
import React from 'react';
import PropTypes from 'prop-types'; // Import prop-types
import { Table, Button } from 'react-bootstrap';

const SupplierInvoicesTable = ({ invoices }) => {
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
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.supplier}</td>
              <td>${invoice.total}</td>
              <td>{invoice.status}</td>
              <td>
                <Button variant="info">View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

// Add prop-types validation
SupplierInvoicesTable.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      supplier: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SupplierInvoicesTable;
