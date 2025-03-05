import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./store/userContext.js";
import injectContext from "./store/appContext.js";
// Custom components

import { MainNavbar } from "./component/MainNavbar.jsx";
import { Alert } from "./component/Alert.jsx";

import { Footer } from "./component/Footer.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
// Custom pages or views
import { Home } from "./pages/Home.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { Services } from "./pages/Services.jsx";
import { ContactUs } from "./pages/ContactUs.jsx";
import { Login } from "./pages/Login.jsx";
import { SignUp } from "./pages/SignUp.jsx";

import { UserProfile } from "./pages/UserProfile.jsx";
import { Customers } from "./pages/Customers.jsx";
import { CustomerDashboard } from "./pages/CustomerDashboard.jsx";
import { CustomerNewOrder } from "./pages/CustomerNewOrder.jsx";
import { CustomerOrders } from "./pages/CustomerOrders.jsx";
import { EditCustomer } from "./pages/EditCustomer.jsx";
import { AddCustomer } from "./pages/AddCustomer.jsx";
import { Providers } from "./pages/Providers.jsx";
import { AddProvider } from "./pages/AddProvider.jsx";
import { EditProvider } from "./pages/EditProvider.jsx";
import { Vehicles } from "./pages/Vehicles.jsx";
import { AddVehicle } from "./pages/AddVehicle.jsx";
import { EditVehicle } from "./pages/EditVehicle.jsx";


// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="d-flex flex-column min-vh-100">
            <UserProvider> {/* Envolver todo con UserProvider */}
                <BrowserRouter>
                    <ScrollToTop>
                        <MainNavbar />
                        <Alert />
                        <Routes>
                            <Route path="*" element={<h1>Not found!</h1>} />
                            <Route element={<Home />} path="/" />
                            <Route element={<Login/>} path= "/login" />
                            <Route element={<SignUp/>} path= "/sign-up" />
                            <Route element={<UserProfile/>} path= "/user-profile" />
                            <Route element={<Customers />} path="admin/customers" />
                            <Route element={<CustomerDashboard />} path="/customer-dashboard" />
                            <Route element={<CustomerNewOrder />} path="/new-order" />
                            <Route element={<CustomerOrders />} path="/customer-orders" />
                            <Route element={<AddCustomer/>} path= "/add-customer" />
                            <Route element={<EditCustomer />} path="/admin/customers/admin/edit-customer" /> {/*  ¿Cual sería la URL correcta? */}
                            <Route element={<Providers />} path="admin/providers" />
                            <Route element={<AddProvider/>} path= "/add-provider" />
                            <Route element={<EditProvider />} path="/admin/providers/admin/edit-provider" /> {/*  ¿Cual sería la URL correcta? */}
                            <Route element={<Vehicles />} path="/admin/vehicles" /> 
                            <Route element={<AddVehicle />} path="/add-vehicle" /> 
                            <Route element={<EditVehicle />} path="admin/vehicles/admin/edit-vehicle" /> 
                            <Route element={<AboutUs />} path="/aboutus" />
                            <Route element={<Services />} path="/services" />
                            <Route element={<ContactUs />} path="/contact-us" />
                        </Routes>
                        <Footer />
                    </ScrollToTop>
                </BrowserRouter>
            </UserProvider>
        </div>
    );
};

export default injectContext(Layout);
