// src/layouts/Sale/Data/PurchaseDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Form, Spinner, Card, Button, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { FaTruck, FaClipboardList, FaFileInvoiceDollar } from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';

import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Couleurs personnalisées pour un thème professionnel
const theme = {
  primaryColor: '#4CAF50',  // Vert pour actions importantes
  secondaryColor: '#FFC107', // Jaune pour les éléments d'alerte/avertissement
  neutralColor: '#F5F5F5',   // Fond neutre
};

const stats = [
  { title: 'Total Purchase Orders', value: 25, icon: <FaClipboardList />, color: theme.primaryColor },
  { title: 'Pending Deliveries', value: 5, icon: <FaTruck />, color: theme.secondaryColor },
  { title: 'Unpaid Invoices', value: 8, icon: <FaFileInvoiceDollar />, color: theme.primaryColor },
];

const purchaseOrderData = {
  labels: ['January', 'February', 'March', 'April'],
  datasets: [
    {
      label: 'Purchase Orders',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(75,192,192,0.6)',
      hoverBorderColor: 'rgba(75,192,192,1)',
      data: [3, 5, 2, 8],
    },
  ],
};

const deliveryData = {
  labels: ['Delivered', 'Pending', 'In Progress'],
  datasets: [
    {
      label: 'Delivery Status',
      backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
      hoverBackgroundColor: ['#66bb6a', '#ef5350', '#ffee58'],
      data: [15, 5, 8],
    },
  ],
};

const PurchaseDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowAlert = () => setAlertVisible(true);
  const handleCloseAlert = () => setAlertVisible(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <DashboardLayout>
      <Container fluid style={{ padding: '20px', backgroundColor: theme.neutralColor }}>
        <Navbar bg="light" variant="light" expand="lg" className="mb-4 shadow-sm">
          <Navbar.Brand href="#home" style={{ color: theme.primaryColor }}>Purchase Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/purchase-orders">
                <FaClipboardList className="me-2" /> Purchase Orders
              </Nav.Link>
              <Nav.Link as={Link} to="/bon-de-reception">
                <FaTruck className="me-2" /> Bon de Réception
              </Nav.Link>
              <Nav.Link as={Link} to="/supplier-invoices">
                <FaFileInvoiceDollar className="me-2" /> Supplier Invoices
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
            </Form>
          </Navbar.Collapse>
        </Navbar>

        {/* Boutons Actions */}
        <div className="mb-4 d-flex justify-content-start">
          <Button variant="success" className="me-2 shadow-sm" onClick={handleShowModal}>
            Nouvelle Commande Fournisseur
          </Button>
          <Button variant="secondary" className="me-2 shadow-sm" as={Link} to="/bon-de-reception">
            Bon de Réception
          </Button>
          <Button variant="warning" className="shadow-sm" as={Link} to="/supplier-invoices">
            Facture Fournisseur
          </Button>
        </div>

        {/* Modal Commande */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Nouvelle Commande Fournisseur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formSupplier">
                <Form.Label>Fournisseur</Form.Label>
                <Form.Control type="text" placeholder="Nom du fournisseur" />
              </Form.Group>
              <Form.Group controlId="formOrderDate">
                <Form.Label>Date de commande</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
              <Form.Group controlId="formItems">
                <Form.Label>Articles</Form.Label>
                <Form.Control type="text" placeholder="Détails des articles" />
              </Form.Group>
              <Button variant="primary" className="mt-3" onClick={handleCloseModal}>
                Soumettre Commande
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <>
            <Grid container spacing={3} className="mb-4">
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    className="text-center shadow-sm"
                    style={{ cursor: 'pointer', transition: 'transform 0.3s', backgroundColor: theme.neutralColor }}
                    onMouseOver={handleShowAlert}
                    onMouseOut={handleCloseAlert}
                  >
                    <Card.Body>
                      <Card.Title style={{ color: stat.color }}>{stat.icon} {stat.title}</Card.Title>
                      <Card.Text>
                        <h4>{stat.value}</h4>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {alertVisible && (
              <Alert variant="info" onClose={handleCloseAlert} dismissible>
                Astuce: Cliquez sur les cartes pour voir plus de détails sur chaque statistique.
              </Alert>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <div className="chart-container shadow-sm" style={{ height: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
                  <h4>Commandes Fournisseurs</h4>
                  <Bar data={purchaseOrderData} options={{ maintainAspectRatio: false }} />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="chart-container shadow-sm" style={{ height: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
                  <h4>Statut des Livraisons</h4>
                  <Doughnut data={deliveryData} options={{ maintainAspectRatio: false }} />
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default PurchaseDashboard;
