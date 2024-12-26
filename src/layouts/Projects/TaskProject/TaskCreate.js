import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { createTask } from "services/TaskProjectService"; // Service function to create task
import { getAllEmployees } from "services/EmployeeService"; // Service function to fetch employees

const TaskCreate = () => {
  const { projectId } = useParams(); // Get projectId from the URL
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    status: "0", // Default status
    startDate: "", // Default start date
    endDate: "", // Default end date
    assignedEmployees: [], // New field for assigned employees
  });
  const [employees, setEmployees] = useState([]); // List of employees
  const navigate = useNavigate();

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        // Ensure response is an array or extract it correctly
        const employeeList = Array.isArray(response) ? response : response?.data?.$values || [];
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); // Default to empty if there's an error
      }
    };
    fetchEmployees();
  }, []);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  // Handle employee selection changes
  const handleEmployeeSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setTaskData({
      ...taskData,
      assignedEmployees: selectedOptions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (!taskData.name || !taskData.startDate || !taskData.endDate || !taskData.assignedEmployees[0]) {
      alert("Please fill in all required fields, including assigning the task to at least one employee.");
      return;
    }
  
    const payload = {
      name: taskData.name.trim(),
      description: taskData.description.trim(),
      status: parseInt(taskData.status, 10), // Ensure status is an integer
      startDate: new Date(taskData.startDate).toISOString(), // Convert to ISO format
      endDate: new Date(taskData.endDate).toISOString(),
      projectId: projectId, // Convert projectId to integer
      assignedToId: taskData.assignedEmployees[0], // Take the first selected employee as the assignedToId
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const response = await createTask(payload);
      console.log("Task created successfully:", response);
      navigate(`/tasks/${projectId}`); // Redirect to tasks page
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      alert("Failed to create task: " + JSON.stringify(error.response?.data.errors || {}));
    }
  };
  
  

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white fw-bold">Create Task</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="taskName" className="mb-3">
                <Form.Label>Task Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task name"
                  name="name"
                  value={taskData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="taskDescription" className="mb-3">
                <Form.Label>Task Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="taskStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={taskData.status}
                  onChange={handleChange}
                >
                  <option value="0">Pending</option>
                  <option value="1">In Progress</option>
                  <option value="2">Completed</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="taskStartDate" className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={taskData.startDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="taskEndDate" className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={taskData.endDate}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="assignedEmployees" className="mb-3">
       <Form.Label>Assign to Employee</Form.Label>
  <Form.Control
    as="select"
    value={taskData.assignedEmployees[0] || ""}
    onChange={(e) => {
      setTaskData({
        ...taskData,
        assignedEmployees: [e.target.value], // Store the selected employee ID as an array with one item
      });
    }}
  >
    <option value="">Select an employee</option>
    {employees.map((employee) => (
      <option key={employee.id} value={employee.id}>
        {employee.firstName} {employee.lastName}
      </option>
    ))}
  </Form.Control>
</Form.Group>
              <Button variant="primary" type="submit">
                Create Task
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default TaskCreate;
