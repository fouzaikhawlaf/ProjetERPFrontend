import React, { useState } from 'react';
import { Container, Card, Button, ProgressBar, ListGroup, Form, Row, Col } from 'react-bootstrap';
import { CircularProgress } from '@mui/material';
import LeaveRequestDialog from './LeaveRequestForm';
import CalendarComponent from './CalendarComponent';
import LeaveChart from './LeaveChart';
import Header from './Header';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import ProfileInformation from './ProfileInformation ';
import ManageProfileDialog from './ManageProfileDialog ';
//import ManageProfileDialog from "./ManageProfileDialog";
const ProfileDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  // Données statiques simulées
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
  };

  const [darkMode, setDarkMode] = useState(false);
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [leaveType, setLeaveType] = useState('Vacation');

  const totalLeaveDays = userData.remainingLeaveDays + userData.takenLeaveDays;
  const leaveProgress = totalLeaveDays ? (userData.takenLeaveDays / totalLeaveDays) * 100 : 0;

  const themeStyles = darkMode
    ? { backgroundColor: '#333', color: '#fff' }
    : { backgroundColor: '#fff', color: '#000' };
// Fonction pour ouvrir/fermer la boîte de dialogue
const handleManageProfileClick = () => {
  setOpenDialog(true);
};

// Fonction pour sauvegarder les modifications du profil
const handleSaveProfile = (updatedData) => {
  console.log("Updated Profile Data:", updatedData);
  // Vous pouvez ici faire une requête API pour sauvegarder les données sur le serveur
};

  return (
    <DashboardLayout>
      <Container fluid style={{ ...themeStyles, padding: '30px' }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} title="Profile Dashboard" />

        {/* Profile Information */}
        <Row>
          <Col md={4}>
            <ProfileInformation
              title="User Profile"
              description="Manage your personal information"
              name={userData.name}
              email={userData.email}
              phone={userData.phone}
              onManageProfileClick={handleManageProfileClick} // Gère l'ouverture du dialog
            />

         <ManageProfileDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
          </Col>

          {/* Leave Management */}
          <Col md={4}>
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
          </Col>

          {/* Recent Activity */}
          <Col md={4}>
            <Card style={{ ...styles.activityCard, ...themeStyles }}>
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

        {/* Calendar */}
        <Row>
          <Col>
            <Card style={{ ...styles.calendarCard, ...themeStyles }}>
              <Card.Body>
                <CalendarComponent />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <LeaveRequestDialog open={showLeaveRequestDialog} handleClose={() => setShowLeaveRequestDialog(false)} leaveType={leaveType} />
      </Container>
    </DashboardLayout>
  );
};

const styles = {
  leaveCard: {
    marginTop: '20px',
    borderRadius: '10px',
    padding: '20px',
  },
  leaveButton: {
    marginTop: '15px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '30px',
    padding: '10px 25px',
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  calendarCard: {
    marginTop: '10px',
    borderRadius: '10px',
  },
  activityCard: {
    marginTop: '20px',
    borderRadius: '10px',
  },
};

export default ProfileDashboard;
