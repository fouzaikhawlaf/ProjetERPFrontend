import React, { useState, useEffect } from "react";
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
import { FaEdit, FaTrashAlt, FaSearch, FaEllipsisH, FaEye } from "react-icons/fa";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAllDevisServices,
  acceptDevis,
  rejectDevis,
  getDevisStatus,
} from "services/devisPurchaseService"; // Import the required functions

const DevisServiceTable = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllDevisServices();
        console.log("Fetched Services:", response);

        const data = response.$values || [];
        console.log("Extracted Services:", data);

        if (Array.isArray(data)) {
          setServices(data);
          setFilteredServices(data);
        } else {
          console.error("Expected an array but got:", data);
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle accept devis
  const handleAcceptDevis = async (id) => {
    try {
      await acceptDevis(id);
      const updatedStatus = await getDevisStatus(id);
      updateServiceStatus(id, updatedStatus);
    } catch (error) {
      console.error("Error accepting devis:", error);
    }
  };

  // Handle reject devis
  const handleRejectDevis = async (id) => {
    try {
      await rejectDevis(id);
      const updatedStatus = await getDevisStatus(id);
      updateServiceStatus(id, updatedStatus);
    } catch (error) {
      console.error("Error rejecting devis:", error);
    }
  };

  // Update the status of a service
  const updateServiceStatus = (id, newStatus) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, statut: newStatus } : service
      )
    );
    setFilteredServices((prevFilteredServices) =>
      prevFilteredServices.map((service) =>
        service.id === id ? { ...service, statut: newStatus } : service
      )
    );
  };

  // Render status button
  const renderStatusButton = (service) => {
    if (service.statut === "Accepted" || service.statut === "Rejected") {
      return <Badge bg={service.statut === "Accepted" ? "success" : "danger"}>{service.statut}</Badge>;
    }

    return (
      <div>
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleAcceptDevis(service.id)}
        >
          Accepter
        </Button>{" "}
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleRejectDevis(service.id)}
        >
          Rejeter
        </Button>
      </div>
    );
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredServices(
      services.filter((service) =>
        Object.values(service).some((value) =>
          value.toString().toLowerCase().includes(query)
        )
      )
    );
  };

  // Handle edit
  const handleEdit = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  // Handle view
  const handleView = (service) => {
    setSelectedService(service);
    setShowViewModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setServices(services.filter((s) => s.id !== selectedService.id));
    setFilteredServices(filteredServices.filter((s) => s.id !== selectedService.id));
    setShowDeleteModal(false);
  };

  // Handle save changes
  const handleSave = () => {
    setServices(services.map((s) => (s.id === selectedService.id ? selectedService : s)));
    setShowEditModal(false);
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Devis Services</h2>

        {/* Search Bar */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search services..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button variant="outline-secondary">
            <FaSearch />
          </Button>
        </InputGroup>

        {/* Table */}
        <Table striped bordered hover responsive className="shadow-sm rounded text-center">
          <thead className="bg-light">
            <tr>
              <th>#</th>
              <th>Devis Number</th>
              <th>Service Name</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredServices) &&
              filteredServices.map((service, index) => (
                <tr key={service.id}>
                  <td>{index + 1}</td>
                  <td>{service.devisNumber}</td>
                  <td>{service.description}</td>
                  <td>{renderStatusButton(service)}</td>
                  <td>{service.totalTTC}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm" className="border-0">
                        <FaEllipsisH />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleView(service)}>
                          <FaEye className="me-2" /> {/* View Icon */}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEdit(service)}>
                          <FaEdit className="me-2" /> {/* Edit Icon */}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDelete(service)}
                          className="text-danger"
                        >
                          <FaTrashAlt className="me-2" /> {/* Delete Icon */}
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
            <Modal.Title>Edit Service</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedService && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedService.name}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={selectedService.status}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Created Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedService.dateCreation}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, dateCreation: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedService.price}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, price: e.target.value })
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
            Are you sure you want to delete service {selectedService?.devisNumber} - {selectedService?.name}?
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

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View Service Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedService && (
              <div>
                <p><strong>Devis Number:</strong> {selectedService.devisNumber}</p>
                <p><strong>Service Name:</strong> {selectedService.description}</p>
                <p><strong>Status:</strong> {selectedService.statut}</p>
                <p><strong>Total TTC:</strong> {selectedService.totalTTC}</p>
                {/* Add more fields as needed */}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default DevisServiceTable;