import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const AddCustomerOrder = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddres] = useState("");
    const [custBaseTariff, setcustBaseTariff] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [originLocation, setOriginLocation] = useState("");
    const [destinationLocation, setDestinationLocation] = useState("");

    useEffect(() => {
        if (store.vehicles && store.locations) {
            setSelectedVehicle(store.vehicles[0]?.id || "");
            setOriginLocation(store.locations[0]?.id || "");
            setDestinationLocation(store.locations[0]?.id || "");
        }
    }, [store.vehicles, store.locations]);

    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const dataToSend = {
            company_name: companyName,
            contact_name: contactName,
            phone,
            address,
            cust_base_tariff: custBaseTariff,
            vehicle_id: selectedVehicle,
            origin_id: originLocation,
            destiny_id: destinationLocation,
        };
        actions.addCustomer(dataToSend);
        navigate("/admin/customers");
    };

    return (
        <div className="container-fluid p-0">
            <header className="bg-secondary text-white text-center py-5">
                <h1 className="display-4">Nueva orden Cliente</h1>
                <p className="lead">Gestión de pedidos y consulta de información</p>
            </header>

            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow-sm" style={{ maxWidth: "600px", width: "100%", padding: "1.5rem" }}>
                    <h3 className="text-center mb-4">Formulario de Nuevo Pedido</h3>
                    <form onSubmit={handleSubmitAdd}>
                        <div className="form-group mb-3">
                            <label htmlFor="companyName" className="form-label">Nombre de la empresa</label>
                            <input
                                type="text"
                                className="form-control"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Nombre de la empresa"
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="contactName" className="form-label">Nombre del contacto</label>
                            <input
                                type="text"
                                className="form-control"
                                id="contactName"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Nombre del contacto"
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="phone" className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Número de teléfono"
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="address" className="form-label">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                value={address}
                                onChange={(e) => setAddres(e.target.value)}
                                placeholder="Dirección"
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="vehicle" className="form-label">Selecciona tu Vehículo</label>
                            <select
                                className="form-select"
                                id="vehicle"
                                value={selectedVehicle}
                                onChange={(e) => setSelectedVehicle(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un vehículo</option>
                                {store.vehicles.map((vehiculo) => (
                                    <option key={vehiculo.id} value={vehiculo.id}>
                                        {vehiculo.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="origin" className="form-label">Selecciona la localidad de origen</label>
                            <select
                                className="form-select"
                                id="origin"
                                value={originLocation}
                                onChange={(e) => setOriginLocation(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una localidad</option>
                                {store.locations.map((localidad) => (
                                    <option key={localidad.id} value={localidad.id}>
                                        {localidad.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="destination" className="form-label">Selecciona la localidad de destino</label>
                            <select
                                className="form-select"
                                id="destination"
                                value={destinationLocation}
                                onChange={(e) => setDestinationLocation(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una localidad</option>
                                {store.locations.map((localidad) => (
                                    <option key={localidad.id} value={localidad.id}>
                                        {localidad.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="custBaseTariff" className="form-label">Tarifa Estimada</label>
                            <div className="alert alert-info">
                                {custBaseTariff !== null
                                    ? `La tarifa estimada es: €${custBaseTariff}`
                                    : "Por favor, selecciona un vehículo y localidades para calcular la tarifa."}
                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-50">Crear Pedido</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
