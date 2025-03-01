import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useUser } from "../store/userContext"; // Importar el hook de contexto de usuario

export const Navbar = () => {
  const { user } = useUser(); // Obtener el usuario del contexto
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (store.isLogged) {
      actions.setIsLogged(false);
      actions.setUser({});
      localStorage.removeItem('token');
      console.log('deslogeando');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

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
              <Link className="nav-link active" to="/aboutus">Sobre nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/registro">Nuestros servicios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/iniciosesion">Contacta con nosotros</Link>
            </li>

            {/* Mostrar el dropdown de Cliente solo si el usuario es cliente */}
            {store.isLogged && user.role === 'cliente' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Cliente
                </a>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="/vehiculos">Mis datos</Link>
                  <Link className="dropdown-item" to="/tarifas">Mis pedidos</Link>
                  <Link className="dropdown-item" to="/mis-pedidos" onClick={handleLogin}>Cerrar sesión</Link>
                </div>
              </li>
            )}

            {/* Mostrar el dropdown de Proveedor solo si el usuario es proveedor */}
            {store.isLogged && user.role === 'proveedor' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Proveedor
                </a>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="/vehiculos">Mis datos</Link>
                  <Link className="dropdown-item" to="/tarifas">Mis traslados</Link>
                  <Link className="dropdown-item" to="/mis-pedidos" onClick={handleLogin}>Cerrar sesión</Link>
                </div>
              </li>
            )}

            {/* Mostrar el dropdown de Admin solo si el usuario es admin */}
            {store.isLogged && user.role === 'admin' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Admin
                </a>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link>
                  <Link className="dropdown-item" to="/admin/users">Usuarios</Link>
                  <Link className="dropdown-item" to="/mis-pedidos" onClick={handleLogin}>Cerrar sesión</Link>
                </div>
              </li>
            )}
          </ul>

          {/* Mostrar el botón de login/logout */}
          <button onClick={handleLogin} className="btn btn-success">
            {store.isLogged ? 'Cerrar sesión' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </nav>
  );
};
