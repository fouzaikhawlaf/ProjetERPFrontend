import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./OrderClient.css"; // You might want to rename this CSS file to orderClient.css
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

const OrderClientModule = () => {
  // Updated data for order management cards
  const cards = [
    {
      title: "Service",
      description: "Gérez les commandes de services.",
      icon: "fa-clipboard-list", // More appropriate icon for orders
      link: "/client-orders/new",
    },
    {
      title: "Produit",
      description: "Gérez les commandes de produits.",
      icon: "fa-dolly", // Icon representing product delivery
      link: "/client-orders/new",
    },
    {
      title: "Projet",
      description: "Gérez les commandes liées aux projets.",
      icon: "fa-tasks", // Icon representing project tasks
      link: "/client-orders/new",
    },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-4">
        <h3 className="mb-4 text-center">Gestion des Commandes</h3>
        <Row className="justify-content-center">
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Link to={card.link} className="text-decoration-none">
                <Card className="shadow order-card text-center">
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

export default OrderClientModule;