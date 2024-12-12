import React from 'react';
import { Card, Col } from 'react-bootstrap';

const stats = [
  { title: 'Total Employees', value: 10, bg: 'primary' },
  { title: 'Total Tasks', value: 50, bg: 'success' },
  { title: 'Completed Tasks', value: 30, bg: 'info' },
];

const StatsCards = () => {
  return stats.map((stat, index) => (
    <Col key={index} md={4}>
      <Card className={`text-white bg-${stat.bg} mb-3`}>
        <Card.Body>
          <Card.Title>{stat.title}</Card.Title>
          <Card.Text className="display-4">{stat.value}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ));
};

export default StatsCards;
