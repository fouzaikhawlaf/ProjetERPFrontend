import React from "react";
import PropTypes from "prop-types";
import { Button, TextField, Box, Tooltip, Typography } from "@mui/material";
import styled from "styled-components";
import { FilterList, AddCircle, Cancel, Done, Drafts, Folder } from "@mui/icons-material";

// Styled components
const StatusFiltersContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ButtonGroup = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterButton = styled(Button)`
  background-color: ${({ active }) => (active ? "#3f51b5" : "#e0e0e0")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ active }) =>
      active ? "#303f9f" : "#d0d0d0"} !important;
  }
`;

const SearchBarContainer = styled(Box)`
  flex-grow: 1;
  margin-left: 20px;
`;

const StatusFilters = ({
  activeFilter,
  handleFilterClick,
  handleCreateClick,
  showAddForm,
}) => {
  return (
    <StatusFiltersContainer>
      <ButtonGroup>
        {/* Filter Buttons with Icons */}
        <Tooltip title="Show All" arrow>
          <FilterButton
            variant="contained"
            active={activeFilter === "Tous"}
            onClick={() => handleFilterClick("Tous")}
            startIcon={<Folder />}
          >
            Tous (0)
          </FilterButton>
        </Tooltip>

        <Tooltip title="Drafts" arrow>
          <FilterButton
            variant="contained"
            active={activeFilter === "Brouillon"}
            onClick={() => handleFilterClick("Brouillon")}
            startIcon={<Drafts />}
          >
            Brouillon (0)
          </FilterButton>
        </Tooltip>

        {!showAddForm && (
          <Tooltip title="Create New" arrow>
            <FilterButton
              variant="contained"
              active={activeFilter === "Créé"}
              onClick={handleCreateClick}
              startIcon={<AddCircle />}
            >
              Créé (0)
            </FilterButton>
          </Tooltip>
        )}

        <Tooltip title="Canceled" arrow>
          <FilterButton
            variant="contained"
            active={activeFilter === "Annulé"}
            onClick={() => handleFilterClick("Annulé")}
            startIcon={<Cancel />}
          >
            Annulé
          </FilterButton>
        </Tooltip>

        <Tooltip title="Closed" arrow>
          <FilterButton
            variant="contained"
            active={activeFilter === "Fermé"}
            onClick={() => handleFilterClick("Fermé")}
            startIcon={<Done />}
          >
            Fermé
          </FilterButton>
        </Tooltip>
      </ButtonGroup>

      {/* Search Bar */}
      <SearchBarContainer>
        <TextField
          placeholder="Search by keyword"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: <FilterList style={{ marginRight: 8 }} />,
          }}
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