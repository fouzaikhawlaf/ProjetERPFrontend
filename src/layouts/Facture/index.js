import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples


import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import React, { useState } from 'react';
import { Button, Grid } from "@mui/material";
import PageHeaderFacture from "./components/pageHeader";
import ListDeliveryOrder from "./components/bonSortie";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

// Data




function Facture() {
  
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <DashboardLayout>
    
      <PageHeaderFacture/>
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
              <ListDeliveryOrder />
            </SoftBox>
          </Card>
        </SoftBox>
        <Card>
         
      
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Facture;