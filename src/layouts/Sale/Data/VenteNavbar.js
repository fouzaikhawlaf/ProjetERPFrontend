import React from "react";
import PropTypes from "prop-types";
import { Navbar, Nav, Button } from "react-bootstrap";
import { FaShoppingCart, FaFileInvoice, FaTruck, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for routing

const VenteNavbar = ({ onNewSale }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Navbar.Brand href="#" className="fw-bold">
        <FaChartLine className="me-2" /> Sales Dashboard
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/orders" className="text-light">
            <FaShoppingCart className="me-2" /> Orders
          </Nav.Link>
          <Nav.Link as={Link} to="/devis" className="text-light">
            <FaFileInvoice className="me-2" /> Devis
          </Nav.Link>
          <Nav.Link as={Link} to="/deliveries" className="text-light">
            <FaTruck className="me-2" /> Deliveries
          </Nav.Link>
          <Nav.Link as={Link} to="/factures" className="text-light">
            <FaFileInvoice className="me-2" /> Factures
          </Nav.Link>
        </Nav>
        <Button variant="outline-light" onClick={onNewSale} className="fw-bold">
          + New Sale
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

VenteNavbar.propTypes = {
  onNewSale: PropTypes.func.isRequired, // Function to handle "New Sale"
};

export default VenteNavbar;
