import React from 'react';
import { Form, Button } from 'react-bootstrap';

const PermissionsSettings = () => (
  <div>
    <h3>Role Permissions</h3>
    <Form>
      <Form.Group controlId="userRole" className="mb-3">
        <Form.Label>User Role</Form.Label>
        <Form.Control as="select">
          <option>Admin</option>
          <option>Manager</option>
          <option>Employee</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="customRole" className="mb-3">
        <Form.Label>Create Custom Role</Form.Label>
        <Form.Control type="text" placeholder="Enter custom role name" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Role Permissions
      </Button>
    </Form>
  </div>
);

export default PermissionsSettings;
