import React, { useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";

const ManageRoles = () => {
  // Données initiales des rôles
  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", permission: "view, edit, delete", default: false },
    { id: 2, name: "Client", permission: "view", default: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permission: "", default: false });

  // Fonction pour ouvrir/fermer le modal
  const handleModal = () => setShowModal(!showModal);

  // Ajouter un rôle
  const addRole = () => {
    setRoles([...roles, { id: roles.length + 1, ...newRole }]);
    setNewRole({ name: "", permission: "", default: false });
    handleModal();
  };

  // Supprimer un rôle
  const deleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  // Mettre à jour la valeur du nouveau rôle
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setNewRole({
      ...newRole,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Manage Roles</h3>
      <p className="text-muted">
        This section allows you to manage roles and permissions for users to grant them different access levels to your application.
      </p>

      {/* Table des rôles */}
      <Table striped bordered hover responsive>
        <thead className="bg-secondary text-white">
          <tr>
            <th>Role Name</th>
            <th>Permission</th>
            <th>Set as Default</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.permission}</td>
              <td className="text-center">
                <Form.Check type="checkbox" checked={role.default} disabled />
              </td>
              <td className="text-center">
                <Button variant="outline-primary" size="sm" className="me-2">
                  <i className="fas fa-edit"></i>
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => deleteRole(role.id)}>
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Bouton pour ajouter un rôle */}
      <Button variant="primary" onClick={handleModal}>
        Add Role
      </Button>

      {/* Modal pour ajouter un rôle */}
      <Modal show={showModal} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role name"
                name="name"
                value={newRole.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Permission</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., view, edit, delete"
                name="permission"
                value={newRole.permission}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="defaultCheckbox">
              <Form.Check
                type="checkbox"
                label="Set as Default"
                name="default"
                checked={newRole.default}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={addRole}>
            Save Role
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageRoles;
