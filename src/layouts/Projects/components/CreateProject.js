import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { createProject } from "services/ProjectService";
//import { createProject } from '.services/ProjectService'; // Import the createProject API function

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "", // New field for budget
  });

  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate(); // Navigation hook

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true); // Set loading to true when submitting the form
    setError(""); // Reset any error message

    try {
      // Call the API function to create a new project
      const newProject = await createProject(formData);
      console.log("Project created:", newProject);

      // Redirect to the project list page
      navigate("/projects");
    } catch (err) {
      setError("Failed to create project. Please try again."); // Handle error
      console.error("Error creating project:", err);
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white fw-bold">
            Create New Project
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="projectName">
                    <Form.Label>Project Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter project name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter project description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="startDate">
                    <Form.Label>Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="endDate">
                    <Form.Label>End Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="budget">
                    <Form.Label>Budget (USD)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter project budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>
              {error && <div className="text-danger mb-3">{error}</div>} {/* Show error message */}
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Creating Project..." : "Create Project"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default CreateProject;
