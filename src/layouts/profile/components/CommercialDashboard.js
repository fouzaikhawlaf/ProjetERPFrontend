import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.js for charts

const CommercialDashboard = () => {

  // Data for the chart
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 8, 15, 22, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color of bars
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Options for the chart
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container fluid style={{ padding: '20px' }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '30px' }}>Commercial Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Sales Progress */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#17a2b8' }}>Sales Progress</Card.Title>
            <ProgressBar now={75} label="75%" animated style={{ height: '25px', borderRadius: '12px' }} />
          </Card.Body>
        </Card>

        {/* Client Management */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#28a745' }}>Client Management</Card.Title>
            <Button style={{ borderRadius: '12px', width: '100%', backgroundColor: '#28a745', borderColor: '#28a745' }}>
              Manage Clients
            </Button>
          </Card.Body>
        </Card>

        {/* Webinars */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#ffc107' }}>Webinars</Card.Title>
            <p>Upcoming: <strong>Sales Strategy Webinar</strong></p>
            <Button variant="outline-warning" style={{ borderRadius: '12px', width: '100%' }}>
              View Webinars
            </Button>
          </Card.Body>
        </Card>

        {/* Sales Chart */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#007bff' }}>Sales Chart</Card.Title>
            <div style={{ height: '300px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card.Body>
        </Card>

        {/* Weekly Goals */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#dc3545' }}>Weekly Goals</Card.Title>
            <p>4/5 tasks completed</p>
            <ProgressBar now={80} label="80%" animated style={{ height: '25px', borderRadius: '12px' }} />
          </Card.Body>
        </Card>

        {/* Calendar */}
        <Card className="shadow-sm" style={{ borderRadius: '15px', transition: '0.3s', transform: 'scale(1)', padding: '20px' }}>
          <Card.Body>
            <Card.Title style={{ color: '#343a40' }}>Calendar</Card.Title>
            <p>Events coming this week:</p>
            <ul>
              <li>Meeting with Client A - Thu</li>
              <li>Project deadline - Fri</li>
            </ul>
            <Button variant="outline-dark" style={{ borderRadius: '12px', width: '100%' }}>
              View Full Calendar
            </Button>
          </Card.Body>
        </Card>

      </div>
    </Container>
  );
};

export default CommercialDashboard;
