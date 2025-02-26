import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import camiontransporte from "../../img/camiontransporte.webp";
import clientesatisfecho from "../../img/clientesatisfecho.webp";
import mapa from "../../img/mapa.png";
import "../../styles/home.css";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-bs-ride="carousel">
		<div className="carousel-indicators">
		  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
		  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
		  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
		</div>
		<div className="carousel-inner">
		  <div className="carousel-item active">
		  <img src={camiontransporte} className="d-block w-100" alt="Slide 1" />
		  </div>
		  <div className="carousel-item">
			<img src= {mapa}  className="d-block w-100" alt="Slide 2" />
		  </div>
		  <div className="carousel-item">
			<img src= {clientesatisfecho}  className="d-block w-100" alt="Slide 3" />
		  </div>
		</div>
		<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
		  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
		  <span className="visually-hidden">Previous</span>
		</button>
		<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
		  <span className="carousel-control-next-icon" aria-hidden="true"></span>
		  <span className="visually-hidden">Next</span>
		</button>
	  </div>
	);
};
