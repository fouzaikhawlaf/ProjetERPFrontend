import React from 'react';
import { Container, Typography, Tabs, Tab, Box, Card, CardContent,Grid, List, ListItem, ListItemIcon, ListItemText, Avatar, Switch, FormControlLabel, Select, MenuItem, Button  ,TextField, Divider  } from '@mui/material';
import { styled } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCog, faCheckCircle, faTimesCircle , faUserCircle, faDollarSign} from '@fortawesome/free-solid-svg-icons';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

import PropTypes from 'prop-types';
const StyledCard = styled(Card)({
  marginBottom: '20px',
  backgroundColor: '#ffffff',
});

const transactions = [
  { date: '10th Sep', description: 'Grocery', amount: '$200', category: 'Shopping', status: 'Completed' },
  { date: '8th Sep', description: 'Utilities', amount: '$150', category: 'Bills', status: 'Pending' },
  { date: '5th Sep', description: 'Coffee', amount: '$50', category: 'Food', status: 'Completed' },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AccountInformation = () => {
  const [tabValue, setTabValue] = React.useState(0);
  
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [language, setLanguage] = React.useState('en');

  const [accountHolder, setAccountHolder] = React.useState("John Doe");
  const [accountNumber, setAccountNumber] = React.useState("123456789");
  const [balance, setBalance] = React.useState("$5,000");
  const [accountType, setAccountType] = React.useState("Savings Account");
  const [branch, setBranch] = React.useState("Downtown Branch");
  const [openedOn, setOpenedOn] = React.useState("January 15, 2020");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };


  const handleUpdate = () => {
    // Handle the update logic here
    alert("Account information updated!");
  };

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <Container style={{ marginTop: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#1976d2' }}>
        Account Information
      </Typography>
      
      <StyledCard>
        <Tabs value={tabValue} onChange={handleChange} aria-label="account tabs">
          <Tab label="Account Details" />
          <Tab label="Recent Transactions" />
          <Tab label="Settings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                <FontAwesomeIcon icon={faUserCircle} size="lg" />
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Account Holder"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Account Type"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Opened On"
                value={openedOn}
                onChange={(e) => setOpenedOn(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>
          <Divider style={{ margin: '20px 0' }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="primary" startIcon={<FontAwesomeIcon icon={faDownload} />} fullWidth>
                Download Statement
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" color="secondary" startIcon={<FontAwesomeIcon icon={faCog} />} fullWidth>
                Manage Account
              </Button>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            style={{ marginTop: '20px' }}
          >
            Update Information
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {transactions.map((transaction, index) => (
              <ListItem key={index} style={{ padding: '10px 0' }}>
                <ListItemIcon>
                  <Avatar>
                    {transaction.status === 'Completed' ? (
                      <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#4caf50' }} />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#f44336' }} />
                    )}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={`${transaction.description} - ${transaction.amount}`}
                  secondary={`Date: ${transaction.date} | Category: ${transaction.category} | Status: ${transaction.status}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6">Settings</Typography>
          <Typography variant="body2" gutterBottom>Manage your account preferences and settings below.</Typography>
          <FormControlLabel
            control={<Switch checked={notificationsEnabled} onChange={handleNotificationToggle} />}
            label="Enable Notifications"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Preferred Language</Typography>
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ minWidth: 120 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
            </Select>
          </Box>
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Save Changes
          </Button>
        </TabPanel>
      </StyledCard>
    </Container>
     </DashboardLayout>
  );
};
// Define prop types
TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };
export default AccountInformation;
