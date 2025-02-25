import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";


export const CustomerOrders = () => {
	const { store, actions } = useContext(Context);
	return (
		<div>
			<h1>Mis Pedidos</h1>
			{/* Aquí puedes listar los pedidos del usuario */}
		</div>
	);
};