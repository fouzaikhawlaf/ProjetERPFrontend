import React from "react";
import PropTypes from "prop-types";

const OrderList = ({ orders }) => {
  return (
    <div>
      <h3>Order List</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.name} - ${order.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define prop types
OrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Order ID
      name: PropTypes.string.isRequired, // Order name
      amount: PropTypes.number.isRequired, // Order amount
    })
  ).isRequired,
};

export default OrderList;
