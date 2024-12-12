import React from 'react';
import { Form, Button } from 'react-bootstrap';

const GeneralSettings = () => (
  <div>
    <h3>General Settings</h3>
    <Form>
      <Form.Group controlId="companyName" className="mb-3">
        <Form.Label>Company Name</Form.Label>
        <Form.Control type="text" placeholder="Enter company name" />
      </Form.Group>

      <Form.Group controlId="companyEmail" className="mb-3">
        <Form.Label>Company Email</Form.Label>
        <Form.Control type="email" placeholder="Enter company email" />
      </Form.Group>

      <Form.Group controlId="companyLogo" className="mb-3">
        <Form.Label>Company Logo</Form.Label>
        <Form.Control type="file" />
      </Form.Group>

      <Form.Group controlId="companyAddress" className="mb-3">
        <Form.Label>Company Address</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="Enter company address" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Changes
      </Button>
    </Form>
  </div>
);

export default GeneralSettings;
