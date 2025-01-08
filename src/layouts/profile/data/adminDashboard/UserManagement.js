import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import { Table, Button, Container, Badge, Card, Modal } from "react-bootstrap";
import "../UserManagement.css";
import UserModel from "./AddUserModal"; // Use the UserModel component
import { FaPlus } from "react-icons/fa"; // Import the desired icon from React Icons
const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Client", status: "Inactive" },
  ]);

  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  // Handlers for modal visibility
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSuccess = (message) => {
    console.log("Success:", message);
    handleCloseModal(); // Close the modal on success
  };

  const handleError = (error) => {
    console.error("Error:", error);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        {/* Header Section */}
        <Card className="mb-4 shadow-sm border-0 bg-light">
          <Card.Body>
            <h2 className="fw-bold text-center mb-3">Manage Users</h2>
            <p className="text-muted text-center">
              Add, edit, or remove users and assign roles to control access.
            </p>
          </Card.Body>
        </Card>

        {/* Add User Section */}
        <Card className="mb-4 shadow-sm border-0">
         
          <Card.Body>
          <Button variant="primary" onClick={handleShowModal} className="d-flex align-items-center">
  <FaPlus className="me-2" /> Add New User
</Button>
          </Card.Body>
        </Card>

        {/* UserModel Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New Admin User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UserModel onSuccess={handleSuccess} onError={handleError} />
          </Modal.Body>
        </Modal>

        {/* Table Section */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h5 className="fw-bold mb-3">User List</h5>
            <Table striped hover responsive className="align-middle text-center">
              <thead className="table-dark text-uppercase">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg="primary">{user.role}</Badge>
                    </td>
                    <td>
                      <Badge bg={user.status === "Active" ? "success" : "secondary"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-warning" size="sm" className="me-2">
                        <i className="fa fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default UserManagement;
