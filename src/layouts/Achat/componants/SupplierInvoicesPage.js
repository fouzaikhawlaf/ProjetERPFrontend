// src/layouts/Sale/Data/SupplierInvoicesPage.js
import React, { useState } from 'react';
import SupplierInvoicesTable from './SupplierInvoicesTable';
import StatusFilters from './StatusFilters';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


const mockInvoices = [
  { id: 1, supplier: 'Supplier A', total: 5000, status: 'Paid' },
  { id: 2, supplier: 'Supplier B', total: 12000, status: 'Pending' },
];

const SupplierInvoicesPage = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    // Add logic for filtering the table based on the selected filter
  };

  const handleCreateClick = () => {
    // Add logic to create a new invoice
  };

  return (
    <DashboardLayout>
    <div className="container mt-5">
      <h3>Supplier Invoices</h3>
      <StatusFilters
        activeFilter={activeFilter}
        handleFilterClick={handleFilterClick}
        handleCreateClick={handleCreateClick}
      />
      <SupplierInvoicesTable invoices={mockInvoices} />
    </div>
    </DashboardLayout>
  );
};

export default SupplierInvoicesPage;
