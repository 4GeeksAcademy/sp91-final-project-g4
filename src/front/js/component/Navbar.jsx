import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../store/userContext"; // Importar el hook de contexto de usuario

export const Navbar = () => {
  const { user } = useUser(); // Obtener el usuario del contexto

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
            {/* Siempre visible */}
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>

            {/* Enlaces visibles para usuarios no autenticados */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Registro</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Inicio sesión</Link>
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
                    <Link className="dropdown-item" to="/vehicles">Vehículos</Link>
                    <Link className="dropdown-item" to="/prices">Tarifas</Link>
                  </div>
                </li>
              </>
            )}

            {/* Enlaces visibles para clientes (users) autenticados */}
            {user?.role === "customer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/logout">Cerrar sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-orders">Mis Pedidos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/vehicles">Vehículos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/prices">Tarifas</Link>
                </li>
              </>
            )}

            {/* Enlaces visibles para proveedores autenticados */}
            {user?.role === "provider" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">Pedidos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/prices">Tarifas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/vehicles">Vehículos</Link>
                </li>
              </>
            )}

            {/* Enlaces visibles para administradores autenticados */}
            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Panel de Admin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/providers">Proveedores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customers">Clientes</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
