import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { Upload as UploadIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import SupplierListTable, { SuppliersTable } from './SuppliersTable';
import { SuppliersFilters } from './SuppliersFilters';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import Snackbar from '@mui/material/Snackbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const metadata = { title: 'Suppliers | Dashboard' };

const suppliers = [
  {
    id: 'SUP-001',
    name: 'Supplier One',
    avatar: '/assets/avatar-1.png',
    email: 'supplier.one@example.com',
    phone: '123-456-7890',
    address: { city: 'Paris', country: 'France', state: 'Île-de-France', street: '123 Supplier Street' },
    status: 'Active',
    createdAt: dayjs().subtract(5, 'days').toDate(),
  },
  // Add more suppliers as needed
];

export default function PageSupplier() {
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '' });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const page = 0;
  const rowsPerPage = 5;

  const paginatedSuppliers = applyPagination(suppliers, page, rowsPerPage);

  const handleSnackbarClose = () => setSnackbar({ open: false, message: '' });
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleImport = () => {
    setSnackbar({ open: true, message: 'Import started...' });
  };

  const handleExport = () => {
    setSnackbar({ open: true, message: 'Export completed!' });
  };

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        
        
        <SupplierListTable
          count={paginatedSuppliers.length}
          page={page}
          rows={paginatedSuppliers}
          rowsPerPage={rowsPerPage}
        />
      </Stack>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      />
    </DashboardLayout>
  );
}

function applyPagination(rows, page, rowsPerPage) {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
