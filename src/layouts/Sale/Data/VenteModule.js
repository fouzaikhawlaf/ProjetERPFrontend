import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./VenteModule.css"; // Styles personnalisés
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

const VenteModule = () => {
  // Données des cartes organisées dans l'ordre souhaité
  const cards = [
    {
      title: "Nouvelle Vente",
      description: "Ajoutez une nouvelle vente ou commande.",
      icon: "fa-shopping-cart",
      link: "/Vente/Nouveau/Devis",
    },
    {
      title: "Devis",
      description: "Créez et envoyez des devis personnalisés.",
      icon: "fa-file-alt",
      link: "/Vente/list/Devis",
    },
    {
      title: "Commandes",
      description: "Gérez vos commandes clients efficacement.",
      icon: "fa-box",
      link: "/Vente/OrderCLient",
    },
    {
      title: "Livraisons",
      description: "Suivez vos livraisons et gérez leur statut.",
      icon: "fa-truck",
      link: "/ventes/livraisons",
    },
    {
      title: "Factures",
      description: "Créez et gérez les factures de vos clients.",
      icon: "fa-file-invoice-dollar",
      link: "/ventes/factures",
    },
    {
      title: "Ventes",
      description: "Consultez et gérez toutes vos transactions.",
      icon: "fa-cash-register",
      link: "/ventes/ventes",
    },
    {
      title: "Rapports",
      description: "Analysez vos ventes avec des rapports détaillés.",
      icon: "fa-chart-line",
      link: "/ventes/rapports",
    },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-4">
        <h3 className="mb-4 text-center">Gestion des Ventes</h3>
        <Row className="justify-content-center">
          {/* Affichage des cartes dans une grille structurée */}
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Link to={card.link} className="text-decoration-none">
                <Card className="shadow vente-card text-center">
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

export default VenteModule;
