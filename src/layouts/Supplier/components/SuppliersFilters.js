import React , { useState } from "react";
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';
import StatusFilters from "layouts/tables/components/SatutFilter";

export function SuppliersFilters(){
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [showAddForm, setShowAddForm] = useState(false);


  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    console.log(`Filter clicked: ${filter}`);
  };
  
  const handleCreateClick = () => {
    setShowAddForm(true);
    console.log("Create button clicked");
  };
  return (
    <Card sx={{ p: 2 }}>
    <StatusFilters
    activeFilter={activeFilter}
    handleFilterClick={handleFilterClick}
    handleCreateClick={handleCreateClick}
    showAddForm={showAddForm}
  />
    </Card>
  );
  }
