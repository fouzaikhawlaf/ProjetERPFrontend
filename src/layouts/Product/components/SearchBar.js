// src/components/SearchBar.js
import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, CircularProgress } from '@mui/material';
import { Search, Clear as ClearIcon } from '@mui/icons-material';

const SearchBar = ({ searchQuery, onSearchChange, onClearSearch, searchLoading }) => (
  <Box sx={{ 
    position: 'relative', 
    mb: 3,
    backgroundColor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1,
    p: 1.5
  }}>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Rechercher par nom, référence, prix, catégorie..."
      style={{
        width: '100%',
        padding: '12px 20px 12px 40px',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border 0.3s',
        '&:focus': {
          borderColor: '#1976d2',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
        }
      }}
    />
    <Search sx={{
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9e9e9e'
    }} />
    {searchLoading && (
      <CircularProgress 
        size={20} 
        sx={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)'
        }} 
      />
    )}
    {searchQuery && !searchLoading && (
      <IconButton
        onClick={onClearSearch}
        sx={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
);

// Validation des props
SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool
};

// Valeur par défaut pour la prop optionnelle
SearchBar.defaultProps = {
  searchLoading: false
};

export default SearchBar;