import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaTruck, FaEdit, FaTrashAlt } from "react-icons/fa";
import StatusFilters from "./StatusFilter";
//import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";

const DeliveriesTable = () => {
  const initialDeliveries = [
    { id: "D001", customer: "John Doe", status: "In Transit", expectedDate: "2024-12-15" },
    { id: "D002", customer: "Jane Smith", status: "Delivered", expectedDate: "2024-12-12" },
    { id: "D003", customer: "Alice Johnson", status: "Canceled", expectedDate: "2024-12-10" },
    { id: "D004", customer: "Bob Ross", status: "In Transit", expectedDate: "2024-12-18" },
  ];

  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [showAddForm, setShowAddForm] = useState(false);
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return <Badge bg="info">In Transit</Badge>;
      case "delivered":
        return <Badge bg="success">Delivered</Badge>;
      case "canceled":
        return <Badge bg="danger">Canceled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleEdit = (delivery) => {
    setSelectedDelivery(delivery);
    setShowEditModal(true);
  };

  const handleDelete = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setDeliveries(deliveries.filter((d) => d.id !== selectedDelivery.id));
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedDelivery({ ...selectedDelivery, [name]: value });
  };

  const handleSave = () => {
    setDeliveries(deliveries.map((d) => (d.id === selectedDelivery.id ? selectedDelivery : d)));
    setShowEditModal(false);
  };
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    console.log(`Filter clicked: ${filter}`);
  };
  
  const handleCreateClick = () => {
    setShowAddForm(true);
    console.log("Create button clicked");
  }
  return (
    <DashboardLayout>
      <div className="container mt-4">
      <h2 className="text-center mb-4">Devis</h2>
       <StatusFilters
    activeFilter={activeFilter}
    handleFilterClick={handleFilterClick}
    handleCreateClick={handleCreateClick}
    showAddForm={showAddForm}
  />
        <Table striped bordered hover responsive className="shadow-sm text-center">
          <thead className="bg-light">
            <tr>
              <th>#</th>
              <th>Delivery ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Expected Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery, index) => (
              <tr key={delivery.id}>
                <td>{index + 1}</td>
                <td>{delivery.id}</td>
                <td>{delivery.customer}</td>
                <td>{renderStatusBadge(delivery.status)}</td>
                <td>{delivery.expectedDate}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEdit(delivery)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(delivery)}>
                      <FaTrashAlt /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Delivery Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Delivery</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDelivery && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Customer</Form.Label>
                  <Form.Control
                    type="text"
                    name="customer"
                    value={selectedDelivery.customer}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={selectedDelivery.status} onChange={handleInputChange}>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Expected Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="expectedDate"
                    value={selectedDelivery.expectedDate}
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
            Are you sure you want to delete delivery {selectedDelivery?.id} for {selectedDelivery?.customer}?
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

export default DeliveriesTable;
