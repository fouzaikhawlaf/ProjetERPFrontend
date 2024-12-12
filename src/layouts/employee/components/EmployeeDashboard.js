import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EmployeeTasks from './EmployeeTasks';
import LeaveCalendar from './LeaveCalendar';
import EmployeeInfo from './EmployeeInfo';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
// Check if this import is correct



const EmployeeDashboard = () => {
  return (
    <DashboardLayout>
    <Container fluid className="p-4">
      <h1 className="mb-4">Employee Dashboard</h1>

      <Row className="mb-4">
        <Col>
          <EmployeeInfo />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <EmployeeTasks />
        </Col>
        <Col md={6}>
          <LeaveCalendar />  {/* Calendar with Request Leave */}
        </Col>
      </Row>
    </Container>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
