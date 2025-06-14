import apiErp from './api'; // Import the Axios instance

// Get all projects
 const getProjects = async () => {
  try {
    const response = await apiErp.get('/project', {
      params: { 
        include: 'manager',
        status: 'ACTIVE'
      }
    });

    // Handle different response structures
    const data = response.data;
    return data.items || data.$values || data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};
// Create a new project
const createProject = async (projectData) => {
  try {
    const response = await apiErp.post('/project', projectData);
    console.log('Project created:', response.data);
    return response.data; // Return the created project data
  } catch (error) {
    console.error('Error creating project:', error);
    throw error; // Rethrow the error if needed for further handling
  }
};

// Update an existing project
const updateProject = async (projectId, updatedData) => {
  try {
    const response = await apiErp.put(`/project/${projectId}`, updatedData);
    console.log('Project updated:', response.data);
    return response.data; // Return the updated project data
  } catch (error) {
    console.error(`Error updating project with ID ${projectId}:`, error);
    throw error; // Rethrow the error for further processing
  }
};

// Delete a project
const deleteProject = async (projectId) => {
  try {
    await apiErp.delete(`/project/${projectId}`);
    console.log(`Project ${projectId} deleted`);
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw error; // Rethrow the error for handling if needed
  }
};

export { getProjects, createProject, updateProject, deleteProject };
