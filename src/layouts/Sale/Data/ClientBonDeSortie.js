import React, { useState } from 'react';
import { Table, Card, Container, Button, Row, Col, Badge, Pagination, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';


import { FaSearch, FaEdit, FaEye, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa'; // Icons for better visuals
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

const ClientBonDeSortie = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBonDeSortie, setSelectedBonDeSortie] = useState(null);
  const [filterMonth, setFilterMonth] = useState(''); // State for filtering by month

  // Sample Bon de Sortie Data
  const bonDeSortie = [
    { id: 301, client: 'Client A', status: 'Delivered', date: '2023-08-01', totalItems: 20 },
    { id: 302, client: 'Client B', status: 'Pending', date: '2023-08-15', totalItems: 15 },
    { id: 303, client: 'Client C', status: 'Pending', date: '2023-09-20', totalItems: 10 },
    // Add more Bon de Sortie records here
  ];

  // Handle viewing Bon de Sortie details
  const handleViewBonDeSortie = (bon) => {
    setSelectedBonDeSortie(bon);
    setShowModal(true);
  };

  // Handle filtering by month
  const handleFilterMonth = (event) => {
    setFilterMonth(event.target.value);
  };

  return (
    <DashboardLayout>
    
      <Container fluid className="my-4" style={{ background: 'linear-gradient(135deg, #f9f9f9, #e3f2fd)', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' }}>
        
        {/* Header Section */}
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2 className="fw-bold" style={{ color: '#2c3e50', fontSize: '28px', marginBottom: '10px' }}>Bon de Sortie</h2>
            <p className="text-muted" style={{ fontSize: '14px' }}>Manage all delivery out notes</p>
          </Col>

          {/* Add Clôture Button and Month Filter */}
          <Col md={6} className="text-md-end">
            <Form className="d-inline-flex me-2">
              <Form.Select 
                value={filterMonth}
                onChange={handleFilterMonth}
                className="me-2 shadow-sm"
                style={{ borderRadius: '25px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', padding: '10px 15px' }}
              >
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Form.Select>
              <Button 
                variant="primary" 
                className="d-flex align-items-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #007bff, #0056b3)', border: 'none', borderRadius: '25px', padding: '10px 20px' }}
              >
                <FaSearch className="me-2" /> Search
              </Button>
            </Form>

            <Button 
              variant="danger" 
              className="d-flex align-items-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #ff4757, #e84118)', border: 'none', borderRadius: '25px', padding: '10px 20px' }}
            >
              <FaCalendarAlt className="me-2" /> Clôturer
            </Button>
          </Col>
        </Row>

        {/* Bon de Sortie Table */}
        <Card className="shadow-lg rounded" style={{ borderRadius: '15px', background: '#ffffff' }}>
          <Card.Body style={{ padding: '2rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <Table striped hover responsive="xl" className="align-middle text-center table-hover" style={{ minWidth: '1300px', width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' }}>
                <thead className="bg-light" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', fontSize: '16px', fontWeight: 'bold' }}>
                  <tr>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Bon de Sortie ID</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Client</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Status</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Date</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Total Items</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bonDeSortie
                    .filter(bon => filterMonth === '' || bon.date.includes(`-${filterMonth}-`))
                    .map(bon => (
                      <tr key={bon.id} className="table-row-hover" style={{ background: '#fdfdfd', transition: 'background 0.3s', cursor: 'pointer' }}>
                        <td style={{ padding: '15px', fontWeight: '500' }}>{bon.id}</td>
                        <td style={{ padding: '15px' }}>{bon.client}</td>
                        <td style={{ padding: '15px' }}>
                          <Badge
                            pill
                            style={{
                              backgroundColor: bon.status === 'Delivered' ? '#28a745' : '#ffc107',
                              color: '#fff',
                              padding: '10px 15px',
                              fontSize: '14px',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {bon.status}
                          </Badge>
                        </td>
                        <td style={{ padding: '15px' }}>{bon.date}</td>
                        <td style={{ padding: '15px' }}>{bon.totalItems}</td>
                        <td style={{ padding: '15px' }}>
                          <OverlayTrigger placement="top" overlay={<Tooltip>View Bon de Sortie</Tooltip>}>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-2 d-flex align-items-center"
                              onClick={() => handleViewBonDeSortie(bon)}
                              style={{ borderRadius: '25px', padding: '8px 15px' }}
                            >
                              <FaEye className="me-1" /> View
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit Bon de Sortie</Tooltip>}>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="me-2 d-flex align-items-center"
                              style={{ borderRadius: '25px', padding: '8px 15px' }}
                            >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete Bon de Sortie</Tooltip>}>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="d-flex align-items-center"
                              style={{ borderRadius: '25px', padding: '8px 15px' }}
                            >
                              <FaTrashAlt className="me-1" /> Delete
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev style={{ borderRadius: '25px', padding: '10px 20px' }}>Previous</Pagination.Prev>
              <Pagination.Item active style={{ borderRadius: '25px', backgroundColor: '#007bff', color: '#fff', padding: '10px 20px' }}>{1}</Pagination.Item>
              <Pagination.Item style={{ borderRadius: '25px', padding: '10px 20px' }}>{2}</Pagination.Item>
              <Pagination.Item style={{ borderRadius: '25px', padding: '10px 20px' }}>{3}</Pagination.Item>
              <Pagination.Next style={{ borderRadius: '25px', padding: '10px 20px' }}>Next</Pagination.Next>
            </Pagination>
          </Card.Body>
        </Card>

        {/* Modal for Viewing Bon de Sortie Details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton style={{ background: '#007bff', color: '#fff' }}>
            <Modal.Title>Bon de Sortie Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBonDeSortie ? (
              <>
                <p><strong>Bon de Sortie ID:</strong> {selectedBonDeSortie.id}</p>
                <p><strong>Client:</strong> {selectedBonDeSortie.client}</p>
                <p><strong>Status:</strong> {selectedBonDeSortie.status}</p>
                <p><strong>Date:</strong> {selectedBonDeSortie.date}</p>
                <p><strong>Total Items:</strong> {selectedBonDeSortie.totalItems}</p>
              </>
            ) : (
              <p>No Bon de Sortie details available</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default ClientBonDeSortie;
