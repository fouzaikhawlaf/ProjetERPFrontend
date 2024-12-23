import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "services/ProjectService";  // Import the service functions

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle errors from the API
  const navigate = useNavigate();

  // Load projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(); // Fetch projects from the backend
        // Check if the data is an array
        if (Array.isArray(data)) {
          setProjects(data); // Only set state if it's an array
        } else {
          setError("Fetched data is not in the expected format.");
        }
      } catch (error) {
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchProjects();
  }, []);

  // Handle project deletion
  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId); // Call the API to delete the project
      setProjects(projects.filter((project) => project.id !== projectId)); // Update state to remove the deleted project
    } catch (error) {
      setError("Failed to delete project.");
    }
  };

  // Handle adding task to project
  const handleAddTask = (projectId) => {
    navigate(`/create-task/${projectId}`); // Navigate to create task page with projectId
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white fw-bold">
            Project List
          </Card.Header>
          <Card.Body>
            <Button
              variant="success"
              className="mb-3"
              onClick={() => navigate("/create-project")}
            >
              + Create New Project
            </Button>

            {loading ? (
              <p>Loading projects...</p>
            ) : error ? (
              <p>{error}</p>
            ) : projects.length === 0 ? (
              <p>No projects available. Start by creating a new project!</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                    <th>Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{project.name}</td>
                      <td>{project.description || "N/A"}</td>
                      <td>{project.startDate}</td>
                      <td>{project.endDate}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          Delete
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleAddTask(project.id)} // Add task to project
                        >
                          Add Task
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/tasks/${project.id}`)} // View tasks for project
                        >
                          View Tasks
                        </Button>
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

export default ProjectList;
