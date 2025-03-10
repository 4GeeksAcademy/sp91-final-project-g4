import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";


export const EditVehicle = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const currentVehicle = store.currentVehicle;
    const [brand, setBrand] = useState(currentVehicle.brand);
    const [model, setModel] = useState(currentVehicle.model);
    const [vehicleType, setVehicleType] = useState(currentVehicle.vehicle_type);
    const [correctorCost, setCorrectorCost] = useState(currentVehicle.corrector_cost || 0);

    // ✅ Manejo de envío del formulario
    const handleSubmitEdit = (event) => {
        event.preventDefault();
        const dataToSend = {
            brand,
            model,
            vehicle_type: vehicleType,
            corrector_cost: parseFloat(correctorCost) || 0, // ✅ Convertir a número
        };

        actions.editVehicle(currentVehicle.id, dataToSend);
        navigate("/admin/vehicles");
    };

    // ✅ Manejo del botón "Cancelar"
    const handleCancel = () => {
        navigate("/admin/vehicles");
    };

    return (
        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: '1rem' }}>
            <h1 className="h3 fw-bold text-center my-2 "> Editar datos del vehículo </h1>
            <form onSubmit={handleSubmitEdit}>
                <div className="form-floating my-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        id="floatingBrand" 
                        placeholder="Marca"
                        value={brand}
                        onChange={(event) => setBrand(event.target.value)}
                    />
                    <label htmlFor="floatingBrand">Marca</label>
                </div>
                <div className="form-floating my-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        id="floatingModel" 
                        placeholder="Modelo"
                        value={model}
                        onChange={(event) => setModel(event.target.value)}
                    />
                    <label htmlFor="floatingModel">Modelo</label>
                </div>
                <div className="form-floating my-3">
                    <select 
                        className="form-select" 
                        id="floatingVehicleType"
                        value={vehicleType}
                        onChange={(event) => setVehicleType(event.target.value)}
                    >
                        <option value="Turism">Turismo</option>
                        <option value="Motorcycle">Motocicleta</option>
                        <option value="SUV">SUV</option>
                        <option value="4x4">4X4</option>
                        <option value="Van">VAN</option>
                        <option value="Extra Van">Extra Van</option>
                    </select>
                    <label htmlFor="floatingVehicleType">Tipo de vehículo</label>
                </div>
                {/* ✅ Nuevo campo para editar el corrector de coste */}
                <div className="form-floating my-3">
                    <input 
                        type="number" 
                        step="0.01" 
                        className="form-control" 
                        id="floatingCorrectorCost"
                        placeholder="Corrector de coste"
                        value={correctorCost}
                        onChange={(event) => setCorrectorCost(event.target.value)}
                    />
                    <label htmlFor="floatingCorrectorCost">Corrector de coste</label>
                </div>
                <button type="submit" className="btn btn-warning container my-3">Guardar</button>
                <button type="button" className="btn btn-secondary container" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    );
};

