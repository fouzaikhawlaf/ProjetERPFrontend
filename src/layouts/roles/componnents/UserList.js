// G:\reactErp\soft-ui-dashboard-react-main\src\layouts\roles\componnents\UserList.js

import React from 'react';
import PropTypes from 'prop-types';

const UserList = ({ users }) => {
  return (
    <div>
      <h3>User List</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - Role: {user.role ? user.role.name : 'No role assigned'}
          </li>
        ))}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  })).isRequired,
};

export default UserList;
