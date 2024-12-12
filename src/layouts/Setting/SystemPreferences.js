import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SystemPreferences = () => (
  <div>
    <h3>System Preferences</h3>
    <Form>
      <Form.Group controlId="systemLanguage" className="mb-3">
        <Form.Label>System Language</Form.Label>
        <Form.Control as="select">
          <option>English</option>
          <option>French</option>
          <option>Spanish</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="dateTimeFormat" className="mb-3">
        <Form.Label>Date/Time Format</Form.Label>
        <Form.Control as="select">
          <option>MM/DD/YYYY</option>
          <option>DD/MM/YYYY</option>
          <option>YYYY-MM-DD</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Save System Preferences
      </Button>
    </Form>
  </div>
);

export default SystemPreferences;
