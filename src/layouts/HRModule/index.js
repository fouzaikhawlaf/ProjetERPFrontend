// src/HRModule.js
import React from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { FaUserTie, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
const RootContainer = styled(Container)({
  marginTop: 32,
  padding: 32,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: 32,
});

const bounce = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;

const AnimatedButton = styled(Button)({
  '&:hover': {
    animation: `${bounce} 0.5s alternate infinite`,
  },
});

const HRModule = () => {
    const navigate = useNavigate();

  const handleEmployeeManagement = () => {
    // Logique pour gérer la gestion des employés
    console.log('Gestion des employés');
  };

  const handleRecruitment = () => {
    // Logique pour gérer le recrutement
    console.log('Recrutement');
  };

  const handleAbsenceManagement = () => {
    // Logique pour gérer les absences
    console.log('Gestion des absences');
  };

  return (
    <DashboardLayout>
    <DashboardNavbar/>
    <RootContainer maxWidth="md">
      <Paper style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>
          Module des Ressources Humaines
        </Typography>
        <ButtonContainer>
          <AnimatedButton variant="contained" style={{ backgroundColor: '#1976d2', color: '#fff' }} onClick={() => navigate('/lisEmplyee')} startIcon={<FaUserTie />}>
            Gestion des Employés
          </AnimatedButton>
          <AnimatedButton variant="contained" style={{ backgroundColor: '#dc004e', color: '#fff' }} onClick={handleRecruitment} startIcon={<FaBriefcase />}>
            Recrutement
          </AnimatedButton>
          <AnimatedButton variant="contained" style={{ backgroundColor: '#9e9e9e', color: '#fff' }} onClick={handleAbsenceManagement} startIcon={<FaCalendarAlt />}>
            Gestion des Absences
          </AnimatedButton>
        </ButtonContainer>
      </Paper>
    </RootContainer>
    </DashboardLayout>
  );
};

export default HRModule;



