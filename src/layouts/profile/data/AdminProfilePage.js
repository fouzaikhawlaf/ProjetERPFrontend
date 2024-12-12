// src/components/AdminProfilePage.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Dropdown, Button, Form, Row, Col, Table, Modal } from 'react-bootstrap';
import { FaUser, FaTachometerAlt, FaCogs, FaProjectDiagram, FaUsers, FaUserPlus, FaUserShield } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
// Check if this import is correct
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


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

// Sidebar Component with Admin-Specific Links
const Sidebar = () => (
    <div className="bg-light p-3 vh-100">
        <h5 className="text-dark mb-4">Navigation</h5>
        <NavLink label="Dashboard" icon={<FaTachometerAlt />} />
        <NavLink label="User Management" icon={<FaUsers />} />
        <NavLink label="Project Management" icon={<FaProjectDiagram />} />
        <NavLink label="Role Management" icon={<FaUserShield />} />
        <NavLink label="Settings" icon={<FaCogs />} submenu={[
            { label: 'Account Settings' },
            { label: 'Privacy Settings' }
        ]} />
    </div>
);

// NavLink Component (unchanged)
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

// User Management Component
const UserManagement = ({ users, onRoleChange, onDeleteUser, onAddUser }) => {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = () => {
        onAddUser(newUser);
        setShowAddUserModal(false);
    };

    return (
        <>
            <Card className="shadow-sm mt-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between">
                    User Management
                    <Button variant="light" onClick={() => setShowAddUserModal(true)}>
                        <FaUserPlus /> Add User
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Form.Select
                                                aria-label="Change role"
                                                value={user.role}
                                                onChange={(e) => onRoleChange(user.id, e.target.value)}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Employee">Employee</option>
                                            </Form.Select>
                                            <Button
                                                variant="danger"
                                                onClick={() => onDeleteUser(user.id)}
                                                className="ms-2"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add User Modal */}
            <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                            >
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddUser}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

UserManagement.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    })).isRequired,
    onRoleChange: PropTypes.func.isRequired,
    onDeleteUser: PropTypes.func.isRequired,
    onAddUser: PropTypes.func.isRequired,
};

// Project Management Component with Project Creation
const ProjectManagement = ({ projects, onDeleteProject, onAddProject, users }) => {
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', assignedTo: '', deadline: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    const handleAddProject = () => {
        onAddProject(newProject);
        setShowAddProjectModal(false);
    };

    return (
        <>
            <Card className="shadow-sm mt-4">
                <Card.Header className="bg-success text-white d-flex justify-content-between">
                    Project Management
                    <Button variant="light" onClick={() => setShowAddProjectModal(true)}>
                        Add Project
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Assigned To</th>
                                <th>Deadline</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">No projects available.</td>
                                </tr>
                            ) : (
                                projects.map((project, index) => (
                                    <tr key={index}>
                                        <td>{project.name}</td>
                                        <td>{project.assignedTo}</td>
                                        <td>{new Date(project.deadline).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                onClick={() => onDeleteProject(project.id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add Project Modal */}
            <Modal show={showAddProjectModal} onHide={() => setShowAddProjectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter project name"
                                name="name"
                                value={newProject.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Assign To</Form.Label>
                            <Form.Select
                                name="assignedTo"
                                value={newProject.assignedTo}
                                onChange={handleInputChange}
                            >
                                <option value="">Select User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                name="deadline"
                                value={newProject.deadline}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddProjectModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddProject}>
                        Add Project
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

ProjectManagement.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        assignedTo: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
    })).isRequired,
    onDeleteProject: PropTypes.func.isRequired,
    onAddProject: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
};

// Main Content for Admin
const MainContent = ({ user, users, projects, onUserChange, onSave, isEditing, setIsEditing, onRoleChange, onDeleteUser, onAddUser, onDeleteProject, onAddProject }) => {
    return (
        <div className="container mt-4">
            <Row>
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Admin Information</h4>
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
                    <Card className="shadow-sm">
                        <Card.Header className="bg-secondary text-white">System Statistics</Card.Header>
                        <Card.Body>
                            <Bar
                                data={{
                                    labels: ['Users', 'Projects', 'Tasks'],
                                    datasets: [{
                                        label: 'Count',
                                        data: [users.length, projects.length, 50], // Mock tasks count
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
                </Col>
            </Row>
            <Row>
                {/* User Management */}
                <UserManagement
                    users={users}
                    onRoleChange={onRoleChange}
                    onDeleteUser={onDeleteUser}
                    onAddUser={onAddUser}
                />
            </Row>
            <Row>
                {/* Project Management */}
                <ProjectManagement
                    projects={projects}
                    onDeleteProject={onDeleteProject}
                    onAddProject={onAddProject}
                    users={users}
                />
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
    users: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    onUserChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    onRoleChange: PropTypes.func.isRequired,
    onDeleteUser: PropTypes.func.isRequired,
    onAddUser: PropTypes.func.isRequired,
    onDeleteProject: PropTypes.func.isRequired,
    onAddProject: PropTypes.func.isRequired,
};

// Admin Profile Page Component
const AdminProfilePage = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Admin',  // Set role to Admin
    });

    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch user profile
        axios.get('/api/user/profile')
            .then(response => setUser(response.data))
            .catch(error => console.error('Error fetching user data:', error));

        // Fetch all users for user management
        axios.get('/api/admin/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));

        // Fetch all projects for project management
        axios.get('/api/admin/projects')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Error fetching projects:', error));
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

    const handleRoleChange = (userId, newRole) => {
        axios.put(`/api/admin/users/${userId}/role`, { role: newRole })
            .then(() => {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? { ...user, role: newRole } : user
                    )
                );
            })
            .catch(error => console.error('Error changing user role:', error));
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`/api/admin/users/${userId}`)
            .then(() => {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    const handleAddUser = (newUser) => {
        axios.post('/api/admin/users', newUser)
            .then((response) => {
                setUsers([...users, response.data]);
            })
            .catch(error => console.error('Error adding user:', error));
    };

    const handleDeleteProject = (projectId) => {
        axios.delete(`/api/admin/projects/${projectId}`)
            .then(() => {
                setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
            })
            .catch(error => console.error('Error deleting project:', error));
    };

    const handleAddProject = (newProject) => {
        axios.post('/api/admin/projects', newProject)
            .then((response) => {
                setProjects([...projects, response.data]);
            })
            .catch(error => console.error('Error adding project:', error));
    };

    return (
        <DashboardLayout>
            <div className="d-flex flex-column vh-100">
                <Navbar username={user.firstName} onLogout={handleLogout} />
                <div className="d-flex flex-grow-1">
                    <Sidebar />
                    <MainContent
                        user={user}
                        users={users}
                        projects={projects}
                        onUserChange={handleUserChange}
                        onSave={handleSave}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        onRoleChange={handleRoleChange}
                        onDeleteUser={handleDeleteUser}
                        onAddUser={handleAddUser}
                        onDeleteProject={handleDeleteProject}
                        onAddProject={handleAddProject}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminProfilePage;
