import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const RequestLeaveForm = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const leaveRequest = {
      startDate,
      endDate,
      reason,
    };

    // Call the parent's onSubmit function to handle the leave request
    onSubmit(leaveRequest);

    // Clear the form after submission
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="startDate" className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="endDate" className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="reason" className="mb-3">
        <Form.Label>Reason for Leave</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason for your leave"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Request Leave
      </Button>
    </Form>
  );
};

// Adding PropTypes validation for onSubmit
RequestLeaveForm.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Ensure onSubmit is a function and is required
};

export default RequestLeaveForm;
