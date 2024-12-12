import React from 'react';
import { Box, Text, Flex, Button, VStack, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import AddUserModal from './AddUserModal';
import AddRoleModal from './AddRoleModal';

const Dashboard = () => {
  return (
    <Box>
      <Text fontSize="2xl" mb="4">Admin Dashboard</Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
        
        {/* Admin Information Card */}
        <Box p="6" bg="gray.100" borderRadius="lg" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold">Admin Information</Text>
          <Text mt="2">Name: John Doe</Text>
          <Text>Email: admin@example.com</Text>
          <Text>Role: Super Admin</Text>
        </Box>
        
        <Box p="6" bg="gray.100" borderRadius="lg" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold">User Management</Text>
          <Text mt="2">Total Users: 50</Text>
          <AddUserModal />  {/* Add User Modal */}
        </Box>
        
        {/* Manage User Roles Card */}
        <Box p="6" bg="gray.100" borderRadius="lg" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold">Manage User Roles</Text>
          <AddRoleModal />  {/* Add Role Modal */}
        </Box>
        
        {/* ERP Statistics Card */}
        <Box p="6" bg="gray.100" borderRadius="lg" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold">ERP Module Statistics</Text>
          <SimpleGrid columns={2} spacing="4" mt="4">
            <Stat>
              <StatLabel>Sales</StatLabel>
              <StatNumber>120</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Purchases</StatLabel>
              <StatNumber>80</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Inventory</StatLabel>
              <StatNumber>300</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Employees</StatLabel>
              <StatNumber>50</StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>

        {/* Add Role to User Card */}
        <Box p="6" bg="gray.100" borderRadius="lg" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold">Manage User Roles</Text>
          <Text mt="2">Assign roles to users</Text>
          <Button colorScheme="blue" mt="4">Add Role</Button>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
