import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination';

export function ProductsTable({
  rows = [],
  rowsPerPage = 10,
  onDelete,
  onUpdate,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const displayedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const selectAll = () => setSelectedIds(new Set(displayedRows.map(row => row.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const selectOne = (id) => setSelectedIds(new Set(selectedIds.add(id)));
  const deselectOne = (id) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const selectedAll = displayedRows.length > 0 && selectedIds.size === displayedRows.length;
  const selectedSome = selectedIds.size > 0 && selectedIds.size < displayedRows.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedAll}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </th>
              <th scope="col">Référence</th>
              <th scope="col">Nom / Catégories / Marque</th>
              <th scope="col">Prix de vente</th>
              <th scope="col">En stock</th>
              <th scope="col">TVA</th>
              <th scope="col">Taxe</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row) => {
              const isSelected = selectedIds.has(row.id);

              return (
                <tr key={row.id} className={isSelected ? 'table-primary' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </td>
                  <td>{row.reference}</td>
                  <td>{row.name} / {row.category} / {row.brand}</td>
                  <td>{row.salePrice} DT</td>
                  <td>{row.Quantity}</td>
                  <td>{row.tva}%</td>
                  <td>{row.tax}%</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onUpdate(row.id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(row.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
}

ProductsTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      reference: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      brand: PropTypes.string.isRequired,
      salePrice: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      tva: PropTypes.number.isRequired,
      tax: PropTypes.number.isRequired,
    })
  ).isRequired,
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
