import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import VenteNavbar from "./VenteNavbar";
import SaleProcess from "./SaleProcess"; // Import the SaleProcess component

const VenteDashboard = () => {
  const [isSaleActive, setIsSaleActive] = useState(false); // Track if a sale process is active

  return (
    <DashboardLayout>
      <Container fluid>
        {/* Navbar with the option to start a new sale */}
        <VenteNavbar onNewSale={() => setIsSaleActive(true)} />

        {/* Button to initiate a new sale */}
        {!isSaleActive ? (
          <Button
            variant="outline-light"
            onClick={() => setIsSaleActive(true)}
            className="fw-bold"
          >
            + New Sale
          </Button>
        ) : (
          // SaleProcess component to handle the sale process steps and forms
          <div style={{ marginTop: 20 }}>
            <SaleProcess />
          </div>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default VenteDashboard;
