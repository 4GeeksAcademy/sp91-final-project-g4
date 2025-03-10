import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { toast } from "react-toastify";

export const OrderCustomerDetail = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const order = location.state?.order;

    const [selectedProvider, setSelectedProvider] = useState(""); // Estado para el proveedor seleccionado

    if (!order) {
        return <p>No hay detalles disponibles.</p>;
    }

    const handleSubmitEdit = (event) => {
        event.preventDefault();

        if (!selectedProvider) {
            toast.error("Por favor, selecciona un proveedor antes de continuar.");
            return;
        }
        const dataToSend = {
            ...order,
            provider_id: selectedProvider,
        };
        actions.updateOrderProvider(order.id, dataToSend);
    };

    return (
        <div className="container-fluid p-0">
            <header className="container-fluid bg-secondary text-white text-center py-5">
                <h1 className="display-4">DETALLE DEL PEDIDO</h1>
            </header>
            <section className="container py-5">
                <div className="">
                    <div className="mb-3 border-bottom">
                            <p><strong>Cliente:</strong> {order.customerCompanyName} | <strong>Contacto:</strong> {order.customerContact}</p>
                            <p><strong>Fecha:</strong> {order.order_created_date}</p>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Pedido: {order.id}</h6>
                    <span className="badge bg-success">{order.status_order}</span>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card p-3 mb-3">
                            <h5 className="btn btn-info disabled rounded text-center">ORIGEN</h5>
                            <label>Localidad</label>
                            <input type="text" className="form-control" value={order.origin} readOnly />
                            <label>Comunidad Autónoma</label>
                            <input type="text" className="form-control" value={order.regionOrigin || "N/A"} readOnly />
                            <label>C.P</label>
                            <input type="text" className="form-control" value={order.origin_zip || "N/A"} readOnly />
                            <label>Empresa</label>
                            <input type="text" className="form-control" value={order.customerCompanyName} readOnly />
                            <label>Contacto</label>
                            <input type="text" className="form-control" value={order.customerContactName} readOnly />
                            <label>Teléfono Contacto</label>
                            <input type="text" className="form-control" value={order.customerPhone || "N/A"} readOnly />
                            <label>Fecha de aceptación del pedido</label>
                            <input className="form-control" value={order.order_created_date} readOnly />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card p-3">
                            <h5 className="btn btn-success disabled rounded text-center">DESTINO</h5>
                            <label>Localidad</label>
                            <input type="text" className="form-control" value={order.destination} readOnly />
                            <label>Comunidad Autónoma</label>
                            <input type="text" className="form-control" value={order.regionDestiny || "N/A"} readOnly />
                            <label>C.P</label>
                            <input type="text" className="form-control" value={order.destiny_zip || "N/A"} readOnly />
                            <label>Empresa</label>
                            <input type="text" className="form-control" value={order.providerCompanyName} readOnly />
                            <label>Contacto</label>
                            <input type="text" className="form-control" value={order.providerContactName} readOnly />
                            <label>Teléfono Contacto</label>
                            <input type="text" className="form-control" value={order.providerPhone || "N/A"} readOnly />
                            <label>Fecha Estimada Entrega</label>
                            <input className="form-control" value={order.estimated_date_end} readOnly />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card p-3 mb-3">
                            <h5 className="btn btn-secondary disabled rounded text-center">TARIFA</h5>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>Kilómetros</td>
                                        <td>{order.distance_km || "N/A"} km</td>
                                    </tr>
                                    <tr>
                                        <td>Tarifa base</td>
                                        <td>{order.cust_base_tariff || "N/A"} €/km</td>
                                    </tr>
                                    <tr>
                                        <td>Traslado: {order.origin} - {order.destination}</td>
                                        <td>{order.final_cost || "N/A"} €</td>
                                    </tr>
                                    <tr>
                                        <td>Suplemento tipo de vehículo</td>
                                        <td>{order.corrector_cost || "0"} €</td>
                                    </tr>
                                    <tr className="table-success">
                                        <td><strong>TARIFA (IVA no incluido)</strong></td>
                                        <td><strong>{order.final_cost || "N/A"} €</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Nuevo formulario para asignar proveedor */}
                        <form onSubmit={handleSubmitEdit}>
                            <div className="card p-3 mb-3">
                                <h6>Asignar Traslado a Proveedor</h6>
                                <label htmlFor="providerSelect">Selecciona un proveedor:</label>
                                <select
                                    id="providerSelect"
                                    className="form-select"
                                    value={selectedProvider}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                >
                                    <option value="">Selecciona un proveedor</option>
                                    {store.providers.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.company_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-primary">
                                    Asignar Traslado
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-3">
                    <h6>Observaciones proveedor</h6>
                    <textarea className="form-control" rows="3" readOnly value={order.comment}></textarea>
                </div>
            </section>

        </div>
    );
};
