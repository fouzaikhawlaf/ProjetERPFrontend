import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EmployeeOverview from './EmployeeOverview';
import StatsCards from './StatsCards';
import TaskList from './TaskList';

import CalendarView from './CalendarView'; // Import the calendar component
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
const Dashboardlayout = () => {
  return (
    <DashboardLayout>
    <Container fluid className="p-4">
      <h1 className="mb-4">Project Dashboard</h1>
      <Row className="mb-4">
        <StatsCards />
      </Row>
      <Row>
        <Col md={6}>
          <EmployeeOverview />
        </Col>
        <Col md={6}>
          <TaskList />
        </Col>
      </Row>
      {/* Calendar Section */}
      <Row>
        <Col>
          <CalendarView />
        </Col>
      </Row>
    </Container>
    </DashboardLayout>
  );
};

export default Dashboardlayout;
