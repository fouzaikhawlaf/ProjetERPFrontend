import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddRoleForm = ({ roles, users }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const handleAssignRole = (e) => {
    e.preventDefault();
    if (!selectedRole || !selectedUser) {
      alert("Please select both role and user");
      return;
    }

    // Normally, you'd add logic here to save the role assignment to the backend
    alert(`Assigned role ${selectedRole} to user ${selectedUser}`);
  };

  return (
    <Form onSubmit={handleAssignRole}>
      <Form.Group controlId="userSelect" className="mb-3">
        <Form.Label>Select User</Form.Label>
        <Form.Control as="select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Choose...</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="roleSelect" className="mb-3">
        <Form.Label>Select Role</Form.Label>
        <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="">Choose...</option>
          {roles.map((role) => (
            <option key={role.id} value={role.roleName}>
              {role.roleName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Assign Role
      </Button>
    </Form>
  );
};

export default AddRoleForm;
