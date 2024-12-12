import React from 'react';
import PropTypes from 'prop-types'; // Importer PropTypes
import { Switch } from '@mui/material'; // Importer Switch

const Header = ({ title, darkMode, setDarkMode }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>{title}</h2>
      <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} /> Dark Mode
    </div>
  );
};

// Ajouter la validation des props
Header.propTypes = {
  title: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};

export default Header;
