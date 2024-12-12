import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, ProgressBar, ListGroup, Spinner, Form } from 'react-bootstrap';
import { Avatar, TextField, Switch } from '@mui/material';
import UpdateInfoForm from './UpdateInfoForm';
import LeaveRequestDialog from './LeaveRequestForm';
import CalendarComponent from './CalendarComponent';
import LeaveChart from './LeaveChart';
 // Import du composant ProfileInformation
import Header from './Header'; // Import du composant Header
import ProfileInformation from './ProfileInformation ';

const ProfileDashboard = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [leaveType, setLeaveType] = useState('Vacation');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/userdata');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateInfo = () => {
    setIsEditing(false);
    handleClose();
  };
  const handleLeaveRequest = () => setShowLeaveRequestDialog(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const totalLeaveDays = userData ? userData.remainingLeaveDays + userData.takenLeaveDays : 0;
  const leaveProgress = totalLeaveDays ? (userData.takenLeaveDays / totalLeaveDays) * 100 : 0;

  const themeStyles = darkMode
    ? { backgroundColor: '#333', color: '#fff' }
    : { backgroundColor: '#fff', color: '#000' };

  if (!userData) return <Spinner animation="border" />;

  return (
    <Container fluid style={{ ...themeStyles, padding: '30px' }}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} title="Profile Dashboard" />

      {/* User Profile Information */}
      <ProfileInformation
        title="User Profile"
        description="Manage your personal information"
        name={userData.name}
        email={userData.email}
        phone={userData.phone}
      />

      {/* Leave Management */}
      <Card style={{ ...styles.leaveCard, ...themeStyles }}>
        <Card.Body>
          <LeaveChart takenLeaveDays={userData.takenLeaveDays} remainingLeaveDays={userData.remainingLeaveDays} />
          <ProgressBar now={leaveProgress} label={`${Math.round(leaveProgress)}%`} />
          <Form.Select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            style={{ marginTop: '15px', maxWidth: '300px' }}
          >
            <option value="Vacation">Vacation</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Personal Leave">Personal Leave</option>
          </Form.Select>
        </Card.Body>
        <Button style={styles.leaveButton} onClick={() => setShowLeaveRequestDialog(true)}>
          Request Leave
        </Button>
      </Card>

      <LeaveRequestDialog open={showLeaveRequestDialog} handleClose={handleLeaveRequest} leaveType={leaveType} />

      {/* Calendar */}
      <Card style={{ ...styles.calendarCard, ...themeStyles }}>
        <Card.Body>
          <CalendarComponent />
        </Card.Body>
      </Card>

      {/* Recent Activity */}
      <Card style={{ ...styles.activityCard, ...themeStyles }}>
        <Card.Header>Recent Activity</Card.Header>
        <ListGroup variant="flush">
          {userData.recentActivity && userData.recentActivity.length > 0 ? (
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

      {/* Document Upload */}
      <Card style={{ ...styles.docsCard, ...themeStyles }}>
        <Card.Body>
          <Button style={styles.downloadButton}>Download CV</Button>
          <input type="file" style={{ marginTop: '10px' }} />
        </Card.Body>
      </Card>
    </Container>
  );
};

const styles = {
  leaveCard: {
    marginTop: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  leaveButton: {
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '30px',
    padding: '10px 25px',
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  calendarCard: {
    marginTop: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  activityCard: {
    marginTop: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  docsCard: {
    marginTop: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    padding: '20px',
  },
  downloadButton: {
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '30px',
    padding: '10px 25px',
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export default ProfileDashboard;
