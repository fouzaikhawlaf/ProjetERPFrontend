import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/Pagination';
import Avatar from '@mui/material/Avatar';
import { getClients } from 'services/ApiClient';
import 'bootstrap/dist/css/bootstrap.min.css';

export function CustomersTable({ rowsPerPage = 10, onDelete, onUpdate }) {
  const [clients, setClients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const selectAllRef = useRef(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);

      try {
        const { clients, totalCount } = await getClients(currentPage, rowsPerPage);
        console.log('Fetched clients:', clients);
        setClients(clients || []);
        setTotalCount(totalCount || 0);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please try again.');
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentPage, rowsPerPage]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th scope="col">
                <input type="checkbox" className="form-check-input" ref={selectAllRef} />
              </th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Phone</th>
              <th scope="col">Notes</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(clients) && clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      {client.avatar ? <Avatar src={client.avatar} /> : <Avatar>{client.name?.[0]}</Avatar>}
                      <span className="ms-2">{client.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>{client.email || 'No email'}</td>
                  <td>
                    {client.address
                      ? `${client.address.city}, ${client.address.state}, ${client.address.country}`
                      : 'No address'}
                  </td>
                  <td>{client.phone || 'No phone'}</td>
                  <td>{client.notes || 'No notes'}</td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => onUpdate(client.id)}>
                      Update
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(client.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No clients found.
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
CustomersTable.propTypes = {
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

CustomersTable.defaultProps = {
  rowsPerPage: 10,
};
export default CustomersTable;