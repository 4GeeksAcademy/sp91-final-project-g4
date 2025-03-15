import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./store/userContext.js";
import injectContext from "./store/appContext.js";
// Custom components

import { MainNavbar } from "./component/MainNavbar.jsx";
import 'react-toastify/dist/ReactToastify.css';
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
import { CustomerProfile } from "./pages/CustomerProfile.jsx";
import { CustomerNewOrder } from "./pages/CustomerNewOrder.jsx";
import { CustomerOrders } from "./pages/CustomerOrders.jsx";
import { EditCustomer } from "./pages/EditCustomer.jsx";
import { AddCustomer } from "./pages/AddCustomer.jsx";
import { AddCustomerOrder } from "./pages/AddCustomerOrder.jsx";
import { Providers } from "./pages/Providers.jsx";
import { ProviderDashboard } from "./pages/ProviderDashboard.jsx";
import { ProviderOrders } from "./pages/ProviderOrders.jsx";
import { ProviderProfile } from "./pages/ProviderProfile.jsx";
import { AddProvider } from "./pages/AddProvider.jsx";
import { EditProvider } from "./pages/EditProvider.jsx";
import { Vehicles } from "./pages/Vehicles.jsx";
import { AddVehicle } from "./pages/AddVehicle.jsx";
import { EditVehicle } from "./pages/EditVehicle.jsx";
import { OrderCustomerDetail } from "./pages/OrderCustomerDetail.jsx";
import { OrderCustomer } from "./pages/OrderCustomer.jsx";
import { OrderProvider } from "./pages/OrderProvider.jsx";
import { OrderProviderDetail } from "./pages/OrderProviderDetail.jsx";
import { EditProfile } from "./pages/EditProfile.jsx";
import { AddAdminModal } from "./pages/AddAdminModal.jsx";  // ✅ Importación correcta
import { ToastContainer } from "react-toastify";
import { EditProviderProfile } from "./pages/EditProviderProfile.jsx";
import { ProviderOrderDetail } from "./pages/ProviderOrderDetail.jsx";
import { CustomerOrderDetail } from "./pages/CustomerOrderDetail.jsx";

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
                        <ToastContainer
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                        <Routes>
                            <Route element={<Home />} path="/" />
                            <Route element={<Login />} path="/login" />
                            <Route element={<SignUp />} path="/sign-up" />
                            <Route element={<UserProfile />} path="/admin-profile" />
                            <Route element={<EditProfile />} path="/edit-user" />
                            <Route element={<Customers />} path="/admin/customers" />
                            <Route element={<CustomerDashboard />} path="/customer-dashboard" />
                            <Route element={<CustomerProfile />} path="/customer-profile" />
                            <Route element={<CustomerNewOrder />} path="/new-order" />
                            <Route element={<CustomerOrders />} path="/customer-orders" />
                            <Route element={<AddCustomer />} path="/add-customer" />
                            <Route element={<EditCustomer />} path="/admin/edit-customer" />
                            <Route element={<AddCustomerOrder />} path="/admin/add-order-customer" />
                            <Route element={<Providers />} path="/admin/providers" />
                            <Route element={<ProviderDashboard />} path="/provider-dashboard" />
                            <Route element={<ProviderOrders />} path="/provider-orders" />
                            <Route element={<ProviderProfile />} path="/provider-profile" />
                            <Route element={<EditProviderProfile />} path="/edit-provider-user" />
                            <Route element={<AddProvider />} path="/add-provider" />
                            <Route element={<EditProvider />} path="/admin/edit-provider" />
                            <Route element={<Vehicles />} path="/admin/vehicles" />
                            <Route element={<AddVehicle />} path="/add-vehicle" />
                            <Route element={<EditVehicle />} path="/admin/edit-vehicle" />
                            <Route element={<AboutUs />} path="/aboutus" />
                            <Route element={<Services />} path="/services" />
                            <Route element={<ContactUs />} path="/contact-us" />
                            <Route element={<OrderCustomer />} path="/admin/orders-customers" />
                            <Route element={<OrderCustomerDetail />} path="/admin/order-customer-detail" />
                            <Route element={<CustomerOrderDetail />} path="/customer-order-detail" />
                            <Route element={<OrderProvider />} path="/admin/orders-providers" />
                            <Route element={<OrderProviderDetail />} path="/admin/order-provider-detail" />
                            <Route element={<ProviderOrderDetail />} path="/provider-order-detail" />
                            <Route element={<UserProfile />} path="/admin-profile" />
                            <Route element={<AddAdminModal show={true} onClose={() => navigate("/admin-profile")} />} path="/add-admin" />
                            <Route path="*" element={<h1>Not found!</h1>} />

                        </Routes>
                        <Footer />
                    </ScrollToTop>
                </BrowserRouter>
            </UserProvider>
        </div>
    );
};

export default injectContext(Layout);
