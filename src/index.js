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

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

import { SnackbarProvider } from "notistack";           // 👈 pour les notifications
import { SoftUIControllerProvider } from "context";     // Soft UI

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SoftUIControllerProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: "top",      // top ou bottom
            horizontal: "center", // left | center | right
          }}
        >
          <App />
        </SnackbarProvider>
      </SoftUIControllerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
