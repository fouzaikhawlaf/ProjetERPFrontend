import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import { Table, Button, Modal, Form, Container, Badge, Card } from "react-bootstrap";
import "./RoleManagement.css"; // Ajoute un fichier CSS personnalisé si nécessaire.

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", permission: "view, edit, delete", default: false },
    { id: 2, name: "Client", permission: "view", default: true },
  ]);

  const [show, setShow] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permission: "" });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddRole = () => {
    const newRoleData = {
      id: roles.length + 1,
      name: newRole.name,
      permission: newRole.permission,
      default: false,
    };
    setRoles([...roles, newRoleData]);
    setNewRole({ name: "", permission: "" });
    handleClose();
  };

  const handleDelete = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        {/* Header Section */}
        <Card className="mb-4 shadow-sm border-0 bg-light">
          <Card.Body>
            <h2 className="fw-bold text-center mb-3">Manage Roles</h2>
            <p className="text-muted text-center">
              Define roles and assign permissions to control user access in your application.
            </p>
          </Card.Body>
        </Card>

        {/* Table Section */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-bold">Role List</h5>
              <Button variant="success" onClick={handleShow}>
                <i className="fa fa-plus me-2"></i>Add New Role
              </Button>
            </div>

            <Table striped hover responsive className="align-middle text-center">
              <thead className="table-dark text-uppercase">
                <tr>
                  <th>Role Name</th>
                  <th>Permissions</th>
                  <th>Default</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="fw-bold">{role.name}</td>
                    <td>
                      {role.permission.split(", ").map((perm, index) => (
                        <Badge key={index} bg="info" className="me-1">
                          {perm}
                        </Badge>
                      ))}
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={role.default}
                        readOnly
                        className="mx-auto"
                      />
                    </td>
                    <td>
                      <Button variant="outline-warning" size="sm" className="me-2">
                        <i className="fa fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(role.id)}
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
              <i className="fa fa-user-shield me-2"></i>Add New Role
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formRoleName">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter role name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPermissions">
                <Form.Label>Permissions</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., view, edit, delete"
                  value={newRole.permission}
                  onChange={(e) => setNewRole({ ...newRole, permission: e.target.value })}
                />
                <Form.Text className="text-muted">
                  {`Separate permissions with commas, e.g., "view, edit, delete".`}
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddRole}>
              Save Role
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default RoleManagement;
