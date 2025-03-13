import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";



export const ProviderDashboard= () => {
    return (

        <div className="container-fluid p-0">
    
        <header className="bg-secondary text-white text-center py-5">
          <h1 className="display-4">Bienvenido a tu Panel de Proveedor</h1>
          <p className="lead">Gestiona tus pedidos y consulta tu información fácilmente</p>
        </header>
 
        <section className="container py-5">
          <h2 className="text-center mb-4">Tus Opciones</h2>
          <div className="row">
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h3 className="card-title">Pedidos</h3>
                  <p className="card-text">Consulta el estado de tus pedidos en curso.</p>
                  <Link to="/provider-orders" className="btn btn-primary">Ver Mis Traslados</Link>
                </div>
              </div>
            </div>
          </div>
  
        
          <hr className="featurette-divider my-5" />
  
     
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="text-center my-4">Sobre Autogeek Logistics</h3>
              <p className="lead">
                En Autogeek Logistics, nos especializamos en el transporte de vehículos de una ciudad a otra dentro de España. 
                Brindamos un servicio seguro, eficiente y de alta calidad para garantizar que tu coche llegue a su destino en perfectas condiciones.
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <img src="ruta-a-imagen.jpg" className="img-fluid rounded" alt="Autogeek Logistics" />
            </div>
          </div>
        </section>
      </div>
    );
};