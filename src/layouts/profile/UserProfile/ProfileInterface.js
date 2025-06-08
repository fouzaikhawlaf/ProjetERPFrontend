import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import './ProfileInterface.css'; // For custom styles
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

const ProfileInterface = () => {
  // Sample initial profile data
  const initialProfile = {
    id: "12345",
    userId: "user123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St, City, Country",
    dateOfBirth: "1990-01-01T00:00:00.000Z",
    department: "Engineering",
  };

  // State to manage profile data
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to save the updated profile (e.g., API call)
    console.log("Updated Profile:", profile);
    setIsEditing(false); // Exit edit mode
  };

  return (
    <DashboardLayout>
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm profile-card">
              <Card.Body>
                <Card.Title className="text-center mb-4">Profile Information</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth.split('T')[0]} // Format date for input
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <div className="text-center">
                    {isEditing ? (
                      <>
                        <Button type="submit" variant="primary" className="me-2">
                          Save Changes
                        </Button>
                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default ProfileInterface;