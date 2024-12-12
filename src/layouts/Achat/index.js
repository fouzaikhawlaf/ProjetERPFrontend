import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Link } from 'react-router-dom';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CommandeFournisseur from './componants/commandeF';


const Achats = () => {
  const [achats, setAchats] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [nouveauAchat, setNouveauAchat] = useState({
    fournisseur: '',
    date: new Date(),
    articles: [],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data (replace with your API calls)
  useEffect(() => {
    const fetchData = async () => {
      // ... fetch achats, fournisseurs, and produits data
    };
    fetchData();
  }, []);

  // Input Change Handlers
  const handleInputChange = (event, field) => {
    setNouveauAchat({
      ...nouveauAchat,
      [field]: event.target.value,
    });
  };

  const handleArticleChange = (index, field, value) => {
    setNouveauAchat((prevAchat) => ({
      ...prevAchat,
      articles: prevAchat.articles.map((article, i) =>
        i === index ? { ...article, [field]: value } : article
      ),
    }));
  };

  // Add/Remove Article Functions
  const handleAddArticle = () => {
    setNouveauAchat((prevAchat) => ({
      ...prevAchat,
      articles: [...prevAchat.articles, { produit: '', quantite: 1 }],
    }));
  };

  const handleRemoveArticle = (index) => {
    setNouveauAchat((prevAchat) => ({
      ...prevAchat,
      articles: prevAchat.articles.filter((_, i) => i !== index),
    }));
  };

  // Submit Function
  const handleSubmit = async () => {
    // Send nouveauAchat to your backend API
    // ...
    setOpenDialog(false);
    // Reset form after submission
    setNouveauAchat({ fournisseur: '', date: new Date(), articles: [] });
  };

  // Search Functionality
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAchats = achats.filter((achat) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      achat.fournisseur.toLowerCase().includes(searchTermLower) ||
      achat.articles.some((article) =>
        article.produit.toLowerCase().includes(searchTermLower)
      )
    );
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <SoftBox py={3}>
        <SoftBox mb={3}>
        <Grid container spacing={3}>
       
          
           
          
            </Grid>
          <Card>
        
        
      <SoftBox display="flex" alignItems="center" justifyContent="center" py={2}>
   
      </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <CommandeFournisseur />
            </SoftBox>
          </Card>
        </SoftBox>
        <Card>
         
      
        </Card>
      </SoftBox>
     
    </DashboardLayout>

  );
};

export default Achats;