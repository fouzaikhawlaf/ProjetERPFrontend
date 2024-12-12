// src/components/Profile.js
import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software Developer at XYZ',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log('Profile updated:', profile);
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Bio:</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;


