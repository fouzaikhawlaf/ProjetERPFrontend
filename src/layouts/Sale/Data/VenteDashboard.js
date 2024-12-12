// VenteDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Tabs, Tab, Modal, Form, Toast } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';
import { FaPlus } from 'react-icons/fa';
import CreateOrderDialog from './CreateOrderForm';
import VenteNavbar from './VenteNavbar';
import 'chart.js/auto';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


const VenteDashboard = () => {
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [showCreateSaleModal, setShowCreateSaleModal] = useState(false); // State for the "Create Sale" modal
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('commandeClient');

  const handleOpenOrderDialog = () => setOpenOrderDialog(true);
  const handleCloseOrderDialog = () => setOpenOrderDialog(false);
  const handleOpenCreateSaleModal = () => setShowCreateSaleModal(true);
  const handleCloseCreateSaleModal = () => setShowCreateSaleModal(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000); // Simulate loading
  }, []);

  const handleCreateOrder = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [5000, 7000, 8000, 12000, 15000, 11000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const revenueData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Revenue',
        data: [20000, 30000, 40000, 50000, 55000, 60000],
        borderColor: 'rgba(153, 102, 255, 0.6)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales and Revenue Overview',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <DashboardLayout>
      <Container fluid style={{ padding: '20px' }}>
        {/* Navbar with Create Sale Button */}
        <VenteNavbar handleOpenOrderDialog={handleOpenOrderDialog} handleOpenCreateSaleModal={handleOpenCreateSaleModal} />

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <>

            {/* KPI Cards */}
            <Grid container spacing={4} className="mt-5">
              <Grid item xs={12} md={4}>
                <Card className="text-center p-4">
                  <h5>Total Sales</h5>
                  <h2>$45,000</h2>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="text-center p-4">
                  <h5>Total Revenue</h5>
                  <h2>$120,000</h2>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="text-center p-4">
                  <h5>Orders Processed</h5>
                  <h2>500</h2>
                </Card>
              </Grid>
            </Grid>

            {/* Sales and Revenue Charts */}
            <Grid container spacing={4} className="mt-5">
              <Grid item xs={12} md={6}>
                <Card className="p-4">
                  <Bar data={salesData} options={chartOptions} />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className="p-4">
                  <Line data={revenueData} options={chartOptions} />
                </Card>
              </Grid>
            </Grid>

            {/* Tabs for Documents */}
            
          </>
        )}

        {/* Create Order Dialog */}
        <CreateOrderDialog open={openOrderDialog} onClose={handleCloseOrderDialog} onCreate={handleCreateOrder} />

        {/* Create Sale Modal */}
        <Modal show={showCreateSaleModal} onHide={handleCloseCreateSaleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Sale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formClientName">
                <Form.Label>Client Name</Form.Label>
                <Form.Control type="text" placeholder="Enter client name" />
              </Form.Group>
              <Form.Group controlId="formOrderDetails" className="mt-3">
                <Form.Label>Order Details</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter order details" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreateSaleModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateOrder}>
              Create Sale
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Notification */}
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>New sale created successfully!</Toast.Body>
        </Toast>
      </Container>
    </DashboardLayout>
  );
};

export default VenteDashboard;
