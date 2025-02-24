import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {

  const { store, actions } = useContext(Context)
  const navigate = useNavigate() 

  const handleLogin = () => {
    if (store.isLogged) {
        actions.setIsLogged(false);
        actions.setUser({});
        localStorage.removeItem('token')
        console.log('deslogeando');
        navigate('/')
    }else{
        navigate('/login')
    }
  }
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
{/*             <li className="nav-item">
              <Link className="nav-link" to="/iniciosesion">Inicio sesión</Link>
              </li> */}
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
              <li className="nav-item">
              </li>
              </div>
            </li>
          </ul>
              <button onClick={handleLogin} className="btn btn-success" to="/registro">
                {store.isLogged ? 'Cerrar sesión' : 'Iniciar sesión'}
              </button>
        </div>
      </div>
    </nav>
  );
};
