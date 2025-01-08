// EditTask.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTaskById, updateTask } from "services/TaskProjectService";
import { getAllEmployees } from "services/EmployeeService";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const EditTask = () => {
  const { taskId } = useParams(); // Get the task ID from URL params
  const [task, setTask] = useState(null); // State to store task data
  const [employees, setEmployees] = useState([]); // State to store all employees
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch task and employee data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTask, fetchedEmployees] = await Promise.all([
          getTaskById(taskId),
          getAllEmployees(),
        ]);
        setTask(fetchedTask);
        setEmployees(fetchedEmployees || []);
      } catch (error) {
        setError("Error fetching task or employee data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate task data
    if (!task.name || !task.startDate || !task.endDate || task.assignedEmployees.length === 0) {
      alert("Please fill all required fields and assign at least one employee.");
      return;
    }

    const payload = {
      ...task,
      assignedEmployees: task.assignedEmployees.map(Number), // Ensure employee IDs are integers
    };

    try {
      await updateTask(taskId, payload);
      alert("Task updated successfully!");
    } catch (error) {
      alert("Failed to update task: " + JSON.stringify(error.response?.data.errors || {}));
    }
  };

  // If still loading, show loading message
  if (loading) {
    return <p>Loading task...</p>;
  }

  // If there was an error fetching data, show error message
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // If no task data, show a message
  if (!task) {
    return <p>No task data available.</p>;
  }

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Card>
          <Card.Header className="bg-primary text-white">Edit Task</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="taskName">
                <Form.Label>Task Name</Form.Label>
                <Form.Control
                  type="text"
                  value={task.name || ""}
                  onChange={(e) => setTask({ ...task, name: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="taskDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={task.description || ""}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="taskStartDate" className="mt-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={task.startDate || ""}
                  onChange={(e) =>
                    setTask({ ...task, startDate: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="taskEndDate" className="mt-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={task.endDate || ""}
                  onChange={(e) =>
                    setTask({ ...task, endDate: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="taskStatus" className="mt-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={task.status || ""}
                  onChange={(e) =>
                    setTask({ ...task, status: e.target.value })
                  }
                >
                  <option value="0">Pending</option>
                  <option value="1">In Progress</option>
                  <option value="2">Completed</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="assignedEmployees" className="mt-3">
                <Form.Label>Assigned Employees</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={task.assignedEmployees || []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions
                    ).map((option) => option.value);
                    setTask({ ...task, assignedEmployees: selectedOptions });
                  }}
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Update Task
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default EditTask;
