import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Vehicles = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    // ✅ Función para editar vehículo
    const handleEdit = async (vehicle) => {
        actions.setCurrentVehicle(vehicle);
        navigate("/admin/edit-vehicle"); // Corrección en la ruta
    };

    // Función para activar/desactivar vehículo
    const handleToggleStatus = async (vehicle) => {
        const updatedData = { is_active: !vehicle.is_active }; // Cambia el estado
    
        console.log("🚀 Cambiando estado del vehículo:", vehicle.id, "Nuevo estado:", updatedData);
    
        const success = await actions.editVehicle(vehicle.id, updatedData); // Enviar cambio al backend
    
        if (success) {
            console.log("✅ Estado cambiado con éxito");
    
            // 🔹 Actualiza inmediatamente el estado local en el frontend
            /* actions.setAlert({ 
                text: `Vehículo ${vehicle.is_active ? "desactivado" : "activado"} correctamente`, 
                background: "primary", 
                visible: true 
            }); */
        } else {
            console.error("❌ No se pudo cambiar el estado del vehículo.");
        }
    }

    return (

        <div className="container-fluid p-0">
        <header className="bg-secondary text-white text-center py-5">
            <h1 className="display-4">Vehiculos</h1>
            <p className="lead">Gestion de vehiculos y consulta de información </p>
        </header>

        <div className="container-fluid">
            <div className="container my-2 pb-5">
                <div className="d-flex justify-content-between mx-3">
                    <h1 className="text-secondary my-4">Listado de vehículos</h1>
                    <Link to="/add-vehicle">
                        <button type="button" className="btn btn-success my-4">Añadir vehículo</button>
                    </Link>
                </div>
                <div className="container">
                    <table className="table table-info">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Tipo de vehículo</th>
                                <th>Corrector</th>
                                <th>Estado</th>
                                <th>Editar</th>
                                <th>Activar/Desactivar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.vehicles.map((item) => (
                                <tr key={item.id} className="table-light">
                                    <th>{item.brand}</th>
                                    <td>{item.model}</td>
                                    <td>{item.vehicle_type}</td>
                                    <td>{item.corrector_cost || "N/A"}</td>
                                    <td>{item.is_active ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <button onClick={() => handleEdit(item)} type="button" className="btn btn-secondary">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleToggleStatus(item)} 
                                            type="button" 
                                            className={`btn ${item.is_active ? "btn-success" : "btn-danger"}`}>
                                            <i className="fas fa-power-off"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    );
}


