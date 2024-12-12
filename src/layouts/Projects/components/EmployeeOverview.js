import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const employees = [
  { name: 'John Doe', tasks: 5 },
  { name: 'Jane Smith', tasks: 3 },
  { name: 'Alex Johnson', tasks: 7 },
];

const EmployeeOverview = () => {
  return (
    <Card className="mb-4">
      <Card.Header>Employee Overview</Card.Header>
      <ListGroup variant="flush">
        {employees.map((employee, index) => (
          <ListGroup.Item key={index}>
            <span>{employee.name}</span>
            <Badge bg="info" className="float-end">
              {employee.tasks} tasks
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default EmployeeOverview;
