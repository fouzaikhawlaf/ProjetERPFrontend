// src/components/ProfilePage.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Dropdown, Button, Form, Row, Col } from 'react-bootstrap';
import { FaUser, FaTachometerAlt, FaCogs, FaProjectDiagram, FaUsers } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';  // Importing calendar styles
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';


// Set up the localizer for moment.js (handles date formats)
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

// Sidebar Component
const Sidebar = () => (
    <div className="bg-light p-3 vh-100">
        <h5 className="text-dark mb-4">Navigation</h5>
        <NavLink label="Dashboard" icon={<FaTachometerAlt />} />
        <NavLink label="Projects" icon={<FaProjectDiagram />} />
        <NavLink label="Teams" icon={<FaUsers />} />
        <NavLink label="Settings" icon={<FaCogs />} submenu={[
            { label: 'Account Settings' },
            { label: 'Privacy Settings' }
        ]} />
    </div>
);

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

// Calendar Component for Schedule
const EmployeeCalendar = ({ events }) => (
    <Card className="shadow-sm mt-4">
        <Card.Header className="bg-info text-white">Employee Calendar</Card.Header>
        <Card.Body>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={['month', 'week', 'day']}
            />
        </Card.Body>
    </Card>
);

EmployeeCalendar.propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        start: PropTypes.instanceOf(Date).isRequired,
        end: PropTypes.instanceOf(Date).isRequired,
    })).isRequired,
};

// Main Content Component
const MainContent = ({ user, onUserChange, onSave, isEditing, setIsEditing }) => {
    // Dummy events for the calendar, can be fetched from the API
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
                            <h4 className="mb-0">Employee Information</h4>
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
                        <Card.Header className="bg-info text-white">Projects</Card.Header>
                        <Card.Body>
                            {/* List assigned projects here */}
                            <p>No projects assigned.</p>
                        </Card.Body>
                    </Card>
                    <Card className="shadow-sm mt-4">
                        <Card.Header className="bg-secondary text-white">User Statistics</Card.Header>
                        <Card.Body>
                            <Bar
                                data={{
                                    labels: ['Projects', 'Teams', 'Tasks'],
                                    datasets: [{
                                        label: 'Count',
                                        data: [5, 2, 12],
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
                    {/* Integrating the Calendar */}
                    <EmployeeCalendar events={sampleEvents} />
                </Col>
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
    onUserChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
};

// ProfilePage Component
const ProfilePage = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        axios.get('/api/user/profile')
            .then(response => setUser(response.data))
            .catch(error => console.error('Error fetching user data:', error));
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
        // Add your logout logic here
    };

    return (
        <DashboardLayout>
            <div className="d-flex flex-column vh-100">
                <Navbar username={user.firstName} onLogout={handleLogout} />
                <div className="d-flex flex-grow-1">
                    <Sidebar />
                    <MainContent
                        user={user}
                        onUserChange={handleUserChange}
                        onSave={handleSave}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
