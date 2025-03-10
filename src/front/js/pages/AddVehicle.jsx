import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const AddVehicle = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [vehicleType, setVehicleType] = useState("Turism");

    // ✅ Función para agregar vehículo
    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const dataToSend = {
            brand, model, vehicle_type: vehicleType
        };
        actions.addVehicle(dataToSend);
        navigate("/admin/vehicles");
    };

    // ✅ Función para cancelar y volver a la lista de vehículos
    const handleCancel = () => {
        navigate("/admin/vehicles");
    };

    return (
        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: '1rem' }}>
            <h1 className="h3 fw-bold text-center my-2 "> Alta de vehículo </h1>
            <form onSubmit={handleSubmitAdd}>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Marca"
                        value={brand} onChange={(event) => setBrand(event.target.value)} />
                    <label htmlFor="floatingInput">Marca</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Modelo"
                        value={model} onChange={(event) => setModel(event.target.value)} />
                    <label htmlFor="floatingInput">Modelo</label>
                </div>
                <div className="form-floating my-3">
                    <select className="form-select" id="floatingSelect" value={vehicleType}
                        onChange={(event) => setVehicleType(event.target.value)}>
                        <option value="Turism">Turismo</option>
                        <option value="Motorcycle">Motocicleta</option>
                        <option value="SUV">SUV</option>
                        <option value="4x4">4x4</option>
                        <option value="Van">VAN</option>
                        <option value="Extra van">Extra Van</option>
                    </select>
                    <label htmlFor="floatingSelect">Tipo de vehículo</label>
                </div>

                <button type="submit" className="btn btn-warning container my-3">Crear</button>
                <button type="button" className="btn btn-secondary container" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    );
}
