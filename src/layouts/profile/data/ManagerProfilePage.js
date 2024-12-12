// src/components/ManagerProfilePage.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Dropdown, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { FaUser, FaTachometerAlt, FaCogs, FaProjectDiagram, FaUsers, FaTasks, FaCalendarCheck } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';  // Importing calendar styles
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

const localizer = momentLocalizer(moment);

// Navbar Component
const Navbar = ({ username, onLogout }) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">ERP System</a>
            <div className="collapse navbar-collapse justify-content-end">
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="text-primary">
                        <FaUser /> {username}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#">Profile</Dropdown.Item>
                        <Dropdown.Item href="#" onClick={onLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    </nav>
);

Navbar.propTypes = {
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func.isRequired,
};

// Sidebar Component with manager-specific options
const Sidebar = () => (
    <div className="bg-light p-3 vh-100">
        <h5 className="text-dark mb-4">Navigation</h5>
        <NavLink label="Dashboard" icon={<FaTachometerAlt />} />
        <NavLink label="Projects" icon={<FaProjectDiagram />} />
        <NavLink label="Teams" icon={<FaUsers />} />
        <NavLink label="Tasks" icon={<FaTasks />} />
        <NavLink label="Leave Requests" icon={<FaCalendarCheck />} />
        <NavLink label="Settings" icon={<FaCogs />} submenu={[
            { label: 'Account Settings' },
            { label: 'Privacy Settings' }
        ]} />
    </div>
);

// NavLink Component (unchanged from employee profile)
const NavLink = ({ label, icon, submenu = [] }) => (
    <div>
        <Button variant="link" className="text-dark d-flex align-items-center mb-2">
            {icon} <span className="ms-2">{label}</span>
        </Button>
        {submenu.length > 0 && (
            <div className="ms-3">
                {submenu.map((item, index) => (
                    <Button key={index} variant="link" className="text-dark d-block mb-1">{item.label}</Button>
                ))}
            </div>
        )}
    </div>
);

NavLink.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    submenu: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
    })),
};

// Leave Requests Component
const LeaveRequests = ({ leaveRequests, onAction }) => (
    <Card className="shadow-sm mt-4">
        <Card.Header className="bg-warning text-white">Leave Requests</Card.Header>
        <Card.Body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Reason</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveRequests.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No leave requests.</td>
                        </tr>
                    ) : (
                        leaveRequests.map((request, index) => (
                            <tr key={index}>
                                <td>{request.employeeName}</td>
                                <td>{request.reason}</td>
                                <td>{new Date(request.startDate).toLocaleDateString()}</td>
                                <td>{new Date(request.endDate).toLocaleDateString()}</td>
                                <td>{request.status}</td>
                                <td>
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={() => onAction(request.id, 'accept')}
                                        disabled={request.status !== 'Pending'}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => onAction(request.id, 'reject')}
                                        disabled={request.status !== 'Pending'}
                                    >
                                        Reject
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </Card.Body>
    </Card>
);

LeaveRequests.propTypes = {
    leaveRequests: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        employeeName: PropTypes.string.isRequired,
        reason: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    })).isRequired,
    onAction: PropTypes.func.isRequired,
};

// Task Management Component
const TaskManagement = ({ tasks }) => (
    <Card className="shadow-sm mt-4">
        <Card.Header className="bg-primary text-white">Task Management</Card.Header>
        <Card.Body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Assigned To</th>
                        <th>Deadline</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">No tasks available.</td>
                        </tr>
                    ) : (
                        tasks.map((task, index) => (
                            <tr key={index}>
                                <td>{task.title}</td>
                                <td>{task.assignedTo}</td>
                                <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                <td>{task.status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </Card.Body>
    </Card>
);

TaskManagement.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        assignedTo: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    })).isRequired,
};

