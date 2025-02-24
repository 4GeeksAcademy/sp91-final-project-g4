import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">AutoGeek Logistics</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarColor01">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/registro">Registro</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/iniciosesion">Inicio sesión</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Servicios
              </a>
              <div className="dropdown-menu">
                <Link className="dropdown-item" to="/vehiculos">Vehículos</Link>
                <Link className="dropdown-item" to="/tarifas">Tarifas</Link>
                <Link className="dropdown-item" to="/mis-pedidos">Mis pedidos</Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
