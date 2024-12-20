import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import { Table, Button, Modal, Form, Container, Badge, Card } from "react-bootstrap";
import "../UserManagement.css";


const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Client", status: "Inactive" },
  ]);

  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "User", status: "Active" });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddUser = () => {
    const newUserData = {
      id: users.length + 1,
      ...newUser,
    };
    setUsers([...users, newUserData]);
    setNewUser({ name: "", email: "", role: "User", status: "Active" });
    handleClose();
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

        {/* Table Section */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-bold">User List</h5>
              <Button variant="success" onClick={handleShow}>
                <i className="fa fa-plus me-2"></i>Add New User
              </Button>
            </div>

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

        {/* Modal Section */}
        <Modal show={show} onHide={handleClose} centered animation>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fa fa-user-plus me-2"></i>Add New User
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formUserName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUserEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter user email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUserRole">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="Client">Client</option>
                  <option value="User">User</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUserStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Save User
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default UserManagement;
