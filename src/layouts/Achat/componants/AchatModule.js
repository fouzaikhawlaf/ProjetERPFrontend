import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./AchatModule.css"; 
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

const AchatModule = () => {
  const cards = [
    {
      title: "Nouvel Achat",
      description: "Ajoutez une nouvelle commande d'achat.",
      icon: "fa-cart-plus",
      link: "/achats/Devis",
      type: "nouvel-achat"
    },
    {
      title: "Devis",
      description: "Gérez vos devis.",
      icon: "fa-file-signature",
      link: "/DevisService",
      type: "devis"
    },
    {
      title: "Commandes",
      description: "Suivez et gérez vos commandes d'achat.",
      icon: "fa-box-open",
      link: "/achats/commandes",
      type: "commandes"
    },
    {
      title: "Réceptions",
      description: "Enregistrez et gérez les marchandises reçues.",
      icon: "fa-truck-loading",
      link: "/achats/receptions",
      type: "receptions"
    },
    {
      title: "Factures Fournisseurs",
      description: "Suivez les factures et paiements.",
      icon: "fa-file-invoice",
      link: "/achats/factures",
      type: "factures"
    },
    {
      title: "Rapports",
      description: "Analysez vos achats avec des rapports détaillés.",
      icon: "fa-chart-bar",
      link: "/achats/rapports",
      type: "rapports"
    },
    {
      title: "Historique",
      description: "Consultez l'historique de vos achats.",
      icon: "fa-history",
      link: "/achats/historique",
      type: "historique"
    },
  ];

  return (
    <DashboardLayout>
      <Container fluid className="mt-4">
        <h3 className="mb-4 text-center fw-bold">📦 Gestion des Achats</h3>
        <Row className="justify-content-center">
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Link to={card.link} className="text-decoration-none">
                <Card className={`achat-card text-center ${card.type}`}>
                  <Card.Body>
                    <div className="icon-container mb-3">
                      <i className={`fa ${card.icon} fa-3x`} />
                    </div>
                    <Card.Title>{card.title}</Card.Title>
                    <Card.Text>{card.description}</Card.Text>
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
