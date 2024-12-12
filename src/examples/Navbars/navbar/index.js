
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import PropTypes from 'prop-types'; 

// ... other imports ...

function Sidebars({ routes }) {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuClick = (menuKey) => {
    setSelectedMenu(selectedMenu === menuKey ? null : menuKey);
  };

  const renderSubMenu = (subItems) => {
    return (
      <Collapse in={selectedMenu === subItems.key} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems.collapse.map((subItem) => (
            <ListItem key={subItem.key} disablePadding>
              <ListItemButton component={Link} to={subItem.route}> 
                <ListItemText primary={subItem.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    );
  };

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer}>
      <List>
        {routes.map((item) => {
          if (item.type === 'collapse') {
            return (
              <div key={item.key}>
                <ListItemButton onClick={() => handleMenuClick(item.key)}>
                  <ListItemText primary={item.name} />
                  {selectedMenu === item.key ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {item.collapse && renderSubMenu(item)}
              </div>
            );
          } else if (item.type === 'title') {
            return (
              <ListItem key={item.key}>
                <ListItemText primary={item.title} />
              </ListItem>
            );
          }
          return null;
        })}
      </List>
    </Drawer>
  );

}



Sidebars.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      route: PropTypes.string,
      // ... other properties of your route objects as needed ...
    })
  ).isRequired, // Make .isRequired if routes is always needed
  // ... propTypes for other props of your Navbar ...
};
export default Sidebars;
