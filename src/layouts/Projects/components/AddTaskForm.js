import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddTaskForm = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [employee, setEmployee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle task submission
    console.log({ taskTitle, employee, dueDate });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="taskTitle" className="mb-3">
        <Form.Label>Task Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="employee" className="mb-3">
        <Form.Label>Assign to Employee</Form.Label>
        <Form.Control as="select" value={employee} onChange={(e) => setEmployee(e.target.value)}>
          <option>Choose employee...</option>
          <option>John Doe</option>
          <option>Jane Smith</option>
          <option>Alex Johnson</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="dueDate" className="mb-3">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Task
      </Button>
    </Form>
  );
};

export default AddTaskForm;
