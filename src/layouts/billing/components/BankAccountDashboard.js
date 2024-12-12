import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button,  CircularProgress, Snackbar } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPiggyBank, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import {  Navbar, Nav, Dropdown, Form, Spinner, Toast } from 'react-bootstrap';
import { FaPlus, FaBell, FaChartBar, FaClipboardList, FaWarehouse, FaFileInvoiceDollar } from 'react-icons/fa';
// Sales and expenses data for charts
const salesData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Balance',
      data: [4000, 3000, 2000, 2780, 1890, 2390],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Expenses',
      data: [2400, 1398, 9800, 3908, 4800, 3800],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
      text: 'Balance vs. Expenses Overview',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const BankAccountDashboard = () => {
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Simulate loading effect
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000); // Simulating data loading
  }, []);

  const handleAccountInfoClick = () => {
    navigate('/accountinformation');
  };

  const handleTreasorerieClick = () => {
    navigate('/treasurerie');
  };

  const handleTransactionClick = () => {
    navigate('/transaction');
  };

  const handleCreateTransaction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <DashboardLayout>
    
    <Container fluid style={{ padding: '20px' }}>
        {/* Navbar */}
        <Navbar bg="light" variant="light" expand="lg" className="mb-4">
          <Navbar.Brand href="#home">ERP Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link >
                <Button className="d-flex align-items-center"
                onClick={handleAccountInfoClick} startIcon={<FontAwesomeIcon icon={faUser} />}>  Account Information
                </Button>
              </Nav.Link>
              <Nav.Link href="#sales">
                <Button className="d-flex align-items-center"
                onClick={handleTreasorerieClick} startIcon={<FontAwesomeIcon icon={faPiggyBank} />}>
              Treasorerie
                </Button>
              </Nav.Link>
              <Nav.Link href="#reports">
                <Button className="d-flex align-items-center"
                onClick={handleTransactionClick} startIcon={<FontAwesomeIcon icon={faExchangeAlt} />}>
              Transaction
                </Button>
              </Nav.Link>
            </Nav>

            {/* Search Form */}
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button>
            </Form>

            {/* Notification Icons */}
            <Nav className="ml-auto">
              <Dropdown align="end" className="ms-3">
                <Dropdown.Toggle variant="light" className="d-flex align-items-center text-primary rounded-circle shadow-sm">
                  <FaBell size={24} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#notifications">New Order Received</Dropdown.Item>
                  <Dropdown.Item href="#notifications">Client Updated</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>


        {/* Loading Spinner */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <Grid container spacing={3}>
              {/* KPI Cards */}
              <Grid item xs={12} sm={4}>
                <Card className="text-center p-4">
                  <CardContent>
                    <Typography variant="h5">Total Balance</Typography>
                    <Typography variant="h4">$5,000</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className="text-center p-4">
                  <CardContent>
                    <Typography variant="h5">Total Expenses</Typography>
                    <Typography variant="h4">$12,000</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className="text-center p-4">
                  <CardContent>
                    <Typography variant="h5">Last Transaction</Typography>
                    <Typography variant="h6">$200 on 10th Sep</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Sales and Expenses Charts */}
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">Balance Overview</Typography>
                    <Line data={salesData} options={chartOptions} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">Spending Insights</Typography>
                    <Bar data={salesData} options={chartOptions} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Transactions */}
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">Recent Transactions</Typography>
                    <ul>
                      <li>$200 - Grocery - 10th Sep</li>
                      <li>$150 - Utilities - 8th Sep</li>
                      <li>$50 - Coffee - 5th Sep</li>
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Toast Notification */}
            <Snackbar
              open={showToast}
              autoHideDuration={3000}
              onClose={() => setShowToast(false)}
              message="Transaction created successfully!"
            />
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default BankAccountDashboard;
