import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import AddUserForm from './AddUserForm';
import AssignRoleForm from './AssignRoleForm';
import UserList from './UserList';
import RolePermissions from './RolePermissions';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';


const RolesDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', roles: ['Admin'] },
    { id: 2, name: 'Jane Smith', roles: ['Manager'] },
    // More users...
  ]);

  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Administrator role' },
    { id: 2, name: 'Manager', description: 'Manager role' },
    // More roles...
  ]);

  const [userSearch, setUserSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');

  // Fonction pour ajouter un utilisateur
  const addUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  // Fonction pour assigner un rôle à un utilisateur existant
  const assignRole = (userId, roleName) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, roles: [...user.roles, roleName] } : user
      )
    );
  };

  // Filtrer les utilisateurs et rôles basés sur les recherches
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(roleSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Container>
        <h2 className="mt-4">Roles Management Dashboard</h2>
        <Row>
          <Col md={4}>
            <Card className="p-3">
              <h5>Add New User</h5>
              {/* Passer la fonction addUser au AddUserForm */}
              <AddUserForm addUser={addUser} />
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3">
              <h5>Assign Role to User</h5>
              <Form.Control
                type="text"
                placeholder="Search Users..."
                className="mb-2"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <AssignRoleForm users={filteredUsers} roles={filteredRoles} assignRole={assignRole} />
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3">
              <h5>Role Permissions</h5>
              <Form.Control
                type="text"
                placeholder="Search Roles..."
                className="mb-2"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
              />
              <RolePermissions roles={filteredRoles} />
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <UserList users={filteredUsers} />
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default RolesDashboard;
