import React, { useState } from 'react';
import { Table, Card, Container, Button, Row, Col, Badge, Pagination, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { FaSearch, FaEdit, FaEye, FaTruck, FaTrashAlt } from 'react-icons/fa'; // Icons for better visuals

const ClientDeliveryNotes = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState(null);

  // Sample Delivery Notes Data
  const deliveryNotes = [
    { id: 101, client: 'Client A', status: 'Delivered', date: '2023-09-01', totalItems: 10 },
    { id: 102, client: 'Client B', status: 'In Progress', date: '2023-09-05', totalItems: 8 },
    { id: 103, client: 'Client C', status: 'Pending', date: '2023-09-10', totalItems: 15 },
    // Add more delivery notes here
  ];

  // Handle viewing delivery note details
  const handleViewDeliveryNote = (note) => {
    setSelectedDeliveryNote(note);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container fluid className="my-4" style={{ background: 'linear-gradient(135deg, #f9f9f9, #e3f2fd)', padding: '40px', borderRadius: '10px' }}>
        {/* Header Section */}
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2 className="fw-bold" style={{ color: '#2c3e50', fontSize: '28px' }}>Delivery Notes</h2>
            <p className="text-muted" style={{ fontSize: '14px' }}>Manage all delivery notes effectively</p>
          </Col>
          <Col md={6} className="text-md-end">
            <Form className="d-inline-flex">
              <Form.Control 
                type="search" 
                placeholder="Search delivery notes..." 
                className="me-2 shadow-sm"
                style={{ borderRadius: '25px' }} 
              />
              <Button 
                variant="primary" 
                className="d-flex align-items-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #007bff, #0056b3)', border: 'none', borderRadius: '25px' }}
              >
                <FaSearch className="me-2" /> Search
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Delivery Notes Table */}
        <Card className="shadow-lg rounded" style={{ borderRadius: '15px', background: '#ffffff' }}>
          <Card.Body style={{ padding: '2rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <Table striped hover responsive="xl" className="align-middle text-center" style={{ minWidth: '1300px', width: '100%' }}>
                <thead className="bg-light" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', fontSize: '16px', fontWeight: 'bold' }}>
                  <tr>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Delivery Note ID</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Client</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Status</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Date</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Total Items</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryNotes.map(note => (
                    <tr key={note.id} className="table-row-hover" style={{ background: '#fdfdfd', transition: 'background 0.3s' }}>
                      <td style={{ padding: '15px' }}>{note.id}</td>
                      <td style={{ padding: '15px' }}>{note.client}</td>
                      <td style={{ padding: '15px' }}>
                        <Badge
                          pill
                          style={{
                            backgroundColor: note.status === 'Delivered' ? '#28a745' : note.status === 'In Progress' ? '#17a2b8' : '#ffc107',
                            color: '#fff',
                            padding: '10px 15px',
                            fontSize: '14px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {note.status}
                        </Badge>
                      </td>
                      <td style={{ padding: '15px' }}>{note.date}</td>
                      <td style={{ padding: '15px' }}>{note.totalItems}</td>
                      <td style={{ padding: '15px' }}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>View Delivery Note</Tooltip>}>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2 d-flex align-items-center"
                            onClick={() => handleViewDeliveryNote(note)}
                            style={{ borderRadius: '25px', padding: '8px 15px' }}
                          >
                            <FaEye className="me-1" /> View
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit Delivery Note</Tooltip>}>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2 d-flex align-items-center"
                            style={{ borderRadius: '25px', padding: '8px 15px' }}
                          >
                            <FaEdit className="me-1" /> Edit
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete Delivery Note</Tooltip>}>
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

        {/* Modal for Viewing Delivery Note Details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton style={{ background: '#007bff', color: '#fff' }}>
            <Modal.Title>Delivery Note Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDeliveryNote ? (
              <>
                <p><strong>Delivery Note ID:</strong> {selectedDeliveryNote.id}</p>
                <p><strong>Client:</strong> {selectedDeliveryNote.client}</p>
                <p><strong>Status:</strong> {selectedDeliveryNote.status}</p>
                <p><strong>Date:</strong> {selectedDeliveryNote.date}</p>
                <p><strong>Total Items:</strong> {selectedDeliveryNote.totalItems}</p>
              </>
            ) : (
              <p>No delivery note details available</p>
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

export default ClientDeliveryNotes;
