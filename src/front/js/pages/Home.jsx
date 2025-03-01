import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import transporte from "../../img/transporte.jpg";
import entrega from "../../img/entrega.jpg";
import mapa from "../../img/mapa.jpg";
import camion from "../../img/camion.jpg";
import ubicacion from "../../img/ubicacion.jpg";
import manos from "../../img/manos.jpg";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <div>
            <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={transporte} className="d-block w-100" alt="Transporte eficiente" style={{ height: '400px', objectFit: 'cover' }} />
                    </div>
                    <div className="carousel-item">
                        <img src={mapa} className="d-block w-100" alt="Rutas optimizadas" style={{ height: '400px', objectFit: 'cover' }} />
                    </div>
                    <div className="carousel-item">
                        <img src={entrega} className="d-block w-100" alt="Compromiso con la entrega" style={{ height: '400px', objectFit: 'cover' }} />
                    </div>
                </div>
            </div>

            <div className="container marketing mt-3">
                <div className="row">
                    <div className="col-lg-4">
                        <img src={camion} className="bd-placeholder-img rounded-circle" width="140" height="140" alt="Transporte seguro" />
                        <h2 className="fw-normal">Transporte Seguro</h2>
                        <p>Garantizamos entregas seguras y eficientes con nuestra moderna flota de vehículos.</p>
                    </div>
                    <div className="col-lg-4">
                        <img src={ubicacion} className="bd-placeholder-img rounded-circle" width="140" height="140" alt="Logística Inteligente" />
                        <h2 className="fw-normal">Logística Inteligente</h2>
                        <p>Optimizamos rutas y tiempos para ofrecer un servicio rápido y confiable.</p>
                    </div>
                    <div className="col-lg-4">
                        <img src={manos} className="bd-placeholder-img rounded-circle" width="140" height="140" alt="Compromiso con el cliente" />
                        <h2 className="fw-normal">Compromiso Total</h2>
                        <p>Nos esforzamos en brindar un servicio personalizado y de calidad a cada cliente.</p>
                    </div>
                </div>

                <hr className="featurette-divider" />

                <div className="row featurette">
                    <div className="col-md-7">
                        <h2 className="featurette-heading fw-normal lh-1">Innovación en Transporte <span className="text-body-secondary">Eficiencia en cada entrega.</span></h2>
                        <p className="lead">Nos especializamos en la gestión y optimización del transporte, asegurando la máxima eficiencia en cada envío.</p>
                    </div>
                    <div className="col-md-5">
                        <img src={transporte} className="img-fluid rounded" alt="Innovación en transporte" />
                    </div>
                </div>

                <hr className="featurette-divider" />

                <div className="row featurette">
                    <div className="col-md-7 order-md-2">
                        <h2 className="featurette-heading fw-normal lh-1">Tecnología de Vanguardia <span className="text-body-secondary">Monitoreo en tiempo real.</span></h2>
                        <p className="lead">Nuestra plataforma permite un seguimiento detallado de los envíos, garantizando seguridad y confianza.</p>
                    </div>
                    <div className="col-md-5 order-md-1">
                        <img src={mapa} className="img-fluid rounded" alt="Monitoreo en tiempo real" />
                    </div>
                </div>

                <hr className="featurette-divider" />

                <div className="row featurette">
                    <div className="col-md-7">
                        <h2 className="featurette-heading fw-normal lh-1">Confianza y Seguridad <span className="text-body-secondary">Tu carga en buenas manos.</span></h2>
                        <p className="lead">Nuestro equipo altamente capacitado y comprometido garantiza un servicio seguro y confiable.</p>
                    </div>
                    <div className="col-md-5">
                        <img src={entrega} className="img-fluid rounded" alt="Confianza en las entregas" />
                    </div>
                </div>

                <hr className="featurette-divider" />
            </div>
        </div>
    );
};