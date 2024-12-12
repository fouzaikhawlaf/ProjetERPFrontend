// src/InvoiceTable.js

import React, { useState } from 'react';
import { Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaPrint, FaTrashAlt, FaEdit } from 'react-icons/fa';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


const InvoiceTable = () => {
  const initialInvoices = [
    { client: "Json Taylor", email: "jsontaylor2416@gmail.com", invoiceId: "#SPK12032901", issuedDate: "25, Nov 2022", amount: "$212.45", status: "Paid", dueDate: "25, Dec 2022" },
    { client: "Suzika Stallone", email: "suzikastallone3214@gmail.com", invoiceId: "#SPK12032912", issuedDate: "13, Nov 2022", amount: "$512.99", status: "Pending", dueDate: "13, Dec 2022" },
    { client: "Roman Killon", email: "romankillon143@gmail.com", invoiceId: "#SPK12032945", issuedDate: "30, Nov 2022", amount: "$2199.49", status: "Overdue", dueDate: "30, Dec 2022" },
    { client: "Charlie Davieson", email: "charliedavieson@gmail.com", invoiceId: "#SPK12032922", issuedDate: "18, Nov 2022", amount: "$1569.99", status: "Paid", dueDate: "18, Dec 2022" },
    { client: "Selena Deoyl", email: "selenadeoyl114@gmail.com", invoiceId: "#SPK12032932", issuedDate: "18, Nov 2022", amount: "$4873.99", status: "Due By 1 Day", dueDate: "18, Dec 2022" },
    { client: "Kiara Advensh", email: "kiaraadvensh87@gmail.com", invoiceId: "#SPK12032978", issuedDate: "02, Nov 2022", amount: "$1923.99", status: "Paid", dueDate: "02, Dec 2022" }
  ];

  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <Badge bg="success">Paid</Badge>;
      case 'Pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'Overdue':
        return <Badge bg="danger">Overdue</Badge>;
      case 'Due By 1 Day':
        return <Badge bg="info">Due By 1 Day</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleDelete = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setInvoices(invoices.filter(inv => inv.invoiceId !== selectedInvoice.invoiceId));
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInvoice({ ...selectedInvoice, [name]: value });
  };

  const handleSave = () => {
    setInvoices(invoices.map(inv => inv.invoiceId === selectedInvoice.invoiceId ? selectedInvoice : inv));
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <Button className="mb-3" variant="primary">Create Invoice</Button>
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="bg-light">
            <tr>
              <th>Client</th>
              <th>Invoice ID</th>
              <th>Issued Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index} className="align-middle">
                <td>
                  <div className="d-flex align-items-center">
                    <img src={`https://i.pravatar.cc/30?img=${index}`} alt="avatar" className="rounded-circle me-2" />
                    <div>
                      <div>{invoice.client}</div>
                      <small className="text-muted">{invoice.email}</small>
                    </div>
                  </div>
                </td>
                <td>{invoice.invoiceId}</td>
                <td>{invoice.issuedDate}</td>
                <td>{invoice.amount}</td>
                <td>{renderStatusBadge(invoice.status)}</td>
                <td>{invoice.dueDate}</td>
                <td>
                  <div className="d-flex">
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <FaPrint />
                    </Button>
                    <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEdit(invoice)}>
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(invoice)}>
                      <FaTrashAlt />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Invoice Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Invoice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInvoice && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Client</Form.Label>
                  <Form.Control type="text" name="client" value={selectedInvoice.client} onChange={handleInputChange} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="text" name="amount" value={selectedInvoice.amount} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={selectedInvoice.status} onChange={handleInputChange}>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Due By 1 Day">Due By 1 Day</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control type="text" name="dueDate" value={selectedInvoice.dueDate} onChange={handleInputChange} />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete invoice {selectedInvoice?.invoiceId} for {selectedInvoice?.client}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceTable;
