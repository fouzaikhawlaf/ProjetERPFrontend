import React from 'react';
import { Form, Button } from 'react-bootstrap';

const UserPreferences = () => (
  <div>
    <h3>User Preferences</h3>
    <Form>
      <Form.Group controlId="language" className="mb-3">
        <Form.Label>Preferred Language</Form.Label>
        <Form.Control as="select">
          <option>English</option>
          <option>French</option>
          <option>Spanish</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="timezone" className="mb-3">
        <Form.Label>Preferred Timezone</Form.Label>
        <Form.Control as="select">
          <option>GMT</option>
          <option>UTC</option>
          <option>EST</option>
          <option>PST</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="notificationPreferences" className="mb-3">
        <Form.Label>Notification Preferences</Form.Label>
        <Form.Check type="checkbox" label="Email notifications" />
        <Form.Check type="checkbox" label="Push notifications" />
        <Form.Check type="checkbox" label="SMS notifications" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Preferences
      </Button>
    </Form>
  </div>
);

export default UserPreferences;
