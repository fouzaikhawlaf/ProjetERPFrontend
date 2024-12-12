import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SecuritySettings = () => (
  <div>
    <h3>Security Settings</h3>
    <Form>
      <Form.Group controlId="passwordPolicy" className="mb-3">
        <Form.Label>Password Policy</Form.Label>
        <Form.Control type="text" placeholder="Minimum 8 characters, 1 number, 1 special character" />
      </Form.Group>

      <Form.Group controlId="mfaOptions" className="mb-3">
        <Form.Label>Multi-Factor Authentication (MFA)</Form.Label>
        <Form.Check type="checkbox" label="Enable MFA via email" />
        <Form.Check type="checkbox" label="Enable MFA via SMS" />
        <Form.Check type="checkbox" label="Enable MFA via authenticator app" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Update Security
      </Button>
    </Form>
  </div>
);

export default SecuritySettings;
