import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const employeeInfo = {
  department: 'Software Development',
  specialization: 'Full-Stack Development',
  manager: 'John Smith',
  yearsAtCompany: 3,
};

const EmployeeInfo = () => {
  return (
    <Card>
      <Card.Header>Employee Information</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>Department:</strong> {employeeInfo.department}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Specialization:</strong> {employeeInfo.specialization}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Manager:</strong> {employeeInfo.manager}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Years at Company:</strong> {employeeInfo.yearsAtCompany}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default EmployeeInfo;
