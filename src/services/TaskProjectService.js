import apiErp from './api'; // Import the Axios instance

// Create a new task
const createTask = async (taskData) => {
  try {
    const response = await apiErp.post('/Task', taskData);
    console.log('Task created:', response.data);
    return response.data; // Return the created task
  } catch (error) {
    console.error('Error creating task:', error.response?.data || error.message);
    throw error; // Rethrow the error for further handling
  }
};

// Get all tasks
const getAllTasks = async () => {
  try {
    const response = await apiErp.get('/Task');
    console.log('Tasks fetched:', response.data.$values);
    return response.data.$values; // Return the list of tasks
  } catch (error) {
    console.error('Error fetching tasks:', error.response?.data || error.message);
    throw error; // Rethrow the error for handling later
  }
};

// Get a task by ID
const getTaskById = async (id) => {
  try {
    const response = await apiErp.get(`/Task/${id}`);
    console.log(`Task with ID ${id} fetched:`, response.data.$values);
    return response.data.$values; // Return the task data
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error.response?.data.$values || error.message);
    throw error;
  }
};

// Update a task
const updateTask = async (id, taskUpdateData) => {
  try {
    const response = await apiErp.put(`/Task/${id}`, taskUpdateData);
    console.log(`Task with ID ${id} updated:`, response.data);
    return response.data; // Return the updated task
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete a task
const deleteTask = async (id) => {
  try {
    await apiErp.delete(`/Task/${id}`);
    console.log(`Task with ID ${id} deleted`);
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Assign a task to an employee
const assignTaskToEmployee = async (taskId, employeeId) => {
  try {
    await apiErp.post(`/Task/${taskId}/assign/${employeeId}`);
    console.log(`Task ${taskId} assigned to employee ${employeeId}`);
  } catch (error) {
    console.error(`Error assigning task ${taskId} to employee ${employeeId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Mark a task as completed
const completeTask = async (taskId) => {
  try {
    await apiErp.post(`/Task/${taskId}/complete`);
    console.log(`Task ${taskId} marked as completed`);
  } catch (error) {
    console.error(`Error completing task with ID ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Récupérer les tâches par ID du projet
const getTasksByProjectId = async (projectId) => {
  try {
    const response = await apiErp.get(`/Task/project/${projectId}`);
    console.log("Raw response from API:", response.data); // Log des données brutes
    // Si la réponse contient un tableau sous la clé $values, le retourner, sinon retourner un tableau vide
    return response.data.$values || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches par projectId:", error.response?.data || error.message);
    throw error; // Propager l'erreur
  }
};

// Get tasks by employee ID
const getTasksByEmployeeId = async (employeeId) => {
  try {
    const response = await apiErp.get(`/Task/employee/${employeeId}`);
    console.log(`Tasks for employee ID ${employeeId} fetched:`, response.data);
    return response.data; // Return the list of tasks
  } catch (error) {
    console.error(`Error fetching tasks for employee ID ${employeeId}:`, error.response?.data || error.message);
    throw error;
  }
};



export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTaskToEmployee,
  completeTask,
  getTasksByProjectId, // Newly added
  getTasksByEmployeeId, // Newly added
};
