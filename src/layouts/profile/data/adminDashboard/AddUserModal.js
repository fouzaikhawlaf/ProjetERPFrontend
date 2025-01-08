import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { createUser } from "services/AdminService";
import PropTypes from "prop-types";

const UserModel = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    role: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation (basic)
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || !formData.role) {
      setError("All fields are required.");
      setSuccess(null);
      if (onError) onError("All fields are required.");
      return;
    }

    try {
      await createUser(formData); // Call the backend API to create the user
      setSuccess("User created successfully!");
      setError(null);

      if (onSuccess) onSuccess("User created successfully!");

      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        role: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create user.";
      setError(errorMessage);
      setSuccess(null);
      if (onError) onError(errorMessage);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="lastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="department" className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="role" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Manager">Manager</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Define PropTypes for the component
UserModel.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default UserModel;
