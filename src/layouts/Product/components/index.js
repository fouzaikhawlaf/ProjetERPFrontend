import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { Upload as UploadIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';



import { Link } from 'react-router-dom';
import { ProductsTable } from './ProductsTable';
import { ProductsFilters } from './ProductsFilters';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
// Suppression de la partie config
export const metadata = { title: 'Products | Dashboard' };

const products = [
  {
    id: 'PROD-001',
    reference: 'REF-001',
    name: 'Product One',
    category: 'Category One',
    brand: 'Brand One',
    salePrice: 150,
    stock: 100,
    tva: 19,
    tax: 5,
    createdAt: dayjs().subtract(5, 'days').toDate(),
  },
  // Add more products as needed
];

export default function PageProduct() {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedProducts = applyPagination(products, page, rowsPerPage);

  return (
    <DashboardLayout>
    
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Products</Typography>
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
              to="/Produit"
              startIcon={<PlusIcon />}
              variant="contained"
            >
              Add
            </Button>
          </div>
        </Stack>
        <ProductsFilters />
        <ProductsTable
          count={paginatedProducts.length}
          page={page}
          rows={paginatedProducts}
          rowsPerPage={rowsPerPage}
        />
      </Stack>
    </DashboardLayout>
  );
}

function applyPagination(rows, page, rowsPerPage) {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
