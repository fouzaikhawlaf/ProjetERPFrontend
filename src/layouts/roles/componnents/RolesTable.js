import React from 'react';
import { Table, Button } from 'react-bootstrap';

const RolesTable = ({ roles }) => {
  return (
    <div>
      <h5>Roles List</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Role Name</th>
            <th>Users</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id}>
              <td>{index + 1}</td>
              <td>{role.roleName}</td>
              <td>{role.users.join(', ')}</td>
              <td>
                <Button variant="danger" onClick={() => alert('Delete Role functionality here')}>
                  Delete Role
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RolesTable;
