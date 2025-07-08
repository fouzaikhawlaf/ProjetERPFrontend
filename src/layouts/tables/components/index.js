import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { Upload as UploadIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';

import { CustomersTable } from './custumersTabe';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


import { Link } from 'react-router-dom';
// Suppression de la partie config
export const metadata = { title: 'Customers | Dashboard' };

const customers = [
  {
    id: 'USR-010',
    name: 'Alcides Antonio',
    avatar: '/assets/avatar-10.png',
    email: 'alcides.antonio@devias.io',
    phone: '908-691-3242',
    address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  // ... (les autres clients)
];

export default function Page() {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <DashboardLayout>
  
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            
          </Stack>
        </Stack>
        <div>
        
        </div>
      </Stack>
     
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
    </DashboardLayout>
  );
}

function applyPagination(rows, page, rowsPerPage) {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
