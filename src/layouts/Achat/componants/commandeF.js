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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';





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
  border: `1px solid ${theme.palette.grey[400]}`,
  borderRadius: '20px',
  padding: theme.spacing(0.5, 1),
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  width: '300px',
}));

const SearchBarInput = styled(TextField)({
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none', 
  },
  '& .MuiInputBase-input': {
    padding: '8px', 
  },
});

const TableWrapper = styled(TableContainer)({
  overflowX: 'auto',
});

const CommandeFournisseur = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonths, setShowMonths] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [openYearPicker, setOpenYearPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const toggleMonths = () => {
    setShowMonths(!showMonths);
  };

  const handleYearChange = (newValue) => {
    setSelectedYear(newValue);
  };

  const handleOpenYearPicker = () => {
    setOpenYearPicker(true);
  };

  const handleCloseYearPicker = () => {
    setOpenYearPicker(false);
  };

  const handleCreateClick = () => {
    setShowAddForm(true);
  };

  return (
    <DashboardLayout>
   
    
      <Grid>
    <RootDiv>
      <CssBaseline />
      <Container maxWidth="lg">
        <div>
        
          {/* ... (You can add more descriptive text here) ... */}
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
           
          

        {/* Year and Date Selection */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs={12} md={9}>
            <Button
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              onClick={handleOpenYearPicker}
            >
              {selectedYear}
            </Button>

            {/* Year Picker Dialog */}
            <Dialog open={openYearPicker} onClose={handleCloseYearPicker}>
              <DialogTitle>Select Year</DialogTitle>
              <DialogContent>
                {/* Implement year selection logic here */}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseYearPicker}>Cancel</Button>
                <Button onClick={handleCloseYearPicker} autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>

          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                inputFormat="MM/DD/YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* ... (Your Months Section) ... */}

        <TableWrapper component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>RÉFÉRENCE</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>FOURNISSEUR</TableCell> 
                <TableCell>MONTANT TTC</TableCell>
                <TableCell>STATUT</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* ... (Replace with your data fetching and rendering logic) ... */}
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Il y a pas de données à afficher
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableWrapper>
      </Container>
    </RootDiv>
    </Grid>
    </DashboardLayout>
  );
};

export default CommandeFournisseur;
