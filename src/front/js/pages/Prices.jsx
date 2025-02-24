import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";


export const Prices= () => {
	const { store, actions } = useContext(Context);
		return (
		  <div>
			<h1>Tarifas</h1>
			<p>Aquí se mostrarán las tarifas.</p>
		  </div>
		);
	  };