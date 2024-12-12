import React from 'react';
import { Container, Card, ProgressBar, Button } from 'react-bootstrap';

const EmployeeDashboard = () => {
  return (
    <Container fluid style={{ padding: '20px' }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '30px' }}>Employee Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Task Management */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#28a745' }}>Task Management</Card.Title>
            <Button variant="primary" style={{ borderRadius: '12px', width: '100%' }}>
              View Tasks
            </Button>
          </Card.Body>
        </Card>

        {/* Progress */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#17a2b8' }}>Progress</Card.Title>
            <ProgressBar now={50} label="50%" style={{ height: '25px', borderRadius: '12px' }} />
          </Card.Body>
        </Card>

        {/* Team Collaboration */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#ffc107' }}>Team Collaboration</Card.Title>
            <Button variant="primary" style={{ borderRadius: '12px', width: '100%' }}>
              Join Team Chat
            </Button>
          </Card.Body>
        </Card>

        {/* Weekly Tasks */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#dc3545' }}>Weekly Tasks</Card.Title>
            <p>3/5 tasks completed</p>
          </Card.Body>
        </Card>

        {/* Notifications */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#343a40' }}>Notifications</Card.Title>
            <p>No new notifications</p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default EmployeeDashboard;
