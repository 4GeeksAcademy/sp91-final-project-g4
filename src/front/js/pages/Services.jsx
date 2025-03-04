import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de tener Bootstrap importado
import transporteseguro from "../../img/transporteseguro.jpg";
import tiposvehiculo from "../../img/tiposvehiculo.jpg";
import peninsula from "../../img/peninsula.jpg";

export const Services = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="container-fluid p-0">
    <header className="bg-secondary text-white text-center py-5">
      <h1 className="display-4">Autogeek Logistics</h1>
      <p className="lead">Tu socio experto en el transporte de vehículos en toda España</p>
    </header>
    <section className="container py-5">
      <h2 className="text-center mb-4">Nuestros Servicios</h2>
      <div className="row featurette">
        <div className="col-md-7 order-md-2">
          <h2 className="featurette-heading fw-normal lh-1">Transporte de Todo Tipo de Vehículos <span className="text-body-secondary">Soluciones para cada necesidad.</span></h2>
          <p className="lead">En Autogeek Logistics transportamos una amplia variedad de vehículos, desde turismos hasta furgonetas extra grandes, garantizando siempre seguridad y eficiencia.</p>
        </div>
        <div className="col-md-5 order-md-1">
          <img src={tiposvehiculo} className="img-fluid rounded" alt="Diferentes tipos de vehículos" />
        </div>
      </div>
      
      <hr className="featurette-divider" />
      
      <div className="row featurette">
        <div className="col-md-7">
          <h2 className="featurette-heading fw-normal lh-1">Rutas Eficientes <span className="text-body-secondary">Conectamos toda la península.</span></h2>
          <p className="lead">Optimizamos cada ruta para reducir tiempos de entrega y ofrecer el mejor servicio posible a nuestros clientes.</p>
        </div>
        <div className="col-md-5">
          <img src={peninsula} className="img-fluid rounded" alt="Ejemplo de ruta de transporte" />
        </div>
      </div>
      
      <hr className="featurette-divider" />
      
      <div className="row featurette">
        <div className="col-md-7 order-md-2">
          <h2 className="featurette-heading fw-normal lh-1">Transporte Seguro <span className="text-body-secondary">Cuidamos cada detalle.</span></h2>
          <p className="lead">Nuestra experiencia y compromiso garantizan un traslado seguro y sin complicaciones, protegiendo tu vehículo en cada etapa del proceso.</p>
        </div>
        <div className="col-md-5 order-md-1">
          <img src={transporteseguro} className="img-fluid rounded" alt="Transporte seguro de vehículos" />
        </div>
      </div>
      
      <hr className="featurette-divider" />
    </section>
  </div>
  
  );
};
