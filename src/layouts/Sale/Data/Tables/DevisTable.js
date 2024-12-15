import React, { useState } from "react";
import {
  Table,
  Badge,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaSearch, FaEllipsisH } from "react-icons/fa";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import StatusFilters from "./StatusFilter";

const DevisTable = () => {
  const initialDevis = [
    { id: "D001", client: "John Doe", status: "Approved", createdDate: "2024-12-01", amount: "$1,200" },
    { id: "D002", client: "Jane Smith", status: "Pending", createdDate: "2024-12-05", amount: "$800" },
    { id: "D003", client: "Michael Brown", status: "Rejected", createdDate: "2024-12-03", amount: "$1,500" },
    { id: "D004", client: "Emily Davis", status: "Under Review", createdDate: "2024-12-02", amount: "$2,000" },
  ];

  const [devis, setDevis] = useState(initialDevis);
  const [filteredDevis, setFilteredDevis] = useState(initialDevis);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [showAddForm, setShowAddForm] = useState(false);
  const renderStatusBadge = (status) => {
    const statusColors = {
      Approved: "success",
      Pending: "warning",
      Rejected: "danger",
      "Under Review": "info",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredDevis(
      devis.filter((d) =>
        Object.values(d).some((value) =>
          value.toString().toLowerCase().includes(query)
        )
      )
    );
  };

  const handleEdit = (devis) => {
    setSelectedDevis(devis);
    setShowEditModal(true);
  };

  const handleDelete = (devis) => {
    setSelectedDevis(devis);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setDevis(devis.filter((d) => d.id !== selectedDevis.id));
    setFilteredDevis(filteredDevis.filter((d) => d.id !== selectedDevis.id));
    setShowDeleteModal(false);
  };

  const handleSave = () => {
    setDevis(devis.map((d) => (d.id === selectedDevis.id ? selectedDevis : d)));
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
      <div className="container mt-4">
        <h2 className="text-center mb-4">Devis</h2>
        <StatusFilters
    activeFilter={activeFilter}
    handleFilterClick={handleFilterClick}
    handleCreateClick={handleCreateClick}
    showAddForm={showAddForm}
  />
        
        <Table
          striped
          bordered
          hover
          responsive
          className="shadow-sm rounded text-center"
        >
          <thead className="bg-light">
            <tr>
              <th>#</th>
              <th>Devis ID</th>
              <th>Client</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevis.map((d, index) => (
              <tr key={d.id}>
                <td>{index + 1}</td>
                <td>{d.id}</td>
                <td>{d.client}</td>
                <td>{renderStatusBadge(d.status)}</td>
                <td>{d.createdDate}</td>
                <td>{d.amount}</td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="border-0"
                    >
                      <FaEllipsisH />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEdit(d)}>
                        <FaEdit className="me-2" />
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleDelete(d)}
                        className="text-danger"
                      >
                        <FaTrashAlt className="me-2" />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Devis</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDevis && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Client</Form.Label>
                  <Form.Control
                    type="text"
                    name="client"
                    value={selectedDevis.client}
                    onChange={(e) =>
                      setSelectedDevis({
                        ...selectedDevis,
                        client: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={selectedDevis.status}
                    onChange={(e) =>
                      setSelectedDevis({
                        ...selectedDevis,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Under Review">Under Review</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Created Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="createdDate"
                    value={selectedDevis.createdDate}
                    onChange={(e) =>
                      setSelectedDevis({
                        ...selectedDevis,
                        createdDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={selectedDevis.amount}
                    onChange={(e) =>
                      setSelectedDevis({
                        ...selectedDevis,
                        amount: e.target.value,
                      })
                    }
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

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete devis {selectedDevis?.id} for{" "}
            {selectedDevis?.client}?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
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

export default DevisTable;
