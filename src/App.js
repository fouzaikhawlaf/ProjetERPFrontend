/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from 'react';
import { useState, useEffect, useMemo } from "react";
import { ChakraProvider } from '@chakra-ui/react';
// react-router components
import { Routes, Route, Navigate, useLocation, BrowserRouter as Router } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';


// @mui material components

import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from './components/SoftBox';


import logo from './assets/images/logo-ct.png';  // Correct the path to the image

// Soft UI Dashboard React examples
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";

// Soft UI Dashboard React themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";
import { ThemeProvider, createTheme } from '@mui/material/styles';
// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Soft UI Dashboard React routes
import routes from "./routes";


// Soft UI Dashboard React contexts
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "./context";

// Images
import brand from "./assets/images/logo-ct.png";

import Dashboard from "./layouts/dashboard";
import AddsSortie from "./layouts/Facture/components/addBonSortie";
import Sidebars from "./examples/Navbars/navbar";

import CommandeFournisseur from "./layouts/Achat/componants/commandeF";
import CreateBonDeReceptionDialog from "./layouts/Achat/componants/bonDeReception";
import PdfBonDeReception from "./layouts/Achat/componants/pdfBonDeReception";

import Transaction from "./layouts/billing/components/Transactions";
import ExpenseDialog from "./layouts/billing/components/PaymentMethod";
import EmployeeList from "./layouts/HRModule/components/listEmploye";




import AddSale from "./layouts/Sale/Data/addSale"
import i18n from './services/i18n'; // Adjust the path if necessary
import { useTranslation } from 'react-i18next';
import WorkflowDashboard from "./layouts/Workflow/data/index.js";
import CommercialDashboard from "./layouts/profile/components/CommercialDashboard";
import RhDashboard from "./layouts/profile/components/rh";
import EmployeeDashboard from "./layouts/profile/components/employer";
import CreateOrderForm from "./layouts/Sale/Data/CreateOrderForm";
import ClientOrders from "./layouts/Sale/Data/ClientOrders";
import ClientBonDeSortie from "./layouts/Sale/Data/ClientBonDeSortie";
import BankAccountDashboard from "./layouts/billing/components/BankAccountDashboard";
import AccountInformation from "./layouts/billing/components/AccountInformation";
import ClientFormSteps from "./layouts/tables/components/ClientFormSteps";

import SupplierFormSteps from "./layouts/Supplier/components/SupplierFormSteps";
import ProductFormSteps from "./layouts/Product/components/ProductFormSteps";
import VenteDashboard from "./layouts/Sale/Data/VenteDashboard";
import InvoiceTable from "./layouts/Sale/Data/InvoiceTable";
import PurchaseOrdersTable from "./layouts/Achat/componants/PurchaseOrdersTable";
import BonDeReceptionTable from "./layouts/Achat/componants/BonDeReceptionTable";
import SupplierInvoicesTable from "./layouts/Achat/componants/SupplierInvoicesTable";
import PurchaseOrdersPage from "./layouts/Achat/componants/PurchaseOrdersPage";
import BonDeReceptionPage from "./layouts/Achat/componants/BonDeReceptionPage";
import SupplierInvoicesPage from "./layouts/Achat/componants/SupplierInvoicesPage";
import MultiStepForm from "./layouts/tables/components/ClientSteps/main";
import ProductFormStepsPD from "./layouts/Product/components/ProductSteps/ProductFormSteps";
import SuccessPage from "./layouts/Product/components/ProductSteps/SuccessPage";
import SupplierFormStepsDb from "./layouts/Supplier/components/supplierSteps/SupplierFormSteps";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Assurez-vous que les styles sont inclus
import ProductListWrapper from './layouts/Product/components/ProductListWrapper'; // Your wrapper component
import SignInPage from "./layouts/authentication/sign-up";




export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { t } = useTranslation(); // Hook for accessing translations
 // const allRoutes = routes();  // Ceci doit être un tableau

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // Apply saved language at app initialization
    }
  }, []);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  return direction === "rtl" ? (
   
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="Soft UI Dashboard"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
         
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
   
        <Sidebars routes={routes} /> {/* Render the Sidebar component here */}
          <Routes>
            {getRoutes(routes)}
            <Route path="**" element={<Dashboard />} />
     
          </Routes>
     
      </ThemeProvider>
    </CacheProvider>
  
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brand}
            brandName="Soft UI Dashboard"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />

          {configsButton}
          <ToastContainer />
        </>
      )}
      {layout === "vr" && <Configurator />}
 
      <Sidebars routes={routes} />{/* Render the Sidebar component here */}
        <Routes>
          {getRoutes(routes)}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/AddsSortie" element={<AddsSortie />} />
        
          <Route path="/CommandeFournisseur" element={<CommandeFournisseur/>}/>
          <Route path="/BonDeReceptions" element={<CreateBonDeReceptionDialog/>}/>
          <Route path="/pdfVersionReception" element={<PdfBonDeReception/>}/>
         
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/Depense" element={<ExpenseDialog/>} />
          <Route path="/lisEmplyee" element={<EmployeeList />} />
       
   
       
          <Route path ="addSale" element= {<AddSale/>} />
          <Route path = "/workflow" element ={<WorkflowDashboard/>} />
          <Route path="/commercial" component={CommercialDashboard} />
          <Route path="/client-orders" element={<ClientOrders/>} />
        <Route path="/rh" component={RhDashboard} />
        <Route path="/employee" component={EmployeeDashboard} />
        <Route path="/create-order" element={<CreateOrderForm />}/>
        <Route path="/recptionTable" element={<ClientBonDeSortie />}/>
        <Route path ="/dashboardBank" element = { <BankAccountDashboard/>} />
        <Route path = "/accountinformation" element = { <AccountInformation/>} />
        <Route path="/client-form-steps" element={<ClientFormSteps/>} />
        <Route path="/supplier-form-steps" element={<SupplierFormSteps/>} />
        <Route path="/product-form-steps" element={<ProductFormSteps/>} />
        <Route path="/invoiceTable" element={<InvoiceTable/>} /> 
        <Route path="/invoiceTable" element={<PurchaseOrdersTable/>} /> 
        <Route path="/SupplierInvoicesTable" element={<SupplierInvoicesTable/>} />  
        <Route path="/BonDeReceptionTable" element={<BonDeReceptionTable/>} />  
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/bon-de-reception" element={<BonDeReceptionPage />} />
        <Route path="/supplier-invoices" element={<SupplierInvoicesPage />} />
        <Route path="/Client-step" element={< MultiStepForm/>}/>
        <Route path = "/Produit" element ={<ProductFormStepsPD/>}/>
        <Route path = "/SupplierForm" element ={<SupplierFormStepsDb/>}/>
        <Route path="/success" element={<SuccessPage/>} />
        <Route path="/products" element={<ProductListWrapper />} />
        <Route path="/signin" element={<SignInPage />} />
     </Routes>
    </ThemeProvider>
    
   
   );

}
