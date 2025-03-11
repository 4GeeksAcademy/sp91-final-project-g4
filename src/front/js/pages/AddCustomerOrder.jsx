import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Alert } from "../component/Alert.jsx";

export const AddCustomerOrder = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [customerId, setCustomerId] = useState("");
    const [originId, setOriginId] = useState("");
    const [destinyId, setDestinyId] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [plate, setPlate] = useState("");
    const [estimatedDate, setEstimatedDate] = useState("");
    const [distanceKm, setDistanceKm] = useState("--");
    const [baseTariff, setBaseTariff] = useState(null);
    const [correctorCost, setCorrectorCost] = useState(null);
    const [finalCost, setFinalCost] = useState(null);

    useEffect(() => {
        actions.getCustomers();
        actions.getLocations();
        actions.getVehicles();
    }, []);

    useEffect(() => {
        if (customerId) {
            const selectedCustomer = store.customers.find(cust => cust.id == customerId);
            if (selectedCustomer) setBaseTariff(parseFloat(selectedCustomer.cust_base_tariff).toFixed(2));
        }
    }, [customerId]);

    useEffect(() => {
        if (vehicleId) {
            const selectedVehicle = store.vehicles.find(veh => veh.id == vehicleId);
            if (selectedVehicle) setCorrectorCost(parseFloat(selectedVehicle.corrector_cost).toFixed(2));
        }
    }, [vehicleId]);

    useEffect(() => {
        if (originId && destinyId) {
            actions.getDistance(originId, destinyId).then(distance => {
                setDistanceKm(distance.toFixed(2));

                if (distance && baseTariff) {
                    setFinalCost(((distance * parseFloat(baseTariff)) + parseFloat(correctorCost)).toFixed(2));
                }
            });
        }
    }, [originId, destinyId, baseTariff, correctorCost]);

    const isFormValid = () => {
        return customerId && originId && destinyId && vehicleId && plate && estimatedDate;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            actions.setAlert({ text: "Todos los campos son obligatorios", background: "danger", visible: true });
            return;
        }

        const orderData = {
            customer_id: customerId,
            origin_id: originId,
            destiny_id: destinyId,
            vehicle_id: vehicleId,
            plate,
            estimated_date_end: estimatedDate,
        };

        const success = await actions.addOrder(orderData);
        if (success) navigate("/admin/orders-customers");
    };

    return (
        <div className="card container w-100 mt-5" style={{ maxWidth: 700, padding: '1rem' }}>
            <h1 className="h3 fw-bold text-center my-2">PEDIDO NUEVO</h1>
            <Alert />
            <form onSubmit={handleSubmit}>
                <label>Cliente</label>
                <select className="form-control" onChange={(e) => setCustomerId(e.target.value)} required>
                    <option value="">Seleccione un Cliente</option>
                    {store.customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.company_name}</option>
                    ))}
                </select>

                <div className="d-flex gap-2">
                    <div className="w-50">
                        <label>Origen</label>
                        <select className="form-control" onChange={(e) => setOriginId(e.target.value)} required>
                            <option value="">Seleccione un Origen</option>
                            {store.locations.map(location => (
                                <option key={location.id} value={location.id}>{location.city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-50">
                        <label>Destino</label>
                        <select className="form-control" onChange={(e) => setDestinyId(e.target.value)} required>
                            <option value="">Seleccione un Destino</option>
                            {store.locations.map(location => (
                                <option key={location.id} value={location.id}>{location.city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <label>Vehículo</label>
                <select className="form-control" onChange={(e) => setVehicleId(e.target.value)} required>
                    <option value="">Seleccione un Vehículo</option>
                    {store.vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model}</option>
                    ))}
                </select>

                <label>Matrícula</label>
                <input type="text" className="form-control" onChange={(e) => setPlate(e.target.value)} required />

                <label>Fecha Estimada de Entrega</label>
                <input type="date" className="form-control" onChange={(e) => setEstimatedDate(e.target.value)} required />

                <div className="tarifa mt-3 p-3 bg-light">
                    <h5>Tarifa Estimada</h5>
                    <p>Kilómetros: <b>{distanceKm !== "--" ? `${distanceKm} km` : "-- km"}</b></p>
                    <p>Tarifa Base: <b>{baseTariff !== null ? `${baseTariff}€/km` : "-- €/km"}</b></p>
                    <p>Suplemento vehículo: <b>{correctorCost !== null ? `${correctorCost}€` : "-- €"}</b></p>
                    {finalCost !== null && (
                        <p><b>Total (IVA no incluido): {finalCost}€</b></p>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary my-3 w-100" 
                    disabled={!isFormValid()}
                >
                    CREAR PEDIDO
                </button>

                <button 
                    type="button" 
                    className="btn btn-secondary my-3 w-100" 
                    onClick={() => navigate("/admin/orders-customers")}
                >
                    CANCELAR
                </button>
            </form>
        </div>
    );
};
