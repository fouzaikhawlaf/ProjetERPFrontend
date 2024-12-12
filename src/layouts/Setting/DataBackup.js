import React from 'react';
import { Form, Button } from 'react-bootstrap';

const DataBackup = () => (
  <div>
    <h3>Data Backup</h3>
    <Form>
      <Form.Group controlId="backupFrequency" className="mb-3">
        <Form.Label>Backup Frequency</Form.Label>
        <Form.Control as="select">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="automaticBackup" className="mb-3">
        <Form.Check type="checkbox" label="Enable automatic backup" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Backup Settings
      </Button>
    </Form>
  </div>
);

export default DataBackup;
