import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "services/ProjectService"; // Import service functions
import { FaTrashAlt, FaTasks, FaPlus } from "react-icons/fa"; // Import icons

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle API errors
  const navigate = useNavigate();

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(); // Fetch projects from the API
        if (Array.isArray(data)) {
          setProjects(data); // Update state if data is an array
        } else {
          setError("Invalid data format received.");
        }
      } catch (error) {
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false); // Stop loading once fetching is complete
      }
    };

    fetchProjects();
  }, []);

  // Handle project deletion
  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId); // Call API to delete project
        setProjects(projects.filter((project) => project.id !== projectId)); // Update state
      } catch (error) {
        alert("Failed to delete project.");
      }
    }
  };

  // Navigate to add task for a specific project
  const handleAddTask = (projectId) => {
    navigate(`/create-task/${projectId}`); // Navigate to task creation page
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
              <FaPlus className="me-2" />
              Create New Project
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
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.id || index}>
                      <td>{index + 1}</td>
                      <td>{project.name}</td>
                      <td>{project.description || "N/A"}</td>
                      <td>{project.startDate}</td>
                      <td>{project.endDate}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleAddTask(project.id)}
                          >
                            <FaPlus /> 
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/tasks/${project.id}`)}
                          >
                            <FaTasks /> 
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                          >
                            <FaTrashAlt /> 
                          </Button>
                        </div>
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
