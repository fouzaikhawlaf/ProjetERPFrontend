import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { createTask } from "services/TaskProjectService"; // Service function to create task

const TaskCreate = () => {
  const { projectId } = useParams(); // Get projectId from the URL
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    status: "0", // Default status
    startDate: "", // Default start date
    endDate: "", // Default end date
  });
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({ ...taskData, projectId });
      navigate(`/tasks/${projectId}`); // Redirect to the task list for this project
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white fw-bold">Create Task</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="taskName" className="mb-3">
                <Form.Label>Task Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task name"
                  name="name"
                  value={taskData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="taskDescription" className="mb-3">
                <Form.Label>Task Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="taskStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={taskData.status}
                  onChange={handleChange}
                >
                  <option value="0">Pending</option>
                  <option value="1">In Progress</option>
                  <option value="2">Completed</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="taskStartDate" className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={taskData.startDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="taskEndDate" className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={taskData.endDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Create Task
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default TaskCreate;
