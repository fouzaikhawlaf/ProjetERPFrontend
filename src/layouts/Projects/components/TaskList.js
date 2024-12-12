import React, { useState } from 'react';
import { Card, ListGroup, Button, Modal } from 'react-bootstrap';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';

const tasks = [
  { title: 'Design Homepage', employee: 'John Doe', dueDate: '2024-10-01' },
  { title: 'Fix Login Bug', employee: 'Jane Smith', dueDate: '2024-09-30' },
];

const TaskList = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        Task List
        <Button variant="primary" onClick={handleShow}>
          Add Task
        </Button>
      </Card.Header>
      <ListGroup variant="flush">
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))}
      </ListGroup>

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTaskForm />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default TaskList;
