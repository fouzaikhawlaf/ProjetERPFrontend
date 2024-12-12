// src/api.js
import apiErp from './api';

// Function to get all suppliers
export const getSuppliers = async () => {
    try {
        const response = await apiErp.get('/suppliers');
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};

// Function to get a supplier by ID
export const getSupplierById = async (id) => {
    try {
        const response = await apiErp.get(`/Suppliers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier:', error);
        throw error;
    }
};

// Function to create a new supplier
export const createSupplier = async (supplierData) => {
    try {
      const response = await apiErp.post('/Suppliers', supplierData);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  };

// Function to update an existing supplier
export const updateSupplier = async (id, supplierData) => {
    try {
        await apiErp.put(`/suppliers/${id}`, supplierData);
    } catch (error) {
        console.error('Error updating supplier:', error);
        throw error;
    }
};

// Function to delete a supplier
export const deleteSupplier = async (id) => {
    try {
        const response = await apiErp.delete(`/suppliers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting supplier:', error);
        throw error;
    }
};

// Function to search suppliers
export const searchSuppliers = async (query) => {
    try {
        const response = await apiErp.get('/suppliers/search', { params: { query } });
        return response.data;
    } catch (error) {
        console.error('Error searching suppliers:', error);
        throw error;
    }
};

// Function to archive a supplier
export const archiveSupplier = async (id) => {
    try {
        const response = await apiErp.put(`/suppliers/archive/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error archiving supplier:', error);
        throw error;
    }
};

// Function to export suppliers to PDF
export const exportSuppliersToPdf = async () => {
    try {
        const response = await apiErp.get('/suppliers/export', { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error('Error exporting suppliers to PDF:', error);
        throw error;
    }
};
