import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './ProductServiceModule.css'; // For custom styles
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Link } from 'react-router-dom'; // For navigation

const ProductServiceModule = () => {
  const cards = [
    { 
      title: 'Product', 
      description: 'Manage your products and inventory...', 
      icon: 'fa-box', 
      link: '/products' 
    },
    { 
      title: 'Service', 
      description: 'Manage your services and offerings...', 
      icon: 'fa-cogs', 
      link: '/services' 
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
                <Card className="shadow-sm product-service-card text-center p-3">
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

export default ProductServiceModule;