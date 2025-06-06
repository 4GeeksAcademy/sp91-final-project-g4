import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";


export const MainNavbar = () => {

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (store.isLogged) {
      actions.setIsLogged(false);
      actions.setUser({});
      localStorage.removeItem("token");
      navigate("/");
    } else {
      navigate("/login");
    }
  };
  return (
    <Navbar expand="lg" className="bg-primary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">AutoGeek Logistics</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas id="offcanvasNavbar" placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link as={Link} to="/aboutus">Sobre nosotros</Nav.Link>
              <Nav.Link as={Link} to="/services">Nuestros servicios</Nav.Link>
              <Nav.Link as={Link} to="/contact-us">Contacta con nosotros</Nav.Link>
              {store.isLogged && (
                <NavDropdown title={store.user.name} align="end">
                  {store.user.role === "customer" && (
                    <>
                      <NavDropdown.Item as={Link} to="/customer-dashboard">Mi pagina cliente</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/customer-profile">Mis Datos</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/new-order">Nuevo pedido</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/customer-orders">Mis pedidos</NavDropdown.Item>
                    </>
                  )}
                  {store.user.role === "provider" && (
                    <>
                      <NavDropdown.Item as={Link} to="/provider-dashboard">Mi pagina proveedor</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/provider-profile">Mi perfil</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/provider-orders">Mis traslados</NavDropdown.Item>

                    </>
                  )}
                  {store.user.role === "admin" && (
                    <>
                      <NavDropdown.Item as={Link} to="/admin-profile">Mis datos</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/customers">Clientes</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/providers">Proveedores</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/vehicles">Vehículos</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/orders-customers">Pedidos de clientes</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/orders-providers">Traslados de proveedores</NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogin}>Cerrar sesión</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
            {!store.isLogged && (
              <Button onClick={handleLogin} variant="success" className="ms-2">
                Iniciar sesión
              </Button>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

