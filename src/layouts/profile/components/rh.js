// Import necessary libraries and components


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button } from 'react-bootstrap';
import { Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'; // Material UI components
import Calendar from 'react-calendar'; // Import react-calendar library
import 'react-calendar/dist/Calendar.css'; // Import calendar CSS
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Overdue Tasks Component with real-time fetching
const OverdueTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOverdueTasks = async () => {
    try {
      const response = await axios.get('https://api.example.com/overdue-tasks');
      setTasks(response.data); // Assuming the API returns an array of tasks
      setLoading(false);
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      setLoading(false);
    }
  };

  // Fetch tasks on component mount and every 60 seconds
  useEffect(() => {
    fetchOverdueTasks();
    const interval = setInterval(fetchOverdueTasks, 60000);  // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const getColorBasedOnDays = (days) => {
    if (days > 7) return 'red'; // Over 7 days is critical
    if (days > 3) return 'orange'; // 3 to 7 days is warning
    return 'green'; // Less than 3 days is safe
  };

  if (loading) {
    return <div>Loading overdue tasks...</div>;
  }

  return (
    <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
      <Typography variant="h6" style={{ marginBottom: '15px', color: '#dc3545' }}>
        Overdue Tasks
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Overdue</TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Employee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} style={{ color: getColorBasedOnDays(task.overdueDays) }}>
              <TableCell>{task.overdueDays} Days</TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>{task.employee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

// Project Budget Component with real-time fetching
const ProjectBudget = () => {
  const [budget, setBudget] = useState({ allocated: 0, spent: 0 });
  const [loading, setLoading] = useState(true);

  const fetchProjectBudget = async () => {
    try {
      const response = await axios.get('https://api.example.com/project-budget');
      setBudget(response.data);  // Assuming the API returns { allocated: number, spent: number }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project budget:', error);
      setLoading(false);
    }
  };

  // Fetch budget on component mount and every 60 seconds
  useEffect(() => {
    fetchProjectBudget();
    const interval = setInterval(fetchProjectBudget, 60000);  // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading project budget...</div>;
  }

  const percentageSpent = ((budget.spent / budget.allocated) * 100).toFixed(2);

  return (
    <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
      <Typography variant="h6" style={{ marginBottom: '15px', color: '#28a745' }}>
        Project Budget
      </Typography>
      <p>Allocated Budget: ${budget.allocated}</p>
      <p>Spent: ${budget.spent}</p>
      <div style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <div
          style={{
            width: `${percentageSpent}%`,
            backgroundColor: percentageSpent > 100 ? '#ff0000' : '#00ff00',
            height: '100%',
            borderRadius: '4px',
          }}
        ></div>
      </div>
      <p>{percentageSpent}% of budget spent</p>
    </Card>
  );
};

// Calendar Component
const RHCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
      <Typography variant="h6" style={{ marginBottom: '15px', color: '#343a40' }}>
        Calendar
      </Typography>
      <Calendar onChange={setDate} value={date} />
      <p>Selected Date: {date.toDateString()}</p>
    </Card>
  );
};

const RhDashboard = () => {
  return (
    <DashboardLayout>
  
      <Container fluid style={{ padding: '20px' }}>
        {/* Main Title */}
        <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '30px' }}>RH Dashboard</h1>

        {/* Grid Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Employee Management */}
          <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
            <Card.Body>
              <Card.Title style={{ color: '#28a745' }}>Employee Management</Card.Title>
              <Button variant="primary" style={{ borderRadius: '12px', width: '100%' }}>
                Manage Employees
              </Button>
            </Card.Body>
          </Card>

          {/* Hiring Progress */}
          <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
            <Card.Body>
              <Card.Title style={{ color: '#17a2b8' }}>Hiring Progress</Card.Title>
              <Button variant="primary" style={{ borderRadius: '12px', width: '100%' }}>
                Track Hiring
              </Button>
            </Card.Body>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
            <Card.Body>
              <Card.Title style={{ color: '#ffc107' }}>Upcoming Interviews</Card.Title>
              <p>Next interview: Sept 15, 2:00 PM</p>
            </Card.Body>
          </Card>

          {/* Performance Reviews */}
          <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
            <Card.Body>
              <Card.Title style={{ color: '#dc3545' }}>Performance Reviews</Card.Title>
              <Button variant="primary" style={{ borderRadius: '12px', width: '100%' }}>
                View Reviews
              </Button>
            </Card.Body>
          </Card>

          {/* Calendar */}
          <RHCalendar />
        </div>

        {/* Real-time Components */}
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12} md={6}>
            <OverdueTasks />
          </Grid>

          <Grid item xs={12} md={6}>
            <ProjectBudget />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default RhDashboard;
