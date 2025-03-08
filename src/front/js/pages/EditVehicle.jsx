import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../component/Alert.jsx";


export const EditVehicle = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const currentVehicle = store.currentVehicle;
    const [ brand, setBrand ] = useState(currentVehicle.brand);
    const [ model, setModel ] = useState(currentVehicle.model);
    const [ vehicleType, setVehicleType ] = useState(currentVehicle.vehicle_type);
    /* const [ correctorCost, setCorrectorCost ] = useState(currentVehicle.corrector_cost); */

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        actions.setAlert({text: 'Vehículo editado correctamente', background: 'primary', visible: true})
        const dataToSend = {
            brand, model, vehicle_type: vehicleType, /* correctorCost */
        };
        actions.editVehicle(currentVehicle.id, dataToSend);
        navigate("/admin/vehicles");
    }

    return (
        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: '1rem' }}>
            <h1 className="h3 fw-bold text-center my-2 "> Editar datos del vehículo </h1>
            <Alert/>
            <form onSubmit={handleSubmitEdit}>
                <div className="form-floating my-3">
                    <input type="brand" className="form-control" id="floatingInput" placeholder="Brand"
                        value={brand}
                        onChange={(event) => setBrand(event.target.value)} />
                    <label htmlFor="floatingInput">Marca</label>
                </div>
                <div className="form-floating my-3">
                    <input type="model" className="form-control" id="floatingInput" placeholder="Model"
                        value={model}
                        onChange={(event) => setModel(event.target.value)} />
                    <label htmlFor="floatingInput">Modelo</label>
                </div>
                <div className="form-floating my-3">
                    <select className="form-select" placeholder="Tipo de vehículo" id="floatingSelect"
                    value={vehicleType}
                    onChange={(event) => setVehicleType(event.target.value)}>
                        <option value={"Turism"}>Turismo</option>
                        <option value={'Motorcycle'}>Motoclicleta</option>
                        <option value={"SUV"}>SUV</option>
                        <option value={"4x4"}>4X4</option>
                        <option value={"Van"}>VAN</option>
                        <option value={"Extra van"}>Extra Van</option>
                    </select>
                        <label htmlFor="floatingSelect">Tipo de vehículo</label>
                </div>
{/*                 <div className="form-floating my-3">
                    <select className="form-select" placeholder="Coste de transporte" id="floatingSelect"
                    value={correctorCost}
                    onChange={(event) => setCorrectorCost(event.target.value)}>
                        <option defaultValue>0.0</option>
                        <option>0.0</option>
                        <option>0.2</option>
                        <option>0.3</option>
                        <option>0.5</option>
                        <option>0.7</option>
                    </select>
                        <label htmlFor="floatingSelect">Coste de transporte</label>
                </div> */}
                <button type="submit" className="btn btn-warning container my-3">Guardar</button>
            </form>
        </div>
               
    )
}