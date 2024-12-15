import React from "react";
import { Table, Button } from "react-bootstrap";

const OrdersTable = ({ orders }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={order.id}>
            <td>{index + 1}</td>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>${order.total}</td>
            <td>{order.status}</td>
            <td>
              <Button variant="info" size="sm" className="me-2">
                View
              </Button>
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrdersTable;
