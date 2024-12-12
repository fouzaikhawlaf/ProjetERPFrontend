import React, { useState } from 'react';
import { Table, Card, Container, Button, Row, Col, Badge, Pagination, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

import { FaSearch, FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa'; // Importing icons for better visuals

const ClientOrders = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orders = [
    { id: 1, client: 'Client A', status: 'Shipped', total: '$1,500' },
    { id: 2, client: 'Client B', status: 'Pending', total: '$2,300' },
    // Add more orders here
  ];

  // Handle showing modals
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      
      <Container fluid className="my-4" style={{ background: 'linear-gradient(135deg, #f9f9f9, #e3f2fd)', padding: '40px', borderRadius: '10px' }}>
        {/* Header Section */}
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2 className="fw-bold" style={{ color: '#2c3e50', fontSize: '28px' }}>Client Orders</h2>
            <p className="text-muted" style={{ fontSize: '14px' }}>Manage your client orders effortlessly</p>
          </Col>
          <Col md={6} className="text-md-end">
            <Form className="d-inline-flex">
              <Form.Control 
                type="search" 
                placeholder="Search orders..." 
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

        {/* Orders Table */}
        <Card className="shadow-lg rounded" style={{ borderRadius: '15px', background: '#ffffff' }}>
          <Card.Body style={{ padding: '2rem' }}>
            {/* Table Width */}
            <div style={{ overflowX: 'auto' }}>
              <Table striped hover responsive="xl" className="align-middle text-center table-hover" style={{ minWidth: '1300px', width: '100%' }}>
                <thead className="bg-light" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', fontSize: '16px', fontWeight: 'bold' }}>
                  <tr>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Order ID</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Client</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Status</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Total</th>
                    <th style={{ color: '#2d3436', padding: '15px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="table-row-hover" style={{ background: '#fdfdfd', transition: 'background 0.3s' }}>
                      <td style={{ padding: '15px' }}>{order.id}</td>
                      <td style={{ padding: '15px' }}>{order.client}</td>
                      <td style={{ padding: '15px' }}>
                        <Badge
                          pill
                          style={{
                            backgroundColor: order.status === 'Shipped' ? '#28a745' : '#ffc107',
                            color: '#fff',
                            padding: '10px 15px',
                            fontSize: '14px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td style={{ padding: '15px' }}>{order.total}</td>
                      <td style={{ padding: '15px' }}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>View Order</Tooltip>}>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2 d-flex align-items-center"
                            onClick={() => handleViewOrder(order)}
                            style={{ borderRadius: '25px', padding: '8px 15px' }}
                          >
                            <FaEye className="me-1" /> View
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit Order</Tooltip>}>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2 d-flex align-items-center"
                            style={{ borderRadius: '25px', padding: '8px 15px' }}
                          >
                            <FaEdit className="me-1" /> Edit
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete Order</Tooltip>}>
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

        {/* Modal for Viewing Order Details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton style={{ background: '#007bff', color: '#fff' }}>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder ? (
              <>
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Client:</strong> {selectedOrder.client}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total:</strong> {selectedOrder.total}</p>
              </>
            ) : (
              <p>No order details available</p>
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

export default ClientOrders;
