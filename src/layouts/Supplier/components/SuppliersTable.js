import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Box,
  Checkbox,
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Pagination from 'react-bootstrap/Pagination'; // Bootstrap Pagination
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSuppliersWithAddresses, deleteSupplier } from 'services/supplierApi'; // Import deleteSupplier
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon
import EditIcon from '@mui/icons-material/Edit'; // Import Edit icon
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import View icon

export function SupplierListTable({
  rowsPerPage = 10, // Default number of rows per page
  onDelete,
  onUpdate,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [suppliers, setSuppliers] = useState([]); // State to store supplier data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [selectedSupplier, setSelectedSupplier] = useState(null); // State to store the selected supplier for viewing details
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog visibility
  const selectAllRef = useRef(null);

  // Fetch suppliers when the component mounts
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliersWithAddresses();
        console.log('API Response:', data); // Log the API response

        // Extract the array of suppliers from the response
        const suppliersArray = data.$values || [];

        // Ensure each supplier's addresses is an array
        const suppliersWithAddressesArray = suppliersArray.map((supplier) => ({
          ...supplier,
          addresses: supplier.addresses?.$values || [], // Access the nested $values array
        }));

        setSuppliers(suppliersWithAddressesArray);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(suppliers.length / rowsPerPage);

  // Get the rows to display for the current page
  const displayedSuppliers = Array.isArray(suppliers)
    ? suppliers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const selectAll = () => setSelectedIds(new Set(displayedSuppliers.map((supplier) => supplier.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const selectOne = (id) => setSelectedIds(new Set(selectedIds.add(id)));
  const deselectOne = (id) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  // Checking if all rows are selected or some are selected
  const selectedAll = displayedSuppliers.length > 0 && selectedIds.size === displayedSuppliers.length;
  const selectedSome = selectedIds.size > 0 && selectedIds.size < displayedSuppliers.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedSome;
    }
  }, [selectedSome]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle view details
  const handleViewDetails = (supplier) => {
    console.log('Selected Supplier:', supplier); // Log the selected supplier
    setSelectedSupplier(supplier);
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle delete supplier
  const handleDeleteSupplier = async (id) => {
    console.log('Delete button clicked, Supplier ID:', id); // Debugging line
    try {
      await deleteSupplier(id); // Call the deleteSupplier function
      // Remove the deleted supplier from the state
      setSuppliers((prevSuppliers) => {
        const updatedSuppliers = prevSuppliers.filter((supplier) => supplier.id !== id);
        console.log('Updated Suppliers:', updatedSuppliers); // Debugging line
        return updatedSuppliers;
      });
      console.log('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <Checkbox
                  inputRef={selectAllRef}
                  checked={selectedAll}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </th>
              <th>Nom de l&apos;entreprise</th>
              <th>Code</th>
              <th>Personne de contact</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Site web</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSuppliers.map((supplier) => {
              const isSelected = selectedIds.has(supplier.id);

              return (
                <tr key={supplier.id} className={isSelected ? 'table-primary' : ''}>
                  <td>
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(supplier.id);
                        } else {
                          deselectOne(supplier.id);
                        }
                      }}
                    />
                  </td>
                  <td>{supplier.name}</td>
                  <td>{supplier.code}</td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.website}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <IconButton
                        color="primary"
                        onClick={() => onUpdate(supplier.id)}
                        size="small"
                      >
                        <EditIcon /> {/* Edit icon */}
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteSupplier(supplier.id)} // Call handleDeleteSupplier
                        size="small"
                      >
                        <DeleteIcon /> {/* Delete icon */}
                      </IconButton>
                      <IconButton
                        color="info"
                        onClick={() => handleViewDetails(supplier)}
                        size="small"
                      >
                        <VisibilityIcon /> {/* View icon */}
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>

      {/* Pagination Controls */}
      <Divider />
      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>

      {/* Dialog to view supplier details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Supplier Details</DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <div>
              <p><strong>Name:</strong> {selectedSupplier.name}</p>
              <p><strong>Code:</strong> {selectedSupplier.code}</p>
              <p><strong>Contact Person:</strong> {selectedSupplier.contactPerson}</p>
              <p><strong>Email:</strong> {selectedSupplier.email}</p>
              <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
              <p><strong>Website:</strong> {selectedSupplier.website}</p>
              <p><strong>Addresses:</strong></p>
              {selectedSupplier.addresses && selectedSupplier.addresses.length > 0 ? (
                <ul>
                  {selectedSupplier.addresses.map((address, index) => (
                    <li key={index}>
                      <p><strong>Address Line 1:</strong> {address.addressLine1}</p>
                      <p><strong>Address Line 2:</strong> {address.addressLine2}</p>
                      <p><strong>Country:</strong> {address.country}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No addresses available.</p>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

SupplierListTable.propTypes = {
  rowsPerPage: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SupplierListTable;