// Main Content Component
const MainContent = ({ user, leaveRequests, tasks, onUserChange, onSave, isEditing, setIsEditing, handleLeaveAction }) => {
    const sampleEvents = [
        { title: 'Meeting', start: new Date(), end: new Date() },
        { title: 'Project Deadline', start: new Date(2023, 9, 29), end: new Date(2023, 9, 30) }
    ];

    return (
        <div className="container mt-4">
            <Row>
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Manager Information</h4>
                            {isEditing ? (
                                <Button variant="success" onClick={onSave}>Save</Button>
                            ) : (
                                <Button variant="warning" onClick={() => setIsEditing(true)}>Edit</Button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="row mb-3">
                                    <Form.Label className="col-sm-4 col-form-label">First Name:</Form.Label>
                                    <div className="col-sm-8">
                                        {isEditing ? (
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={user.firstName}
                                                onChange={onUserChange}
                                            />
                                        ) : (
                                            <p className="form-control-plaintext">{user.firstName}</p>
                                        )}
                                    </div>
                                </Form.Group>
                                <Form.Group className="row mb-3">
                                    <Form.Label className="col-sm-4 col-form-label">Last Name:</Form.Label>
                                    <div className="col-sm-8">
                                        {isEditing ? (
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={user.lastName}
                                                onChange={onUserChange}
                                            />
                                        ) : (
                                            <p className="form-control-plaintext">{user.lastName}</p>
                                        )}
                                    </div>
                                </Form.Group>
                                <Form.Group className="row mb-3">
                                    <Form.Label className="col-sm-4 col-form-label">Email:</Form.Label>
                                    <div className="col-sm-8">
                                        {isEditing ? (
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={user.email}
                                                onChange={onUserChange}
                                            />
                                        ) : (
                                            <p className="form-control-plaintext">{user.email}</p>
                                        )}
                                    </div>
                                </Form.Group>
                                <Form.Group className="row mb-3">
                                    <Form.Label className="col-sm-4 col-form-label">Phone:</Form.Label>
                                    <div className="col-sm-8">
                                        {isEditing ? (
                                            <Form.Control
                                                type="text"
                                                name="phone"
                                                value={user.phone}
                                                onChange={onUserChange}
                                            />
                                        ) : (
                                            <p className="form-control-plaintext">{user.phone}</p>
                                        )}
                                    </div>
                                </Form.Group>
                                <Form.Group className="row mb-3">
                                    <Form.Label className="col-sm-4 col-form-label">Role:</Form.Label>
                                    <div className="col-sm-8">
                                        <p className="form-control-plaintext">{user.role}</p>
                                    </div>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    {/* Projects can be added here */}
                    <Card className="shadow-sm">
                        <Card.Header className="bg-secondary text-white">User Statistics</Card.Header>
                        <Card.Body>
                            <Bar
                                data={{
                                    labels: ['Projects', 'Teams', 'Tasks'],
                                    datasets: [{
                                        label: 'Count',
                                        data: [5, 3, 12],
                                        backgroundColor: ['#007bff', '#28a745', '#dc3545']
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: { beginAtZero: true }
                                    }
                                }}
                            />
                        </Card.Body>
                    </Card>
                    {/* Calendar */}
                    <Card className="shadow-sm mt-4">
                        <Card.Header className="bg-info text-white">Manager Calendar</Card.Header>
                        <Card.Body>
                            <Calendar
                                localizer={localizer}
                                events={sampleEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                views={['month', 'week', 'day']}
                            />
                        </Card.Body>
                    </Card>
                    {/* Task Management */}
                    <TaskManagement tasks={tasks} />
                </Col>
            </Row>
            <Row>
                {/* Leave Requests */}
                <LeaveRequests leaveRequests={leaveRequests} onAction={handleLeaveAction} />
            </Row>
        </div>
    );
};

MainContent.propTypes = {
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
    leaveRequests: PropTypes.array.isRequired,
    tasks: PropTypes.array.isRequired,
    onUserChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    handleLeaveAction: PropTypes.func.isRequired,
};

// Manager Profile Page Component
const ManagerProfilePage = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Manager',  // Set role to Manager
    });

    const [isEditing, setIsEditing] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch user profile
        axios.get('/api/user/profile')
            .then(response => setUser(response.data))
            .catch(error => console.error('Error fetching user data:', error));

        // Fetch leave requests
        axios.get('/api/manager/leave-requests')
            .then(response => setLeaveRequests(response.data))
            .catch(error => console.error('Error fetching leave requests:', error));

        // Fetch tasks assigned to the manager
        axios.get('/api/manager/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSave = () => {
        axios.put('/api/user/profile', user)
            .then(() => {
                setIsEditing(false);
            })
            .catch(error => console.error('Error saving user data:', error));
    };

    const handleLogout = () => {
        console.log('Logout clicked');
        // Add logout logic
    };

    const handleLeaveAction = (leaveId, action) => {
        // Handle accepting or rejecting leave requests
        axios.post(`/api/manager/leave-requests/${leaveId}/${action}`)
            .then(() => {
                // Update the leave requests after action is performed
                setLeaveRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === leaveId
                            ? { ...request, status: action === 'accept' ? 'Accepted' : 'Rejected' }
                            : request
                    )
                );
            })
            .catch(error => console.error('Error updating leave request:', error));
    };

    return (
        <DashboardLayout>
            <div className="d-flex flex-column vh-100">
                <Navbar username={user.firstName} onLogout={handleLogout} />
                <div className="d-flex flex-grow-1">
                    <Sidebar />
                    <MainContent
                        user={user}
                        leaveRequests={leaveRequests}
                        tasks={tasks}
                        onUserChange={handleUserChange}
                        onSave={handleSave}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleLeaveAction={handleLeaveAction}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManagerProfilePage;
