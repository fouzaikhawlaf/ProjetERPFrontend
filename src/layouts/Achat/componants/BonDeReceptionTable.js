// src/layouts/Sale/Data/BonDeReceptionTable.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Table } from 'react-bootstrap';

const BonDeReceptionTable = ({ receptions }) => {
  return (
    <>
      
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Supplier</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {receptions.map((reception) => (
            <tr key={reception.id}>
              <td>{reception.id}</td>
              <td>{reception.supplier}</td>
              <td>${reception.total}</td>
              <td>{reception.date}</td>
              <td>{reception.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

// Add prop-types validation
BonDeReceptionTable.propTypes = {
  receptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      supplier: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired, // Assuming date is in string format
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BonDeReceptionTable;
