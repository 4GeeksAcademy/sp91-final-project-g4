import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./store/userContext.js";
import injectContext from "./store/appContext.js";
// Custom components

import  MainNavbar  from "./component/MainNavbar.jsx";
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
                        < MainNavbar />
                        <Routes>
                            <Route path="*" element={<h1>Not found!</h1>} />
                            <Route element={<Home />} path="/" />
                            <Route element={<AboutUs />} path="/aboutus" />
                            <Route element={<Services />} path="/services" />
                            <Route element={<ContactUs />} path="/contact-us" />
    
                        <Route element={<Login/>} path= "/login" />
                        <Route element={<SignUp/>} path= "/sign-up" />
                        </Routes>
                        <Footer />
                    </ScrollToTop>
                </BrowserRouter>
            </UserProvider>
        </div>
    );
};

export default injectContext(Layout);
