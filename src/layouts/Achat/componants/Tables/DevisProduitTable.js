import React, { useState, useEffect } from "react";
import {
  Table,
  Badge,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaSearch, FaEllipsisH, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAllDevisProducts,
  acceptDevis,
  rejectDevis,
} from "services/devisPurchaseService";
import { useNavigate } from "react-router-dom";

const DevisProduitTable = () => {
  const [produits, setProduits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Map numeric statut to string
  const mapStatutToString = (statut) => {
    switch (statut) {
      case 0:
        return "EnCours";
      case 1:
        return "Accepter";
      case 2:
        return "Rejecter";
      default:
        return "Unknown";
    }
  };

  // Fetch produits on component mount
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await getAllDevisProducts();
        console.log("Fetched Produits:", response);

        const data = response.$values || [];
        console.log("Extracted Produits:", data);

        if (Array.isArray(data)) {
          setProduits(data);
        } else {
          console.error("Expected an array but got:", data);
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        console.error("Error fetching produits:", error);
        setError("Failed to fetch produits. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  // Handle accept devis produit
  const handleAcceptDevisProduit = async (id) => {
    try {
      await acceptDevis(id);
      const updatedStatus = 1; // Accepter
      updateProduitStatus(id, updatedStatus);
    } catch (error) {
      console.error("Error accepting devis produit:", error);
    }
  };

  // Handle reject devis produit
  const handleRejectDevisProduit = async (id) => {
    try {
      await rejectDevis(id);
      const updatedStatus = 2; // Rejecter
      updateProduitStatus(id, updatedStatus);
    } catch (error) {
      console.error("Error rejecting devis produit:", error);
    }
  };

  // Update the status of a produit
  const updateProduitStatus = (id, newStatus) => {
    const statutString = mapStatutToString(newStatus); // Map numeric statut to string
    setProduits((prevProduits) =>
      prevProduits.map((produit) =>
        produit.id === id ? { ...produit, statut: statutString } : produit
      )
    );
  };

  // Render status button or badge
  const renderStatusButton = (produit) => {
    const statut = mapStatutToString(produit.statut); // Map numeric statut to string

    switch (statut) {
      case "EnCours":
        return (
          <div>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleAcceptDevisProduit(produit.id)}
            >
              Accepter
            </Button>{" "}
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleRejectDevisProduit(produit.id)}
            >
              Rejeter
            </Button>
          </div>
        );
      case "Accepter":
        return (
          <Badge bg="success" className="p-2">
            Accepter
          </Badge>
        );
      case "Rejecter":
        return (
          <Badge bg="danger" className="p-2">
            Rejecter
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="p-2">
            Unknown
          </Badge>
        );
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Filter produits based on search query
  const filteredProduits = produits.filter((produit) =>
    Object.values(produit).some((value) =>
      value.toString().toLowerCase().includes(searchQuery)
    )
  );

  // Handle edit
  const handleEdit = (produit) => {
    setSelectedProduit(produit);
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (produit) => {
    setSelectedProduit(produit);
    setShowDeleteModal(true);
  };

  // Handle view
  const handleView = (produit) => {
    setSelectedProduit(produit);
    setShowViewModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setProduits(produits.filter((p) => p.id !== selectedProduit.id));
    setShowDeleteModal(false);
  };

  // Handle save changes
  const handleSave = () => {
    setProduits(produits.map((p) => (p.id === selectedProduit.id ? selectedProduit : p)));
    setShowEditModal(false);
  };

  if (loading) {
    return <div>Loading produits...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Devis Produits</h2>

        {/* Search Bar */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search produits..."
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
              <th>Produit Name</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredProduits) &&
              filteredProduits.map((produit, index) => (
                <tr key={produit.id}>
                  <td>{index + 1}</td>
                  <td>{produit.devisNumber}</td>
                  <td>{produit.items.$values[0].designation}</td> {/* Updated here */}
                  <td>{renderStatusButton(produit)}</td>
                  <td>{produit.totalTTC}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      {/* View Button */}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleView(produit)}
                        style={{ background: "transparent", border: "none" }}
                      >
                        <FaEye style={{ color: "#0d6efd" }} /> {/* Blue Icon */}
                      </Button>

                      {/* Edit Button */}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleEdit(produit)}
                        style={{ background: "transparent", border: "none" }}
                      >
                        <FaEdit style={{ color: "#0d6efd" }} /> {/* Blue Icon */}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleDelete(produit)}
                        style={{ background: "transparent", border: "none" }}
                      >
                        <FaTrashAlt style={{ color: "#0d6efd" }} /> {/* Blue Icon */}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Produit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduit && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Produit Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedProduit.items.$values[0].designation}
                    onChange={(e) =>
                      setSelectedProduit({
                        ...selectedProduit,
                        items: {
                          ...selectedProduit.items,
                          $values: [
                            {
                              ...selectedProduit.items.$values[0],
                              designation: e.target.value,
                            },
                          ],
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={selectedProduit.statut}
                    onChange={(e) =>
                      setSelectedProduit({ ...selectedProduit, statut: e.target.value })
                    }
                  >
                    <option value="0">EnCours</option>
                    <option value="1">Accepter</option>
                    <option value="2">Rejecter</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Created Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedProduit.dateCreation}
                    onChange={(e) =>
                      setSelectedProduit({ ...selectedProduit, dateCreation: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedProduit.totalTTC}
                    onChange={(e) =>
                      setSelectedProduit({ ...selectedProduit, totalTTC: e.target.value })
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
            Are you sure you want to delete produit {selectedProduit?.devisNumber} - {selectedProduit?.items.$values[0].designation}?
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
            <Modal.Title>View Produit Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduit && (
              <div>
                <p><strong>Devis Number:</strong> {selectedProduit.devisNumber}</p>
                <p><strong>Produit Name:</strong> {selectedProduit.items.$values[0].designation}</p>
                <p><strong>Status:</strong> {selectedProduit.statut}</p>
                <p><strong>Total TTC:</strong> {selectedProduit.totalTTC}</p>
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

export default DevisProduitTable;