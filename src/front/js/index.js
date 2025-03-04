import React from "react";  // Import react into the bundle
import ReactDOM from "react-dom";
import "../styles/index.css";  // Include your index.scss file into the bundle
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Layout from "./Layout.jsx";  // Import your own components



ReactDOM.render(<Layout />, document.querySelector("#app"));  // Render your react application
