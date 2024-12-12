// G:\reactErp\soft-ui-dashboard-react-main\src\layouts\roles\componnents\AssignRoleForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AssignRoleForm = ({ users, roles, onAssignRole }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleAssign = () => {
    if (selectedUser && selectedRole) {
      onAssignRole(selectedUser, selectedRole);
      setSelectedUser('');
      setSelectedRole('');
    }
  };

  return (
    <div>
      <h3>Assign Role</h3>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="" disabled>Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
        <option value="" disabled>Select Role</option>
        {roles.map(role => (
          <option key={role.id} value={role.id}>{role.name}</option>
        ))}
      </select>
      <button onClick={handleAssign}>Assign Role</button>
    </div>
  );
};

AssignRoleForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onAssignRole: PropTypes.func.isRequired,
};

export default AssignRoleForm;
