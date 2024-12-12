import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { Upload as UploadIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';


import { Link } from 'react-router-dom';
import { SuppliersTable } from './SuppliersTable';
import { SuppliersFilters } from './SuppliersFilters';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
// Suppression de la partie config
export const metadata = { title: 'Suppliers | Dashboard' };

const suppliers = [
  {
    id: 'SUP-001',
    name: 'Supplier One',
    avatar: '/assets/avatar-1.png',
    email: 'supplier.one@example.com',
    phone: '123-456-7890',
    address: { city: 'Paris', country: 'France', state: 'Île-de-France', street: '123 Supplier Street' },
    createdAt: dayjs().subtract(5, 'days').toDate(),
  },
  // Add more suppliers as needed
];

export default function PageSupplier() {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedSuppliers = applyPagination(suppliers, page, rowsPerPage);

  return (
    <DashboardLayout>
    
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Suppliers</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
              </Button>
            </Stack>
          </Stack>
          <div>
            <Button
              component={Link}
              to="/SupplierForm"
              startIcon={<PlusIcon />}
              variant="contained"
            >
              Add
            </Button>
          </div>
        </Stack>
     <SuppliersFilters/>
        <SuppliersTable
          count={paginatedSuppliers.length}
          page={page}
          rows={paginatedSuppliers}
          rowsPerPage={rowsPerPage}
        />
      </Stack>
    </DashboardLayout>
  );
}

function applyPagination(rows, page, rowsPerPage) {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
