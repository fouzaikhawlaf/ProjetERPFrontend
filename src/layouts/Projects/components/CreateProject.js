import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "", // New field for budget
  });

  const navigate = useNavigate(); // Navigation hook

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Example: Validate form fields
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields.");
      return;
    }

    // Example: Save to localStorage or send to backend
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.push(formData);
    localStorage.setItem("projects", JSON.stringify(projects));

    // Redirect to Project List
    navigate("/projects");
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
            <Button variant="primary" type="submit">
              Create Project
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </DashboardLayout>
  );
};

export default CreateProject;
