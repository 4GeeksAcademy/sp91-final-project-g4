import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";


export const Orders = () => {
	const { store, actions } = useContext(Context);
		return (
		  <div>
			<h1>Pedidios</h1>
			<p>Aquí se mostrarán los pedidios y la localizacion formulario.</p>
		  </div>
		);
	  };