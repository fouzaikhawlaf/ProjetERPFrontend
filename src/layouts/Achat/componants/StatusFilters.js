// src/layouts/Sale/Data/StatusFilters.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Button, TextField, Box } from '@mui/material'; // Use Material-UI components
import styled from 'styled-components';

// Styled components
const StatusFiltersContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ButtonGroup = styled(Box)`
  display: flex;
  align-items: center;
`;

const FilterButton = styled(Button)`
  margin-right: 10px;
  background-color: ${({ active }) => (active ? '#3f51b5' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  &:last-child {
    margin-right: 0;
  }
`;

const SearchBarContainer = styled(Box)`
  flex-grow: 1;
  margin-left: 20px;
`;

const StatusFilters = ({ activeFilter, handleFilterClick, handleCreateClick, showAddForm }) => {
  return (
    <StatusFiltersContainer>
      <ButtonGroup>
        <FilterButton
          variant="contained"
          active={activeFilter === 'Tous'}
          onClick={() => handleFilterClick('Tous')}
        >
          Tous (0)
        </FilterButton>
        <FilterButton
          variant="contained"
          active={activeFilter === 'Brouillon'}
          onClick={() => handleFilterClick('Brouillon')}
        >
          Brouillon (0)
        </FilterButton>
        {!showAddForm && (
          <FilterButton
            variant="contained"
            active={activeFilter === 'Créé'}
            onClick={handleCreateClick}
          >
            Créé (0)
          </FilterButton>
        )}
        <FilterButton
          variant="contained"
          active={activeFilter === 'Annulé'}
          onClick={() => handleFilterClick('Annulé')}
        >
          Annulé
        </FilterButton>
        <FilterButton
          variant="contained"
          active={activeFilter === 'Fermé'}
          onClick={() => handleFilterClick('Fermé')}
        >
          Fermé
        </FilterButton>

        {/* Add Button */}
        <Button variant="contained" color="primary" onClick={handleCreateClick}>
          + Add
        </Button>
      </ButtonGroup>
      <SearchBarContainer>
        <TextField
          placeholder="Recherche par mot clé"
          variant="outlined"
          size="small"
          fullWidth
        />
      </SearchBarContainer>
    </StatusFiltersContainer>
  );
};

// PropTypes validation
StatusFilters.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  handleFilterClick: PropTypes.func.isRequired,
  handleCreateClick: PropTypes.func.isRequired,
  showAddForm: PropTypes.bool.isRequired,
};

export default StatusFilters;
