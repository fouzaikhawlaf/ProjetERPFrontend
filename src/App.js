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
import CreateOrderForm from "./layouts/Sale/Data/forms/OrderForm";
import ClientOrders from "./layouts/Sale/Data/ClientOrders";
import ClientBonDeSortie from "./layouts/Sale/Data/ClientBonDeSortie";
import BankAccountDashboard from "./layouts/billing/components/BankAccountDashboard";
import AccountInformation from "./layouts/billing/components/AccountInformation";
import ClientFormSteps from "./layouts/tables/components/ClientFormSteps";

import SupplierFormSteps from "./layouts/Supplier/components/SupplierFormSteps";
import ProductFormSteps from "./layouts/Product/components/ProductFormSteps";
import VenteDashboard from "./layouts/Sale/Data/VenteDashboard";
import InvoiceTable from "./layouts/Sale/Data/Tables/InvoiceTable";
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
import SignIn from "./layouts/authentication/sign-in";
import OrdersTable from 'layouts/Sale/Data/Tables/OrdersTable';
import DevisTable from 'layouts/Sale/Data/Tables/DevisTable';
import DeliveriesTable from 'layouts/Sale/Data/Tables/DeliveriesTable';
import DashboardCards from 'layouts/profile/data/adminDashboard/DashboardCards';
import RoleManagement from 'layouts/profile/data/adminDashboard/RoleManagement ';
import UserManagement from 'layouts/profile/data/adminDashboard/UserManagement';
import ProjectDashboard from 'layouts/Projects/components/ProjectDashboard';
import CreateProject from './layouts/Projects/components/CreateProject';
import ProjectList from './layouts/Projects/components/ProjectList';
import TaskList from 'layouts/Projects/TaskProject/TaskList';
import TaskCreate from 'layouts/Projects/TaskProject/TaskCreate';
import EditTask from 'layouts/Projects/TaskProject/EditTask';

import DevisForm from 'layouts/Sale/Data/forms/devisForm';

import CreerDevisAchat from 'layouts/Achat/CreerBonCommande';
import DevisModule from 'layouts/Achat/componants/DevisModule';
import CreerDevisPurchase from 'layouts/Achat/componants/DevisService';
import { SuppliersTable } from 'layouts/Supplier/components/SuppliersTable';
import PageSupplier from './layouts/Supplier/components';
import DevisServiceTable from 'layouts/Achat/componants/Tables/DevisPuchase';
import Page from 'layouts/tables/components';
import ProjectModule from 'layouts/Projects/components/ProjectModule';
import ModuleRH from 'layouts/HRModule/components/ModuleRH';
import ProfileInterface from 'layouts/profile/UserProfile/ProfileInterface';
import CreerDevisProduit from 'layouts/Achat/componants/DevisProduit/CreerDevisProduit';
import DevisProduitTable from 'layouts/Achat/componants/Tables/DevisProduitTable';
import CommandeModule from 'layouts/Achat/componants/OrderSupplier/CommandeModule';
import CreateCommandeSupplier from 'layouts/Achat/componants/OrderSupplier/CreateOrderSupplierService';



export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();  // Get the current pathname
  const { t } = useTranslation(); // Hook for translations

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // Apply saved language
    }
  }, []);

  // Cache for RTL
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enters mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leaves mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Handle the configuration settings open/close
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Set the direction of the page for RTL or LTR
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Scroll to top when the route changes
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
        return <Route path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  // Check if the current path is signin or sign-in
  const showSidebar = !(pathname === "/signin" || pathname === "/authentication/sign-in");

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && showSidebar && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={logo}
              brandName="Soft UI Dashboard"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {/* Your configsButton logic here */}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Sidebars routes={routes} />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && showSidebar && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={logo}
            brandName="Soft UI Dashboard"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {/* Your configsButton logic here */}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Sidebars routes={routes} />
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Dashboard />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/authentication/sign-in" element={<SignIn />} />
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
        <Route path="/orders" element={<OrdersTable />} />
        <Route path="/devis" element={<DevisTable />} />
        <Route path="/deliveries" element={<DeliveriesTable />} />
        <Route path="/factures" element={<InvoiceTable />} />
        <Route path="/admin-card" element={<DashboardCards />} />
        <Route path="/role-management" element={<RoleManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/ProjectManagment" element={<ProjectDashboard />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/ventes/nouveau" element={<DevisForm />} />
        <Route path="/create-task/:projectId" element={<TaskCreate />} />
        <Route path = "/tasks/:projectId" element = {<TaskList/>} />
        <Route path="/edit-task/:taskId" element={<EditTask />} />
        <Route path="/achats/nouveau" element={<CreerDevisAchat />} />
        <Route path="/achats/Devis" element={<DevisModule />} />
        <Route path="/devis/service" element={<CreerDevisPurchase />} /> 
        <Route path="/suppliers" element={<PageSupplier />} /> 
        <Route path="/DevisService" element={<DevisServiceTable />} />    
        <Route path="/Clients" element={<Page />} />    
        <Route path="/project-module" element={<ProjectModule />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/module-rh" element={<ModuleRH />} />
        <Route path="/profile-user" element={<ProfileInterface />} />
        <Route path="/devis/produit" element={<CreerDevisProduit />} />
        <Route path="/devis/produitTable" element={<DevisProduitTable />} />
        <Route path="/achats/commandes" element={<CommandeModule />} />
        <Route path="/achats/commande/service" element={<CreateCommandeSupplier />} />
      </Routes>
    </ThemeProvider>
  );
}
