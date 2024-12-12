// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import TimelineItem from "examples/Timeline/TimelineItem";
import { useEffect, useState } from "react";

function OrdersOverview() {
  // State to hold orders data
  const [orders, setOrders] = useState([]);

  

  return (
    <Card className="h-100">
      <SoftBox pt={3} px={3}>
        <SoftTypography variant="h6" fontWeight="medium">
          Orders Overview
        </SoftTypography>
      </SoftBox>
      
      <SoftBox p={2}>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <TimelineItem
              key={index}
              color="success" // Change color dynamically based on status (e.g., success, error)
              icon={<Icon>shopping_cart</Icon>}
              title={`Order #${order.id} - ${order.status}`}
              dateTime={order.date}
              description={order.description} // Optional: Add more order details
            />
          ))
        ) : (
          <SoftTypography variant="caption" color="textSecondary">
            No orders available.
          </SoftTypography>
        )}
      </SoftBox>
    </Card>
  );
}

export default OrdersOverview;
