import apiErp from './api'; // Import the base Axios instance

// Service methods for leave requests (Conge)
const CongeService = {
  // Create a new leave request
  createLeaveRequest: async (leaveRequestData) => {
    try {
      const response = await apiErp.post('/LeaveRequest', leaveRequestData); // POST /api/LeaveRequest
      return response.data;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  },

  // Get a leave request by ID
  getLeaveRequestById: async (id) => {
    try {
      const response = await apiErp.get(`/LeaveRequest/${id}`); // GET /api/LeaveRequest/{id}
      return response.data;
    } catch (error) {
      console.error('Error fetching leave request:', error);
      throw error;
    }
  },

  // Get all leave requests
  getAllLeaveRequests: async () => {
    try {
      const response = await apiErp.get('/LeaveRequest'); // GET /api/LeaveRequest
      return response.data;
    } catch (error) {
      console.error('Error fetching all leave requests:', error);
      throw error;
    }
  },

  // Update a leave request
  updateLeaveRequest: async (id, updateData) => {
    try {
      const response = await apiErp.put(`/LeaveRequest/${id}`, updateData); // PUT /api/LeaveRequest/{id}
      return response.data;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  },

  // Delete a leave request
  deleteLeaveRequest: async (id) => {
    try {
      const response = await apiErp.delete(`/LeaveRequest/${id}`); // DELETE /api/LeaveRequest/{id}
      return response.data;
    } catch (error) {
      console.error('Error deleting leave request:', error);
      throw error;
    }
  },

  // Approve or reject a leave request
  approveLeaveRequest: async (id, isApproved, managerComment) => {
    try {
      const response = await apiErp.post(`/LeaveRequest/${id}/approve`, { isApproved, managerComment }); // POST /api/LeaveRequest/{id}/approve
      return response.data;
    } catch (error) {
      console.error('Error approving/rejecting leave request:', error);
      throw error;
    }
  },

  // Notify employee about a leave request
  notifyEmployee: async (id) => {
    try {
      const response = await apiErp.post(`/LeaveRequest/${id}/notify`); // POST /api/LeaveRequest/{id}/notify
      return response.data;
    } catch (error) {
      console.error('Error notifying employee:', error);
      throw error;
    }
  },
};

export default CongeService;