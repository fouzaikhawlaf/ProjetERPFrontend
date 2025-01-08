import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./AchatModule.css"; // Styles personnalisés
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

const AchatModule = () => {
  // Données des cartes organisées dans l'ordre souhaité
  const cards = [
    {
      title: "Nouvel Achat",
      description: "Ajoutez une nouvelle commande d'achat.",
      icon: "fa-cart-plus",
      link: "/achats/nouveau",
    },
    {
      title: "Fournisseurs",
      description: "Gérez vos fournisseurs et leurs informations.",
      icon: "fa-users",
      link: "/achats/fournisseurs",
    },
    {
      title: "Commandes",
      description: "Suivez et gérez vos commandes d'achat.",
      icon: "fa-box-open",
      link: "/achats/commandes",
    },
    {
      title: "Réceptions",
      description: "Enregistrez et gérez les marchandises reçues.",
      icon: "fa-truck-loading",
      link: "/achats/receptions",
    },
    {
      title: "Factures Fournisseurs",
      description: "Suivez les factures et les paiements des fournisseurs.",
      icon: "fa-file-invoice",
      link: "/achats/factures",
    },
    {
      title: "Rapports",
      description: "Analysez vos achats avec des rapports détaillés.",
      icon: "fa-chart-bar",
      link: "/achats/rapports",
    },
    {
      title: "Historique",
      description: "Consultez l'historique de vos achats.",
      icon: "fa-history",
      link: "/achats/historique",
    },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-4">
        <h3 className="mb-4 text-center">Gestion des Achats</h3>
        <Row className="justify-content-center">
          {/* Affichage des cartes dans une grille structurée */}
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Link to={card.link} className="text-decoration-none">
                <Card className="shadow achat-card text-center">
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

export default AchatModule;
