// src/layouts/Sale/Data/VenteNavbar.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';
import { FaPlus, FaUserCircle, FaCog } from 'react-icons/fa';
import SaleProcess from './SaleProcess'; // Import the SaleProcess component

// Dropdown Menu for User Settings (reusable)
const UserMenu = ({ onLogout }) => (
  <Dropdown align="end">
    <Dropdown.Toggle variant="light" id="dropdown-basic">
      <FaUserCircle size={20} className="me-2" /> User
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item href="#settings"><FaCog className="me-2" />Settings</Dropdown.Item>
      <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

UserMenu.propTypes = {
  onLogout: PropTypes.func.isRequired, // Validate onLogout as required function
};

// Main VenteNavbar component
const VenteNavbar = ({ onOrderDialogOpen, onInvoiceOpen, onDeliveryNoteOpen, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSaleProcess, setShowSaleProcess] = useState(false); // State to show/hide SaleProcess

  // Toggle SaleProcess
  const handleNewSale = () => {
    setShowSaleProcess(true); // Show the SaleProcess component when the button is clicked
  };

  const handleCloseSaleProcess = () => {
    setShowSaleProcess(false); // Hide the SaleProcess component
  };

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand href="#home" className="fw-bold">Sales Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
         
          {/* Action Buttons */}
          <Nav className="ms-auto">
            {/* Button for New Sale */}
            <Button variant="primary" className="me-3" onClick={handleNewSale}>
              <FaPlus className="me-2" /> New Sale
            </Button>

            {/* Button for New Order */}
            <Button variant="outline-primary" className="me-3" onClick={onOrderDialogOpen}>
              <FaPlus className="me-2" /> New Order
            </Button>

            {/* Button for New Invoice */}
            <Button variant="outline-primary" className="me-3" onClick={onInvoiceOpen}>
              <FaPlus className="me-2" /> New Invoice
            </Button>

            {/* Button for New Delivery Note */}
            <Button variant="outline-primary" className="me-3" onClick={onDeliveryNoteOpen}>
              <FaPlus className="me-2" /> New Delivery Note
            </Button>

            {/* User Dropdown Menu */}
            <UserMenu onLogout={onLogout} />
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* SaleProcess Dialog */}
      {showSaleProcess && (
        <SaleProcess
          onClose={handleCloseSaleProcess} // You can pass custom props like this
        />
      )}
    </Navbar>
  );
};

// PropTypes validation for VenteNavbar
VenteNavbar.propTypes = {
  onOrderDialogOpen: PropTypes.func.isRequired,
  onInvoiceOpen: PropTypes.func.isRequired,
  onDeliveryNoteOpen: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default VenteNavbar;
