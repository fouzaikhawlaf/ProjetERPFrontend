import React, { useState } from 'react';
import {
  Container,
  Card,
  Button,
  ProgressBar,
  ListGroup,
  Form,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';
import CalendarComponent from './CalendarComponent';
import LeaveRequestDialog from './LeaveRequestForm';
import LeaveChart from './LeaveChart';
import Header from './Header';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ProfileInformation from './ProfileInformation ';
import ManageProfileDialog from './ManageProfileDialog ';

const ProfileDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [leaveType, setLeaveType] = useState('Vacation');
  const [showToast, setShowToast] = useState(false);

  // Simulated user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    remainingLeaveDays: 10,
    takenLeaveDays: 5,
    recentActivity: [
      'Submitted a leave request',
      'Updated profile information',
      'Downloaded CV',
    ],
    tasks: [
      { title: 'Finish API Integration', status: 'In Progress' },
      { title: 'Prepare Leave Report', status: 'Completed' },
      { title: 'Update Profile Information', status: 'Pending' },
    ],
  };

  const totalLeaveDays =
    userData.remainingLeaveDays + userData.takenLeaveDays;
  const leaveProgress = totalLeaveDays
    ? (userData.takenLeaveDays / totalLeaveDays) * 100
    : 0;

  const themeStyles = darkMode
    ? { backgroundColor: '#1e1e1e', color: '#fff' }
    : { backgroundColor: '#f8f9fa', color: '#212529' };

  const handleManageProfileClick = () => {
    setOpenDialog(true);
  };

  const handleSaveProfile = (updatedData) => {
    console.log('Updated Profile Data:', updatedData);
    setShowToast(true); // Show success toast
  };

  return (
    <DashboardLayout>
      <Container fluid style={{ ...themeStyles, padding: '30px' }}>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          title="Profile Dashboard"
        />

        <Row>
          {/* User Profile Section */}
          <Col md={4} className="mb-4">
            <ProfileInformation
              title="User Profile"
              description="Manage your personal information"
              name={userData.name}
              email={userData.email}
              phone={userData.phone}
              onManageProfileClick={handleManageProfileClick}
            />
            <ManageProfileDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              userData={userData}
              onSave={handleSaveProfile}
            />
          </Col>

          {/* Leave Management Section */}
          <Col md={4} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '10px', ...themeStyles }}>
              <Card.Body>
                <h5>Leave Overview</h5>
                <LeaveChart
                  takenLeaveDays={userData.takenLeaveDays}
                  remainingLeaveDays={userData.remainingLeaveDays}
                />
                <ProgressBar
                  now={leaveProgress}
                  label={`${Math.round(leaveProgress)}%`}
                />
                <Form.Select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="mt-3"
                >
                  <option value="Vacation">Vacation</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                </Form.Select>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button
                  variant="primary"
                  onClick={() => setShowLeaveRequestDialog(true)}
                >
                  Request Leave
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          {/* Recent Activity Section */}
          <Col md={4} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '10px', ...themeStyles }}>
              <Card.Header>Recent Activity</Card.Header>
              <ListGroup variant="flush">
                {userData.recentActivity.length > 0 ? (
                  userData.recentActivity.map((activity, index) => (
                    <ListGroup.Item key={index} style={{ ...themeStyles }}>
                      {activity}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No recent activity</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Your Leave Calendar Section */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '10px', ...themeStyles }}>
              <Card.Body>
                <h5>Your Leave Calendar</h5>
                <CalendarComponent /> {/* Replace with a calendar library */}
                <div className="mt-3 d-flex justify-content-start gap-3">
                  <span style={{ color: 'green' }}>● Approved</span>
                  <span style={{ color: 'yellow' }}>● Pending</span>
                  <span style={{ color: 'red' }}>● Rejected</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Your Tasks Section */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '10px', ...themeStyles }}>
              <Card.Body>
                <h5>Your Tasks</h5>
                <ListGroup>
                  {userData.tasks.map((task, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between">
                      <span>{task.title}</span>
                      <Badge
                        bg={
                          task.status === 'Completed'
                            ? 'success'
                            : task.status === 'In Progress'
                            ? 'primary'
                            : 'warning'
                        }
                      >
                        {task.status}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button
                  variant="success"
                  className="mt-3 w-100"
                >
                  Add New Task
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <LeaveRequestDialog
          open={showLeaveRequestDialog}
          handleClose={() => setShowLeaveRequestDialog(false)}
          leaveType={leaveType}
        />

        {/* Toast Notification */}
        <ToastContainer position="top-end" className="p-3">
          <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Profile Updated</strong>
            </Toast.Header>
            <Toast.Body>Your profile has been successfully updated!</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </DashboardLayout>
  );
};

export default ProfileDashboard;
