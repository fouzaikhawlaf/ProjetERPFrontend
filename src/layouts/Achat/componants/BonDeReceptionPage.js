// src/layouts/Sale/Data/BonDeReceptionPage.js
import React, { useState } from 'react';
import BonDeReceptionTable from './BonDeReceptionTable';
import StatusFilters from './StatusFilters';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


const mockReceptions = [
  { id: 1, supplier: 'Supplier A', total: 3000, date: '2024-01-01', status: 'Received' },
  { id: 2, supplier: 'Supplier B', total: 8000, date: '2024-01-02', status: 'Pending' },
];

const BonDeReceptionPage = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    // Add logic for filtering the table based on the selected filter
  };

  const handleCreateClick = () => {
    // Add logic to create a new Bon de Réception
  };

  return (
    <DashboardLayout>
    <div className="container mt-5">
      <h3>Bon de Réception</h3>
      <StatusFilters
        activeFilter={activeFilter}
        handleFilterClick={handleFilterClick}
        handleCreateClick={handleCreateClick}
      />
      <BonDeReceptionTable receptions={mockReceptions} />
    </div>
    </DashboardLayout>
  );
};

export default BonDeReceptionPage;
