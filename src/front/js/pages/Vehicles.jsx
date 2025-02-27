import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";


export const Vehicles= () => {
	const { store, actions } = useContext(Context);
		return (
		  <div>
			<h1>Vehículos</h1>
			<p>Aquí se mostrará la lista de vehículos tabla.</p>
		  </div>
		);
	  };