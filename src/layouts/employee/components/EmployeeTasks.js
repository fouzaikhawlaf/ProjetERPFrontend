import React, { useState } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import AddTaskForm from './AddTaskForm';


const tasks = [
  { title: 'Finish Project Report', dueDate: '2024-09-30' },
  { title: 'Client Meeting Preparation', dueDate: '2024-10-05' },
];

const EmployeeTasks = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Your Tasks</span>
        <Button variant="primary" onClick={toggleForm}>
          Add Task
        </Button>
      </Card.Header>
      <ListGroup variant="flush">
        {tasks.map((task, index) => (
          <ListGroup.Item key={index}>
            <div className="d-flex justify-content-between align-items-center">
              <strong>{task.title}</strong>
              <span>Due: {task.dueDate}</span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {showForm && <AddTaskForm />}
    </Card>
  );
};

export default EmployeeTasks;
