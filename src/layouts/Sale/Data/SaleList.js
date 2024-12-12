import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  Button,
  TextField,
  IconButton,
  Grid,
  Checkbox,
  CircularProgress,
  Typography
} from '@mui/material';
import { getSales, updateSale, deleteSale, archiveSale, searchSales } from '../../../services/SaleApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';

const RootDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StatusFilters = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

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
  '& table': {
    tableLayout: 'fixed',
    width: '100%',
  },
  '& th, & td': {
    padding: '9px 15px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  '& th': {
    backgroundColor: '#f4f6f8',
    fontWeight: 'bold',
  },
  '& tr:nth-of-type(even)': {
    backgroundColor: '#f9f9f9',
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  minWidth: 150,
}));

function SaleList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Actif');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSales, setSelectedSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      try {
        const data = await searchSales(query);
        setSales(data);
      } catch (error) {
        console.error('Error searching sales:', error);
        setError(error);
      }
    } else {
      fetchSales();
    }
  };

  const handleUpdateSale = async (saleId, updatedData) => {
    try {
      await updateSale(saleId, updatedData);
      fetchSales();
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };

  const handleDeleteSale = async (saleId) => {
    try {
      await deleteSale(saleId);
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const updateSelectedSale = {
    ...selectedSales,
    isArchived: true,
  };

  const handleArchiveSale = async (saleId) => {
    try {
      await updateSale(saleId, updateSelectedSale);
      fetchSales();
    } catch (error) {
      console.error('Error archiving sale:', error);
    }
  };

  const handleSelectSale = (saleId) => {
    setSelectedSales((prevSelected) =>
      prevSelected.includes(saleId)
        ? prevSelected.filter((id) => id !== saleId)
        : [...prevSelected, saleId]
    );
  };

  const isSelected = (saleId) => selectedSales.includes(saleId);

  const filteredSales = sales.filter(sale => {
    if (activeFilter === 'Actif' && !sale.isArchived) {
      return true;
    }
    if (activeFilter === 'Archivé' && sale.isArchived) {
      return true;
    }
    return false;
  });

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <RootDiv>
      <CssBaseline />
      <Container maxWidth="lg">
        <StatusFilters>
          <FilterButton
            variant="contained"
            active={activeFilter === 'Actif'}
            onClick={() => handleFilterClick('Actif')}
          >
            Actif ({sales.filter(sale => !sale.isArchived).length})
          </FilterButton>
          <FilterButton
            variant="contained"
            active={activeFilter === 'Archivé'}
            onClick={() => handleFilterClick('Archivé')}
          >
            Archivé ({sales.filter(sale => sale.isArchived).length})
          </FilterButton>
          <SearchBarContainer>
            <SearchBarInput
              placeholder="Recherche par mot clé"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchBarContainer>
        </StatusFilters>

        <TableWrapper component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedSales.length > 0 && selectedSales.length < sales.length}
                    checked={sales.length > 0 && selectedSales.length === sales.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSales(sales.map((sale) => sale.id));
                      } else {
                        setSelectedSales([]);
                      }
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>Nom du Client</StyledTableCell>
                <StyledTableCell>Nom du Produit</StyledTableCell>
                <StyledTableCell>Date de Vente</StyledTableCell>
                <StyledTableCell>Montant</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow
                  key={sale.id}
                  selected={isSelected(sale.id)}
                  onClick={() => handleSelectSale(sale.id)}
                >
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(sale.id)}
                      onChange={() => handleSelectSale(sale.id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{sale.clientName}</StyledTableCell>
                  <StyledTableCell>{sale.productName}</StyledTableCell>
                  <StyledTableCell>{sale.saleDate}</StyledTableCell>
                  <StyledTableCell>{sale.amount}</StyledTableCell>
                  <StyledTableCell>
                    <Grid container spacing={1}>
                      <Grid item>
                        <IconButton onClick={() => handleUpdateSale(sale.id, sale)}>
                          <EditIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => handleDeleteSale(sale.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => handleArchiveSale(sale.id)}>
                          <ArchiveIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </Container>
    </RootDiv>
  );
}

SaleList.propTypes = {
  sales: PropTypes.array,
  activeFilter: PropTypes.string,
  searchQuery: PropTypes.string,
  fetchSales: PropTypes.func,
  handleFilterClick: PropTypes.func,
  handleSearchChange: PropTypes.func,
  handleUpdateSale: PropTypes.func,
  handleDeleteSale: PropTypes.func,
  handleArchiveSale: PropTypes.func,
};

export default SaleList;
