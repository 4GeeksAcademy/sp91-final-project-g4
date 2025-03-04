import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de tener Bootstrap importado
import fundadores from "../../img/fundadores.jpg";

export const AboutUs = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="container-fluid p-0">
    <header className="bg-secondary text-white text-center py-5">
      <h1 className="display-4">Autogeek Logistics</h1>
      <p className="lead">Tu socio experto en el transporte de vehículos en toda España</p>
    </header>
    <section className="container py-5">
      <h2 className="text-center mb-4">Sobre Nosotros</h2>
      <div className="row">
        <div className="col-12">
          <p className="lead">
            En Autogeek Logistics, somos especialistas en el transporte de
            vehículos de una ciudad a otra dentro de España. Nos dedicamos a
            ofrecer un servicio seguro, eficiente y de alta calidad para que tu
            coche llegue a su destino en perfectas condiciones y en el menor
            tiempo posible.
          </p>
          <p className="lead">
            Nuestra empresa nació con el objetivo de simplificar la movilidad
            de particulares, concesionarios, empresas de renting y flotas
            corporativas, proporcionando soluciones logísticas personalizadas y
            adaptadas a cada necesidad. Contamos con un equipo de profesionales
            altamente cualificados y una moderna flota de transportes que
            garantizan la máxima seguridad en cada traslado.
          </p>
          <p className="lead">
            Nos diferenciamos por nuestro compromiso con la puntualidad, la
            atención al cliente y la transparencia en cada etapa del proceso.
            Desde el primer contacto hasta la entrega final, en Autogeek
            Logistics trabajamos para ofrecer una experiencia sin complicaciones
            y con la tranquilidad que mereces.
          </p>
        </div>
      </div>
  
      <hr className="featurette-divider" />
      <div className="row align-items-center">
        <div className="col-lg-8">
          <h3 className="text-center my-4">Conoce a los Fundadores</h3>
          <p className="lead">
            Conoce a las personas que crearon <strong>Autogeek Logistics</strong> y pusieron
            en marcha este proyecto innovador.
          </p>
          <p className="lead">
            <strong>Marcos Sevilla, Natalia Manzano y Ricardo Franco,</strong>
            tras pasar un tiempo en <strong>4Geeks Academy</strong> unieron su visión y pasión
            y crearon este proyecto dedicado al transporte seguro y eficiente.
          </p>
        </div>
        <div className="col-lg-4 text-center">
          <img src={fundadores} className="img-fluid rounded" alt="Fundadores" />
        </div>
      </div>
    </section>
  </div>
  );
};
