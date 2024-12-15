import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './DashboardCards.css'; // Pour les styles personnalisés
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Link } from 'react-router-dom'; // Import du Link pour la navigation

const DashboardCards = () => {
  const cards = [
    { title: 'Project', description: 'Manage your projects and track progress...', icon: 'fa-folder', link: '/project' },
    { title: 'User Management', description: 'Add, update, or remove users...', icon: 'fa-users', link: '/user-management' },
    { title: 'Role Management', description: 'Define and assign user roles...', icon: 'fa-user-shield', link: '/role-management' },
    { title: 'Vente', description: 'Manage your sales process...', icon: 'fa-shopping-cart', link: '/vente' },
    { title: 'Achat', description: 'Track and manage purchases...', icon: 'fa-shopping-bag', link: '/achat' },
    { title: 'Conge', description: 'Handle leave requests and approvals...', icon: 'fa-calendar-check', link: '/conge' },
    { title: 'Security Setting', description: 'Manage your account security...', icon: 'fa-shield-alt', link: '/security-setting' },
    { title: 'Personal Info', description: 'View and update your personal data...', icon: 'fa-user', link: '/personal-info' },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-5">
        <Row>
          {cards.map((card, index) => (
            <Col key={index} sm={6} md={4} lg={3} className="mb-4">
              {/* Le Link enveloppe la carte pour la rendre cliquable */}
              <Link to={card.link} className="text-decoration-none">
                <Card className="shadow-sm dashboard-card text-center p-3">
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

export default DashboardCards;
