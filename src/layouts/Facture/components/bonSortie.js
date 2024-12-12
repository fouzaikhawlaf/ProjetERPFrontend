import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddsSortie from './addBonSortie';
const RootDiv = styled('div')(({ theme }) => ({
    padding: theme.spacing(3),
  }));
  
  const HeaderSection = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  }));
  
  const StatusFilters = styled('div')({
    display: 'flex',
  });
  
  const FilterButton = styled(Button)(({ theme, active }) => ({
    marginRight: theme.spacing(2),
    backgroundColor: active ? '#007bff' : '#f0f0f0',
    color: active ? 'white' : 'inherit',
    '&:hover': {
      backgroundColor: active ? '#0056b3' : '#e0e0e0',
    },
  }));
  
  
  const SearchBarContainer = styled('div')(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[400]}`, // Light grey border
    borderRadius: '20px', // Rounded corners
    padding: theme.spacing(0.5, 1), // Padding for better visual appeal
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    width: '300px',
  }));
  
  const SearchBarInput = styled(TextField)({
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Remove default outline
    },
    '& .MuiInputBase-input': {
      padding: '8px', // Adjust padding as needed
    },
  });
  const TableWrapper = styled(TableContainer)({
    overflowX: 'auto',
  });
  
 

const rows = [
  // ... Vos données de bons de sortie
];

function ListDeliveryOrder() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedMonth, setSelectedMonth] = useState('Mai 2024');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState(null);  // State for the selected date
  const [showAddForm, setShowAddForm] = useState(false);

 
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };


  const handleCreateClick = () => {
    setShowAddForm(true);
  };


  return (
    <RootDiv>
      <CssBaseline />
      <Container maxWidth="lg">
        <div>
          <Typography variant="h4" gutterBottom>
           
          </Typography>
          <Typography variant="body2" color="textSecondary">
           
          </Typography>
        </div>

        <div>
          <StatusFilters>
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
            <div>
      {!showAddForm && (
        <FilterButton
          variant="contained"
          active={activeFilter === 'Créé'}
          onClick={handleCreateClick} // No need to pass 'Créé' here
        >
          Créé (0)
        </FilterButton>
      )}
      {showAddForm && <AddsSortie/>}
    </div>
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
            <SearchBarContainer>
              <SearchBarInput
                placeholder="Recherche par mot clé"
                variant="outlined"
                size="small"
              />
            </SearchBarContainer>
          </StatusFilters>
        </div>
        <Grid item xs={12} md={3} style={{ display: 'flex', justifyContent: 'flex-end' }}> 
        <div> 
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
             
              inputFormat="MM/DD/YYYY"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
       </Grid>
        <TableWrapper component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>RÉFÉRENCE</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>CLIENT</TableCell>
                <TableCell>MONTANT TTC</TableCell>
                <TableCell>STATUT</TableCell>
                <TableCell>ACTIONS</TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
             
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Il ny a pas de données à afficher
                  </TableCell>
                </TableRow>
             
            </TableBody>
          </Table>
        </TableWrapper>
      </Container>
    </RootDiv>
  );
};
export default ListDeliveryOrder;