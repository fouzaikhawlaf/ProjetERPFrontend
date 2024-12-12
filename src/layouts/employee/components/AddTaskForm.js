import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddTaskForm = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle task submission
    console.log('Task Added:', { taskTitle, dueDate });
    setTaskTitle('');
    setDueDate('');
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Form.Group controlId="taskTitle" className="mb-3">
        <Form.Label>Task Title</Form.Label>
        <Form.Control
          type="text"
          value={taskTitle}
          placeholder="Enter task title"
          onChange={(e) => setTaskTitle(e.target.value)}
        />
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
