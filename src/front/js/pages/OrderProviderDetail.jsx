import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { toast } from "react-toastify";

export const OrderProviderDetail = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const order = location.state?.order;

    const [orderStatus, setOrderStatus] = useState(order.status_order);
    const [providerTariff, setProviderTariff] = useState(order.final_cost || 0);

    useEffect(() => {
        actions.getProviders();
        calculateProviderTariff();
    }, []);

    if (!order) {
        return <p>No hay detalles disponibles.</p>;
    }

    // ✅ Calcula la tarifa del proveedor basado en la distancia
    const calculateProviderTariff = () => {
        const provider = store.providers.find(p => p.id === order.provider_id);
        if (provider) {
            const newCost = (provider.prov_base_tariff * order.distance_km) + (order.corrector_cost || 0);
            setProviderTariff(newCost.toFixed(2));
        }
    };

    // ✅ Función para actualizar el estado (Recogido -> Entregado)
    const handleStatusChange = async () => {
        let newStatus = orderStatus === "Init" ? "Delivered" : "Init";
        const success = await actions.updateOrderStatus(order.id, newStatus);
        if (success) {
            setOrderStatus(newStatus);
            toast.success(`Estado cambiado a ${newStatus === "Init" ? "Recogido" : "Entregado"}`);
        } else {
            toast.error("Error al actualizar el estado.");
        }
    };

    return (
        <div className="container-fluid p-0">
            <header className="container-fluid bg-secondary text-white text-center py-3">
                <h1 className="display-6">DETALLE DEL TRASLADO</h1>
            </header>
            <section className="container py-5">
                <div className="mb-3 border-bottom">
                    <p><strong>Cliente:</strong> AutoGeek Logistic | <strong>Contacto:</strong> 4Geeks</p>
                    <p><strong>Fecha:</strong> {order.order_created_date}</p>
                </div>

                {/* 🔹 Botón de Volver a Traslados de Proveedores */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button className="btn btn-primary" onClick={() => navigate("/admin/orders-providers")}>
                        Volver a Traslados de Proveedores
                    </button>
                    
                    {/* 🔹 Estado del pedido */}
                    <span className={`badge ${orderStatus === "Delivered" ? "bg-success" : "bg-warning"}`}>
                        {orderStatus === "Delivered" ? "Entregado" : "Recogido"}
                    </span>
                </div>

                <div className="row">
                    {/* 🔹 SECCIÓN ORIGEN */}
                    <div className="col-md-6">
                        <div className="card p-3 mb-3">
                            <h5 className="btn btn-info disabled rounded text-center">ORIGEN</h5>
                            <label>Localidad</label>
                            <input type="text" className="form-control" value={order.origin} readOnly />
                            <label>Comunidad Autónoma</label>
                            <input type="text" className="form-control" value={order.origin_region || "N/A"} readOnly />
                            <label>C.P</label>
                            <input type="text" className="form-control" value={order.origin_zip || "N/A"} readOnly />
                            <label>Contacto Origen</label>
                            <input type="text" className="form-control" value={order.origin_contact || "N/A"} readOnly />
                            <label>Teléfono Origen</label>
                            <input type="text" className="form-control" value={order.origin_phone || "N/A"} readOnly />
                            <label>Fecha de aceptación del pedido</label>
                            <input className="form-control" value={order.order_created_date} readOnly />
                        </div>
                    </div>

                    {/* 🔹 SECCIÓN DESTINO */}
                    <div className="col-md-6">
                        <div className="card p-3">
                            <h5 className="btn btn-success disabled rounded text-center">DESTINO</h5>
                            <label>Localidad</label>
                            <input type="text" className="form-control" value={order.destination} readOnly />
                            <label>Comunidad Autónoma</label>
                            <input type="text" className="form-control" value={order.destiny_region || "N/A"} readOnly />
                            <label>C.P</label>
                            <input type="text" className="form-control" value={order.destiny_zip || "N/A"} readOnly />
                            <label>Contacto Destino</label>
                            <input type="text" className="form-control" value={order.destiny_contact || "N/A"} readOnly />
                            <label>Teléfono Destino</label>
                            <input type="text" className="form-control" value={order.destiny_phone || "N/A"} readOnly />
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
                                        <td>{order.distance_km ? order.distance_km.toFixed(2) : "N/A"} km</td>
                                    </tr>
                                    <tr>
                                        <td>Tarifa base del proveedor</td>
                                        <td>{providerTariff} €</td>
                                    </tr>
                                    <tr>
                                        <td>Traslado: {order.origin} - {order.destination}</td>
                                        <td>{providerTariff} €</td>
                                    </tr>
                                    <tr>
                                        <td>Suplemento tipo de vehículo</td>
                                        <td>{order.corrector_cost ? order.corrector_cost.toFixed(2) : "0.00"} €</td>
                                    </tr>
                                    <tr className="table-success">
                                        <td><strong>TARIFA FINAL</strong></td>
                                        <td><strong>{providerTariff} €</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 🔹 Observaciones del Proveedor */}
                <div className="card p-3 mb-3">
                    <h6>Observaciones proveedor</h6>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={order.comment || ""}
                        readOnly
                    ></textarea>
                </div>

                {/* 🔹 Botón de Recogido/Entregado */}
                <div className="card p-3 text-center">
                    <button
                        className={`btn ${orderStatus === "Init" ? "btn-success" : "btn-primary"} w-100`}
                        onClick={handleStatusChange}
                    >
                        {orderStatus === "Init" ? "Marcar como Entregado" : "Marcar como Recogido"}
                    </button>
                </div>
            </section>
        </div>
    );
};
