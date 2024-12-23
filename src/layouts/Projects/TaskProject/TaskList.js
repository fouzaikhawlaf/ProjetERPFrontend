import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTasks } from "services/TaskProjectService"; // Import getAllTasks

const TaskList = () => {
  const { projectId } = useParams(); // Get projectId from the URL
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch tasks for the project
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks(); // Fetch all tasks
        // Filter tasks by projectId
        const projectTasks = data.filter(task => task.projectId === projectId);
        setTasks(projectTasks);
      } catch (error) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  return (
    <DashboardLayout>
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white fw-bold">Task List</Card.Header>
        <Card.Body>
          <Button
            variant="success"
            className="mb-3"
            onClick={() => navigate(`/create-task/${projectId}`)} // Navigate to create task page
          >
            + Create New Task
          </Button>

          {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p>{error}</p>
          ) : tasks.length === 0 ? (
            <p>No tasks available for this project.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Task Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{task.name}</td>
                    <td>{task.description || "N/A"}</td>
                    <td>{task.status}</td>
                    <td>
                      <Button variant="danger" size="sm">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
    </DashboardLayout>
  );
};

export default TaskList;
