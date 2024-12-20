import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import StatusFilters from "./StatusFilter";

const OrdersTable = () => {
  const initialOrders = [
    { id: "O001", customer: "Alice Johnson", status: "Completed", orderDate: "2024-12-01", total: "$500" },
    { id: "O002", customer: "Bob Ross", status: "Pending", orderDate: "2024-12-10", total: "$300" },
    { id: "O003", customer: "Charlie Brown", status: "Canceled", orderDate: "2024-12-05", total: "$400" },
    { id: "O004", customer: "Daisy Ridley", status: "Processing", orderDate: "2024-12-07", total: "$700" },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge bg="success">Completed</Badge>;
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "canceled":
        return <Badge bg="danger">Canceled</Badge>;
      case "processing":
        return <Badge bg="info">Processing</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setOrders(orders.filter((o) => o.id !== selectedOrder.id));
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder({ ...selectedOrder, [name]: value });
  };

  const handleSave = () => {
    setOrders(orders.map((o) => (o.id === selectedOrder.id ? selectedOrder : o)));
    setShowEditModal(false);
  };
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    console.log(`Filter clicked: ${filter}`);
  };
  
  const handleCreateClick = () => {
    setShowAddForm(true);
    console.log("Create button clicked");
  };
  return (
    <DashboardLayout>
      
    {/* Table Header */}
    <h2 className="text-center mb-4">Orders</h2>
       <StatusFilters
    activeFilter={activeFilter}
    handleFilterClick={handleFilterClick}
    handleCreateClick={handleCreateClick}
    showAddForm={showAddForm}
  />
      <div className="container mt-4">
        <Table striped bordered hover responsive className="shadow-sm text-center">
          <thead className="bg-light">
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{renderStatusBadge(order.status)}</td>
                <td>{order.orderDate}</td>
                <td>{order.total}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEdit(order)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(order)}>
                      <FaTrashAlt /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Order Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Customer</Form.Label>
                  <Form.Control
                    type="text"
                    name="customer"
                    value={selectedOrder.customer}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={selectedOrder.status} onChange={handleInputChange}>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Canceled">Canceled</option>
                    <option value="Processing">Processing</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Order Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="orderDate"
                    value={selectedOrder.orderDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Total</Form.Label>
                  <Form.Control
                    type="text"
                    name="total"
                    value={selectedOrder.total}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete order {selectedOrder?.id} for {selectedOrder?.customer}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default OrdersTable;
