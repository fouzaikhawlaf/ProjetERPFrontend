import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import './DashboardCards.css'; // For custom styles

const Dashboard = () => {
  const cards = [
    { title: 'Orders', description: 'View and manage orders...', icon: 'fa-box', link: '/orders' },
    { title: 'Clients', description: 'Manage customer data...', icon: 'fa-users', link: '/Clients' },
    { title: 'Invoices', description: 'Track and manage invoices...', icon: 'fa-file-invoice-dollar', link: '/invoices' },
    { title: 'Supplier Portal', description: 'Manage supplier relationships...', icon: 'fa-truck', link: '/supplier' },
    { title: 'Projects', description: 'Track project progress...', icon: 'fa-tasks', link: '/ProjectManagment' },
    { title: 'HR', description: 'Handle HR tasks and requests...', icon: 'fa-user-tie', link: '/hr' },
    { title: 'Reports', description: 'Generate and view reports...', icon: 'fa-chart-line', link: '/reports' },
    { title: 'Settings', description: 'Manage application settings...', icon: 'fa-cogs', link: '/settings' },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-5">
        <h2 className="mb-4 text-center">Bienvenue dans votre ERP</h2>
        <Row>
          {cards.map((card, index) => (
            <Col key={index} sm={6} md={4} lg={3} className="mb-4">
              <Link to={card.link} className="text-decoration-none">
                <Card className="shadow-sm text-center p-3 dashboard-card">
                  <Card.Body>
                    <div className="icon-container mb-3">
                      <i className={`fa ${card.icon} fa-3x text-primary`} />
                    </div>
                    <Card.Title className="fw-bold text-dark mb-2">{card.title}</Card.Title>
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

export default Dashboard;
