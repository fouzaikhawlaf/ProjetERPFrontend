// src/components/SearchBar.js
import React from 'react';
import PropTypes from 'prop-types'; // Ajout de l'import PropTypes
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Clear } from '@mui/icons-material';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  searchLoading,
  placeholder = "Rechercher clients..."
}) => {
  return (
    <Box sx={{ 
      p: 2, 
      mb: 3, 
      bgcolor: 'background.paper', 
      borderRadius: 1,
      boxShadow: 1,
      position: 'relative'
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={onClearSearch} size="small">
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {searchLoading && (
        <CircularProgress 
          size={24} 
          sx={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)'
          }} 
        />
      )}
    </Box>
  );
};

// Ajout de la validation des props
SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool.isRequired,
  placeholder: PropTypes.string
};

// Valeurs par défaut pour les props optionnelles
SearchBar.defaultProps = {
  placeholder: "Rechercher clients..."
};

export default SearchBar;