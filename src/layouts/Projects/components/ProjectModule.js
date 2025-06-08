import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './ProjectModule.css'; // For custom styles
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Link } from 'react-router-dom'; // For navigation

const ProjectModule = () => {
  const cards = [
    { 
      title: 'Projects', 
      description: 'Manage your projects and track progress...', 
      icon: 'fa-folder', 
      link: '/projects' 
    },
    { 
      title: 'Tasks', 
      description: 'View and manage tasks for your projects...', 
      icon: 'fa-tasks', 
      link: '/tasks' 
    },
    { 
      title: 'Reports', 
      description: 'Generate and view project reports...', 
      icon: 'fa-chart-bar', 
      link: '/reports' 
    },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-5">
        <Row>
          {cards.map((card, index) => (
            <Col key={index} sm={6} md={4} lg={3} className="mb-4">
              {/* Use Link to make the card clickable */}
              <Link to={card.link} className="text-decoration-none">
                <Card className="shadow-sm project-card text-center p-3">
                  <Card.Body>
                    <div className="icon-container mb-3">
                      <i className={`fa ${card.icon} fa-3x`} />
                    </div>
                    <Card.Title className="fw-bold mb-2 text-dark">{card.title}</Card.Title>
                    <Card.Text className="text-muted">{card.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default ProjectModule;