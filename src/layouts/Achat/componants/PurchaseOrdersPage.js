// src/layouts/Sale/Data/PurchaseOrdersPage.js
import React, { useState } from 'react';
import PurchaseOrdersTable from './PurchaseOrdersTable';
import StatusFilters from './StatusFilters'; // Import the filter component
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


const mockPurchaseOrders = [
  { id: 1, supplier: 'Supplier A', total: 5000, status: 'Pending' },
  { id: 2, supplier: 'Supplier B', total: 12000, status: 'Received' },
];

const PurchaseOrdersPage = () => {
  const [filteredOrders, setFilteredOrders] = useState(mockPurchaseOrders);

  const handleFilterChange = (filter) => {
    // Implement logic to filter orders based on the filter applied
    if (filter === 'Tous') {
      setFilteredOrders(mockPurchaseOrders);
    } else {
      setFilteredOrders(mockPurchaseOrders.filter(order => order.status === filter));
    }
  };

  const handleCreateClick = () => {
    // Logic for handling the creation click
    console.log('Create button clicked!');
  };

  return (
    <DashboardLayout>
    <div className="container mt-5">
      <h3>Purchase Orders</h3>

      {/* Add the StatusFilters component */}
      <StatusFilters 
        onFilterChange={handleFilterChange} 
        handleCreateClick={handleCreateClick} 
        showAddForm={false} // Set to true if needed
      />

      {/* The filtered orders will be passed to the table */}
      <PurchaseOrdersTable orders={filteredOrders} />
    </div>
    </DashboardLayout>
  );
};

export default PurchaseOrdersPage;
