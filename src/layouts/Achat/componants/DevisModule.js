import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./DevisModule.css"; // Custom styles (if needed)
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

const DevisModule = () => {
  // Data for the two cards
  const cards = [
    {
      title: "Service",
      description: "Gérez les devis liés aux services.",
      icon: "fa-cogs", // FontAwesome icon for services
      link: "/devis/service",
    },
    {
      title: "Produit",
      description: "Gérez les devis liés aux produits.",
      icon: "fa-box", // FontAwesome icon for products
      link: "/devis/produit",
    },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-4">
        <h3 className="mb-4 text-center">Gestion des Devis</h3>
        <Row className="justify-content-center">
          {/* Display the two cards in a grid */}
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Link to={card.link} className="text-decoration-none">
                <Card className="shadow devis-card text-center">
                  <Card.Body>
                    <div className="icon-container mb-3">
                      <i className={`fa ${card.icon} fa-3x`} />
                    </div>
                    <Card.Title className="fw-bold text-dark">{card.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {card.description}
                    </Card.Text>
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

export default DevisModule;