import React from 'react';
import { Form, Button } from 'react-bootstrap';

const NotificationSettings = () => (
  <div>
    <h3>Notification Settings</h3>
    <Form>
      <Form.Group controlId="emailNotifications" className="mb-3">
        <Form.Label>Email Notifications</Form.Label>
        <Form.Check type="checkbox" label="Receive weekly reports" />
        <Form.Check type="checkbox" label="Receive security alerts" />
        <Form.Check type="checkbox" label="Receive system updates" />
      </Form.Group>

      <Form.Group controlId="alertNotifications" className="mb-3">
        <Form.Label>Alert Notifications</Form.Label>
        <Form.Check type="checkbox" label="Enable desktop alerts" />
        <Form.Check type="checkbox" label="Enable mobile alerts" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Notification Settings
      </Button>
    </Form>
  </div>
);

export default NotificationSettings;
