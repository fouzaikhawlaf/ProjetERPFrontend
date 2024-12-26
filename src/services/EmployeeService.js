import apiErp from './api'; // Import the Axios instance

// Create a new employee
const createEmployee = async (employeeData) => {
  try {
    const response = await apiErp.post('/Employee', employeeData);
    console.log('Employee created:', response.data.$values);
    return response.data.$values; // Return the created employee
  } catch (error) {
    console.error('Error creating employee:', error.response?.data.$values || error.message);
    throw error; // Rethrow the error for further handling
  }
};

// Get all employees
const getAllEmployees = async () => {
  try {
    const response = await apiErp.get('/Employee');
    console.log('Employees fetched:', response.data.$values);
    return response.data.$values; // Return the list of employees
  } catch (error) {
    console.error('Error fetching employees:', error.response?.data.$values || error.message);
    throw error; // Rethrow the error for handling later
  }
};

// Get an employee by ID
const getEmployeeById = async (id) => {
  try {
    const response = await apiErp.get(`/Employee/${id}`);
    console.log(`Employee with ID ${id} fetched:`, response.data);
    return response.data.$values; // Return the employee data
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Update an employee
const updateEmployee = async (id, employeeUpdateData) => {
  try {
    const response = await apiErp.put(`/Employee/${id}`, employeeUpdateData);
    console.log(`Employee with ID ${id} updated:`, response.data);
    return response.data; // Return the updated employee
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete an employee
const deleteEmployee = async (id) => {
  try {
    await apiErp.delete(`/Employee/${id}`);
    console.log(`Employee with ID ${id} deleted`);
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Get employees by project ID
const getEmployeesByProjectId = async (projectId) => {
  try {
    const response = await apiErp.get(`/Employee/project/${projectId}`);
    console.log(`Employees for project ID ${projectId} fetched:`, response.data);
    return response.data; // Return the list of employees
  } catch (error) {
    console.error(`Error fetching employees for project ID ${projectId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Assign an employee to a project
const assignEmployeeToProject = async (employeeId, projectId) => {
  try {
    await apiErp.post(`/Employee/${employeeId}/assign/${projectId}`);
    console.log(`Employee ${employeeId} assigned to project ${projectId}`);
  } catch (error) {
    console.error(`Error assigning employee ${employeeId} to project ${projectId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Remove an employee from a project
const removeEmployeeFromProject = async (employeeId, projectId) => {
  try {
    await apiErp.post(`/Employee/${employeeId}/remove/${projectId}`);
    console.log(`Employee ${employeeId} removed from project ${projectId}`);
  } catch (error) {
    console.error(`Error removing employee ${employeeId} from project ${projectId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Get the workload of an employee
const getEmployeeWorkload = async (employeeId) => {
  try {
    const response = await apiErp.get(`/Employee/${employeeId}/workload`);
    console.log(`Workload for employee ${employeeId} fetched:`, response.data);
    return response.data; // Return the workload data
  } catch (error) {
    console.error(`Error fetching workload for employee ${employeeId}:`, error.response?.data || error.message);
    throw error;
  }
};

export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesByProjectId,
  assignEmployeeToProject,
  removeEmployeeFromProject,
  getEmployeeWorkload,
};
