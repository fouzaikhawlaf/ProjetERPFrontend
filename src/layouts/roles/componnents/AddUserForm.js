import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUserForm = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [profile, setProfile] = useState(null);

  // Rôles statiques pour tester le formulaire sans backend
  const roles = [
    { id: '1', name: 'Admin' },
    { id: '2', name: 'User' },
    { id: '3', name: 'Manager' },
  ];

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (name && email && username && password && roleId) {
      // Simulation de l'ajout d'utilisateur sans backend
      const newUser = {
        name,
        email,
        username,
        role: roles.find((role) => role.id === roleId),
      };

      console.log('New User Added:', newUser);
      setProfile(newUser);
      setUserExists(true);
      setError('');
    } else {
      setError('Please fill in all fields.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setRoleId('');
    setUserExists(false);
    setProfile(null);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
        Add New User
      </button>

      <dialog open={showDialog} className="p-4 border rounded bg-light shadow-sm" onClose={() => setShowDialog(false)}>
        <h2 className="text-center mb-4">Add New User</h2>
        <button className="btn-close" onClick={() => setShowDialog(false)}></button>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger text-center">{error}</p>}
          {!userExists ? (
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-control" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter user name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter user email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  className="form-control" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter username"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter password"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Assign Role</label>
                <select 
                  id="role" 
                  className="form-select" 
                  value={roleId} 
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value="" disabled>Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">Add User</button>
            </>
          ) : (
            <div className="profile-info">
              <h3 className="text-center">Profile Information</h3>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Role:</strong> {profile.role ? profile.role.name : 'No role assigned'}</p>
              <button type="button" className="btn btn-secondary w-100 mt-3" onClick={resetForm}>Reset</button>
            </div>
          )}
        </form>
      </dialog>
    </>
  );
};

export default AddUserForm;
