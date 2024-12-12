import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'; // Importing PropTypes for prop validation

const CreatePurchaseOrderForm = ({ open, handleClose }) => {
  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form for creating a new purchase order */}
        <p>This is where the form for creating a new purchase order will go.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary">
          Create Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Adding prop validation with PropTypes
CreatePurchaseOrderForm.propTypes = {
  open: PropTypes.bool.isRequired,         // 'open' should be a boolean and is required
  handleClose: PropTypes.func.isRequired,  // 'handleClose' should be a function and is required
};

export default CreatePurchaseOrderForm;
