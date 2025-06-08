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

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "./layouts/dashboard";



import SignIn from "./layouts/authentication/sign-in";


// Soft UI Dashboard React icons
import Shop from "./examples/Icons/Shop";
import Office from "./examples/Icons/Office";
import Settings from './examples/Icons/Settings';
import Document from "./examples/Icons/Document";
import SpaceShip from "./examples/Icons/SpaceShip";
import CustomerSupport from "./examples/Icons/CustomerSupport";
import CreditCard from "./examples/Icons/CreditCard";
import Facture from "./layouts/Facture";



import UserProfile from "./layouts/profile";


import AdminDashboard from "./layouts/profile";
import RhDashboard from "./layouts/profile/components/rh";
import VenteDashboard from "./layouts/Sale/Data/VenteDashboard";
import PurchaseDashboard from "./layouts/Achat/componants/achatpage";
import BankAccountDashboard from "./layouts/billing/components/BankAccountDashboard";
import Page from "./layouts/tables/components";
import { SignInForm } from "./layouts/authentication/sign-up";
import PageSupplier from "./layouts/Supplier/components";
import PageProduct from "./layouts/Product/components";
import SignInPage from "./layouts/authentication/sign-up";
import Dashboardlayout from "./layouts/Projects/components/Dashboardlayout";
import EmployeeDashboard from "./layouts/employee/components/EmployeeDashboard";
import SettingsModule from "./layouts/Setting/erpSetting";
import RolesDashboard from "./layouts/roles/componnents/RolesDashboard";
import ProfilePage from "./layouts/profile";
import ManagerProfilePage from "./layouts/profile/data/ManagerProfilePage";
import AdminProfilePage from "./layouts/profile/data/AdminProfilePage";
import ProfileDashboard from "./layouts/profile/data/UserForm";
import ProductListWrapper from './layouts/Product/components/ProductListWrapper';
import DashboardCards from "layouts/profile/data/adminDashboard/DashboardCards";
import ProjectDashboard from "layouts/Projects/components/ProjectDashboard";
import ProjectList from "./layouts/Projects/components/ProjectList";
import VenteModule from "layouts/Sale/Data/VenteModule";
import AchatModule from "layouts/Achat/componants/AchatModule";
import ProjectModule from "layouts/Projects/components/ProjectModule";
import ModuleRH from "layouts/HRModule/components/ModuleRH";
import ProductServiceModule from "layouts/Product/components/ProductServiceModule";
import ProfilePageUser from "layouts/profile/UserProfile/ProfilePageUser";
import { CustomersTable } from "layouts/tables/components/custumersTabe";
import SupplierListTable from "layouts/Supplier/components/SuppliersTable";





const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
   
  },
  {
    type: "collapse",
    name: "Clients",
    key: "listCLients",
    route: "/listCLients",
    icon: <Office size="12px" />,
    component: <CustomersTable />,
    noCollapse: true,
    
  },
  {
    type: "collapse",
    name: "Fournisseur",
    key: "supplier",
    route: "/supplier",
    icon: <Settings size="12px" />,
    component: <SupplierListTable />,
    noCollapse: true,
  }, 
  {
    type: "collapse",
    name: "Produit et Services",
    key: "produit",
    route: "/produitService",
    icon: <Settings size="12px" />,
    component: <ProductServiceModule />,
    noCollapse: true,
   
  },
  {
    type: "collapse",
    name: "Ventes",
    key: "ClientCommandInterface",
    route: "/ClientCommandInterface",
    icon: <Office size="12px" />,
    component: <VenteModule/>,
     noCollapse: true,
   
     
  },
  {
    type: "collapse",
    name: "Achats",
    key: "achats",
    route: "/Achat",
    icon: <Office size="12px" />,
    component: < AchatModule/>,
     noCollapse: true,
   
  },
  {
    type: "collapse",
    name: "Banque",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <BankAccountDashboard />,
    noCollapse: true,
 
  },

  {
    type: "collapse",
    name: "ProjectManagment",
    key: "ProjectManagment",
    route: "/ProjectManagment",
    icon: <Settings size="12px" />,
    component: <ProjectModule />,
    
    
  },
  {
    type: "collapse",
    name: "HR",
    key: "HR",
    route: "/HR",
    icon: <Settings size="12px" />,
    component: <ModuleRH />,
    
    
  },
  
  
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <ProfilePageUser />,
    noCollapse: true,
    //show: userRole === 'admin' || userRole === 'HR',  // يظهر كان لل-admin أو HR
  },
  /* {
    type: "collapse",
    name: "Login",  // Changed from Sign In to Login
    key: "login",
    route: "/authentication/sign-in",  // Keep this or change to something like /login
    icon: <Document size="12px" />,
    component: <SignIn />,  // Keep the component that handles login
    noCollapse: true,
    
  }, */
  {
    type: "collapse",
    name: "Logout",  // Changed from Sign Up to Logout
    key: "logout",
    route: "/signin ",// Redirige vers /logout si authentifié, sinon vers /login
    icon: <SpaceShip size="12px" />,
    component:<SignInPage />,// Implement a SignOut component or function to handle logout
    noCollapse: true,
  },
  
  {
    type: "collapse",
    name: "SETTING",
    key: "Setting",
    route: "/Setting",
    icon: <Document size="12px" />,
    component: <SettingsModule />,
    noCollapse: true,
    
  },
  {
    type: "collapse",
    name: "Admin Dashboard",
    key: "admin-dashboard",
    route: "/admin-card",
    icon: <Settings size="12px" />,
    component: <DashboardCards />,
    noCollapse: true,
    
  }
  
];

export default routes;
