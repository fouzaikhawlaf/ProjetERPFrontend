import React from "react";
import PropTypes from "prop-types";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaShoppingCart, FaFileInvoice, FaTruck, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";

const VenteNavbar = ({ onNewSale }) => {
  return (
    <Navbar bg="white" variant="light" expand="lg" className="shadow-sm py-2">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary d-flex align-items-center">
          <FaChartLine size={28} className="me-2" />
          <span className="fs-5">Sales Dashboard</span>
        </Navbar.Brand>

        {/* Toggler for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto ms-4 d-flex align-items-center">
            <Nav.Link as={Link} to="/orders" className="text-dark mx-2 d-flex align-items-center">
              <FaShoppingCart size={20} className="me-1" />
              <span className="d-none d-lg-block">Orders</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/devis" className="text-dark mx-2 d-flex align-items-center">
              <FaFileInvoice size={20} className="me-1" />
              <span className="d-none d-lg-block">Devis</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/deliveries" className="text-dark mx-2 d-flex align-items-center">
              <FaTruck size={20} className="me-1" />
              <span className="d-none d-lg-block">Deliveries</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/factures" className="text-dark mx-2 d-flex align-items-center">
              <FaFileInvoice size={20} className="me-1" />
              <span className="d-none d-lg-block">Factures</span>
            </Nav.Link>
          </Nav>

          {/* Action Button */}
          <Button
            variant="primary"
            onClick={onNewSale}
            className="fw-bold px-4 py-2"
            style={{ borderRadius: "50px" }}
          >
            + New Sale
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

VenteNavbar.propTypes = {
  onNewSale: PropTypes.func.isRequired,
};

export default VenteNavbar;
