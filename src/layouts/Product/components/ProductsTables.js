import React, { useState, useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination'; // Ensure Pagination is imported

export function ProductsTable({ rows = [], rowsPerPage = 10, onDelete, onUpdate }) {
  // Ensure rows is always an array
  const validRows = Array.isArray(rows) ? rows : [];

  // Debugging: Check the type of rows and log it
  console.log("Rows type:", typeof rows);  // Logs the type of rows
  console.log("Is rows an array?", Array.isArray(rows));  // Checks if rows is an array

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages based on validRows length
  const totalPages = Math.ceil(validRows.length / rowsPerPage);

  // Determine the rows to be displayed on the current page
  const displayedRows = validRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const selectAll = () => setSelectedIds(new Set(displayedRows.map((row) => row.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const toggleSelection = (id) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const selectedAll = displayedRows.length > 0 && selectedIds.size === displayedRows.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="card shadow-sm p-4">
        <h3 className="card-title text-center">Liste des Produits</h3>
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col" style={{ width: '5%' }}>
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
                <th scope="col" style={{ width: '10%' }}>Référence</th>
                <th scope="col" style={{ width: '20%' }}>Nom / Catégories / Marque</th>
                <th scope="col" style={{ width: '10%' }}>Prix de Vente</th>
                <th scope="col" style={{ width: '10%' }}>En Stock</th>
                <th scope="col" style={{ width: '10%' }}>TVA</th>
                <th scope="col" style={{ width: '10%' }}>Taxe</th>
                <th scope="col" style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr key={row.id} className={isSelected ? 'table-info' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isSelected}
                        onChange={() => toggleSelection(row.id)}
                      />
                    </td>
                    <td>{row.reference}</td>
                    <td>
                      <strong>{row.name}</strong> <br />
                      <small>{row.category}</small> <br />
                      <em>{row.brand}</em>
                    </td>
                    <td>{row.salePrice.toFixed(2)} DT</td>
                    <td>{row.Quantity}</td>
                    <td>{row.tva}%</td>
                    <td>{row.tax}%</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onUpdate(row.id)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(row.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Affichage de {Math.min((currentPage - 1) * rowsPerPage + 1, validRows.length)} à{' '}
            {Math.min(currentPage * rowsPerPage, validRows.length)} sur {validRows.length} produits
          </div>
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
    </DashboardLayout>
  );
}
