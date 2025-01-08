import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/Pagination';
import Avatar from '@mui/material/Avatar';
import 'bootstrap/dist/css/bootstrap.min.css';

export function ProductsTable({ rows = [], rowsPerPage = 10, onDelete, onUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const displayedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Liste des Produits</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th scope="col">
                <input type="checkbox" className="form-check-input" />
              </th>
              <th scope="col">Nom</th>
              <th scope="col">Type</th>
              <th scope="col">Prix de vente</th>
              <th scope="col">Stock</th>
              <th scope="col">TVA (%)</th>
             
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.length > 0 ? (
              displayedRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td>{row.name}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {row.brand ? <Avatar>{row.brand[0]}</Avatar> : <Avatar>N</Avatar>}
                      <span className="ms-2">{`${row.productType} `}</span>
                    </div>
                  </td>
                  <td>{row.salePrice || '0.00'}</td>
                  <td>{row.Quantity || '0'}</td>
                  <td>{row.taxRate || '0'}</td>
                 
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => onUpdate(row.id)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(row.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </div>
  );
}

ProductsTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      reference: PropTypes.string,
      name: PropTypes.string,
      category: PropTypes.string,
      brand: PropTypes.string,
      salePrice: PropTypes.number,
      Quantity: PropTypes.number,
      tva: PropTypes.number,
      tax: PropTypes.number,
    })
  ).isRequired,
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

ProductsTable.defaultProps = {
  rowsPerPage: 10,
};
