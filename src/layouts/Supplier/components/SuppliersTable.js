import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Pagination from 'react-bootstrap/Pagination'; // Bootstrap Pagination
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';

export function SuppliersTable({
  rows = [],
  rowsPerPage = 10, // Default number of rows per page
  onDelete,
  onUpdate,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const selectAllRef = useRef(null);

  // Calculate total pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // Get the rows to display for the current page
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

  // Checking if all rows are selected or some are selected
  const selectedAll = displayedRows.length > 0 && selectedIds.size === displayedRows.length;
  const selectedSome = selectedIds.size > 0 && selectedIds.size < displayedRows.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedSome;
    }
  }, [selectedSome]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="form-check-input"
                  ref={selectAllRef}
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
              <th>Référence</th>
              <th>Nom du responsable</th>
              <th>Raison sociale</th>
              <th>Matricule fiscal</th>
              <th>Chiffre affaires</th>
              <th>Actions</th>
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
                  <td>{row.nomResponsable}</td>
                  <td>{row.raisonSociale}</td>
                  <td>{row.matriculeFiscal}</td>
                  <td>{row.chiffreAffaires}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => onUpdate(row.id)}
                        size="small"
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => onDelete(row.id)}
                        size="small"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>

      {/* Pagination Controls */}
      <Divider />
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
    </Card>
  );
}

SuppliersTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      reference: PropTypes.string.isRequired,
      nomResponsable: PropTypes.string.isRequired,
      raisonSociale: PropTypes.string.isRequired,
      matriculeFiscal: PropTypes.string.isRequired,
      chiffreAffaires: PropTypes.number.isRequired,
    })
  ).isRequired,
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
