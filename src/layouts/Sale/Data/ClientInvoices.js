import React, { useState } from 'react';
import { Table, Card, Container, Button, Row, Col, Badge, Pagination, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { FaSearch, FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa'; // Icons for better visuals

const ClientInvoices = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Sample Invoices Data
  const invoices = [
    { id: 1, client: 'Client A', status: 'Paid', total: '$1,500', date: '2023-09-01' },
    { id: 2, client: 'Client B', status: 'Pending', total: '$2,300', date: '2023-09-05' },
    { id: 3, client: 'Client C', status: 'Unpaid', total: '$1,800', date: '2023-09-10' },
    // Add more invoices here
  ];

  // Handle viewing an invoice
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container fluid className="my-4" style={{ background: 'linear-gradient(135deg, #f9f9f9, #e3f2fd)', padding: '40px', borderRadius: '10px' }}>
        {/* Header Section */}
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2 className="fw-bold" style={{ color: '#2c3e50', fontSize: '28px' }}>Client Invoices</h2>
            <p className="text-muted" style={{ fontSize: '14px' }}>Manage client invoices and payments</p>
          </Col>
          <Col md={6} className="text-md-end">
            <Form className="d-inline-flex">
              <Form.Control 
                type="search" 
                placeholder="Search invoices..." 
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

        {/* Invoices Table */}
        <Card className="shadow-lg rounded" style={{ borderRadius: '15px', background: '#ffffff' }}>
          <Card.Body style={{ padding: '2rem' }}>
            {/* Table for Invoices */}
            <div style={{ overflowX: 'auto' }}>
              <Table striped hover responsive="xl" className="align-middle text-center" style={{ minWidth: '1300px', width: '100%' }}>
                <thead className="bg-light" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', fontSize: '16px', fontWeight: 'bold' }}>
                  <tr>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Invoice ID</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Client</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Status</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Total</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Date</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="table-row-hover" style={{ background: '#fdfdfd', transition: 'background 0.3s' }}>
                      <td style={{ padding: '15px' }}>{invoice.id}</td>
                      <td style={{ padding: '15px' }}>{invoice.client}</td>
                      <td style={{ padding: '15px' }}>
                        <Badge
                          pill
                          style={{
                            backgroundColor: invoice.status === 'Paid' ? '#28a745' : invoice.status === 'Pending' ? '#ffc107' : '#dc3545',
                            color: '#fff',
                            padding: '10px 15px',
                            fontSize: '14px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                      <td style={{ padding: '15px' }}>{invoice.total}</td>
                      <td style={{ padding: '15px' }}>{invoice.date}</td>
                      <td style={{ padding: '15px' }}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>View Invoice</Tooltip>}>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2 d-flex align-items-center"
                            onClick={() => handleViewInvoice(invoice)}
                            style={{ borderRadius: '25px', padding: '8px 15px' }}
                          >
                            <FaEye className="me-1" /> View
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit Invoice</Tooltip>}>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2 d-flex align-items-center"
                            style={{ borderRadius: '25px', padding: '8px 15px' }}
                          >
                            <FaEdit className="me-1" /> Edit
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete Invoice</Tooltip>}>
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

        {/* Modal for Viewing Invoice Details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton style={{ background: '#007bff', color: '#fff' }}>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInvoice ? (
              <>
                <p><strong>Invoice ID:</strong> {selectedInvoice.id}</p>
                <p><strong>Client:</strong> {selectedInvoice.client}</p>
                <p><strong>Status:</strong> {selectedInvoice.status}</p>
                <p><strong>Total:</strong> {selectedInvoice.total}</p>
                <p><strong>Date:</strong> {selectedInvoice.date}</p>
              </>
            ) : (
              <p>No invoice details available</p>
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

export default ClientInvoices;
