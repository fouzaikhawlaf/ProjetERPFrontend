import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { createTask } from "services/TaskProjectService";
import { getAllEmployees } from "services/EmployeeService";

const TaskCreate = () => {
  const { projectId } = useParams(); // Get projectId from URL
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedEmployees: [], // Multiple employees can be assigned
    status: "0", // Default status is "Pending"
  });
  const [employees, setEmployees] = useState([]); // List of employees
  const [departmentId, setDepartmentId] = useState(null); // Simulate department logic
  const navigate = useNavigate();

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        const employeeList = Array.isArray(response) ? response : response?.data?.$values || [];
        setEmployees(employeeList);

        // Simulating setting a department ID for filtering
        if (employeeList.length > 0) {
          setDepartmentId(employeeList[0].departmentId); // Example: Set to the first employee's department
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
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

  // Handle employee selection (allow multiple employees within the same department)
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
    if (!taskData.name || !taskData.startDate || !taskData.endDate || taskData.assignedEmployees.length === 0) {
      alert("Please fill in all required fields and assign the task to at least one employee.");
      return;
    }

    const payload = {
      name: taskData.name.trim(),
      description: taskData.description.trim(),
      status: parseInt(taskData.status, 10), // "Pending" status (non-editable)
      startDate: new Date(taskData.startDate).toISOString(),
      endDate: new Date(taskData.endDate).toISOString(),
      projectId: projectId,
      assignedToIds: taskData.assignedEmployees, // Array of selected employee IDs
    };

    try {
      const response = await createTask(payload);
      console.log("Task created successfully:", response);
      navigate(`/tasks/${projectId}`);
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
                  type="text"
                  value="Pending" // Non-editable
                  readOnly
                  disabled
                />
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
                <Form.Label>Assign to Employees (same department only)</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={taskData.assignedEmployees}
                  onChange={handleEmployeeSelection}
                >
                  {employees
                    .filter((emp) => emp.departmentId === departmentId) // Filter by department
                    .map((employee) => (
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
