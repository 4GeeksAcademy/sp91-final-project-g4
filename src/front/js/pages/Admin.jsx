import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";


export const Admin = () => {
	const { store, actions } = useContext(Context);
		return (
			<div>
			<h1>Panel de Admin</h1>
			{/* Aquí puedes añadir más contenido específico para los administradores */}
		  </div>
		);
	  };
	