import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { toast } from "react-toastify";

export const OrderCustomerDetail = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const order = location.state?.order;

    const [selectedProvider, setSelectedProvider] = useState("");
    const [observations, setObservations] = useState("");
    const [orderStatus, setOrderStatus] = useState(order.status_order);

    useEffect(() => {
        actions.getProviders();
    }, []);

    if (!order) {
        return <p>No hay detalles disponibles.</p>;
    }

    // ✅ Cancelar Pedido
    const handleCancelOrder = async () => {
        const success = await actions.cancelOrder(order.id);
        if (success) {
            setOrderStatus("Cancel");
        }
    };

    // ✅ Asignar Proveedor y Crear Traslado
    const handleAssignProvider = async () => {
        if (!selectedProvider) {
            toast.warning("Selecciona un proveedor antes de asignar.");
            return;
        }
    
        const success = await actions.assignProvider(order.id, selectedProvider, observations);
        if (success) {
            toast.success("Proveedor asignado correctamente.");
            await actions.getOrders(); // ✅ Asegurar que el store tenga la última versión de las órdenes
            navigate("/admin/orders-customers"); // ✅ Redirigir después de asignar
        } else {
            toast.error("Error al asignar el proveedor. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="container-fluid p-0">
            <header className="container-fluid bg-secondary text-white text-center py-3">
                <h1 className="display-6">DETALLE DEL PEDIDO</h1>
            </header>
            <section className="container py-5">
                <div className="mb-3 border-bottom">
                    <p><strong>Cliente:</strong> {order.customerCompanyName} | <strong>Fecha:</strong> {order.order_created_date}</p>
                </div>

                {/* 🔹 Botón de Volver a Pedidos de Cliente */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button className="btn btn-primary" onClick={() => navigate("/admin/orders-customers")}>
                        Volver a Pedidos de Cliente
                    </button>
                    <span className={`badge ${orderStatus === "Cancel" ? "bg-danger" : "bg-success"}`}>
                        {orderStatus === "Cancel"
                            ? "Orden Cancelada"
                            : orderStatus === "Order accepted"
                                ? "Orden asignada"
                                : orderStatus}
                    </span>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card p-3 mb-3">
                            <h5 className="btn btn-info disabled rounded text-center">ORIGEN</h5>
                            <label>Localidad</label>
                            <input type="text" className="form-control" value={order.origin} readOnly />
                            <label>Comunidad Autónoma</label>
                            <input type="text" className="form-control" value={order.origin_region || "N/A"} readOnly />
                            <label>C.P</label>
                            <input type="text" className="form-control" value={order.origin_zip || "N/A"} readOnly />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-3">
                            <h5 className="btn btn-success disabled rounded text-center">DESTINO</h5>
                            <label>Localidad</label>
                            <input type="text" className="form-control" value={order.destination} readOnly />
                            <label>Comunidad Autónoma</label>
                            <input type="text" className="form-control" value={order.destiny_region || "N/A"} readOnly />
                            <label>C.P</label>
                            <input type="text" className="form-control" value={order.destiny_zip || "N/A"} readOnly />
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
                                        <td>Tarifa base</td>
                                        <td>{order.cust_base_tariff ? order.cust_base_tariff.toFixed(2) : "N/A"} €/km</td>
                                    </tr>
                                    <tr>
                                        <td>Traslado: {order.origin} - {order.destination}</td>
                                        <td>{order.final_cost ? order.final_cost.toFixed(2) : "N/A"} €</td>
                                    </tr>
                                </tbody>
                            </table>
                            {orderStatus !== "Cancel" && (
                                <button className="btn btn-danger mt-3 w-100" onClick={handleCancelOrder}>
                                    Cancelar Pedido
                                </button>
                            )}
                        </div>

                        {/* 🔹 Asignar Traslado a Proveedor */}
                        <div className="card p-3">
                            <h6>Asignar Traslado a Proveedor</h6>
                            <select
                                className="form-control"
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value)}
                                disabled={orderStatus === "Cancel"}
                            >
                                <option value="">Seleccione un Proveedor</option>
                                {store.providers.map(provider => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.company_name}
                                    </option>
                                ))}
                            </select>
                            <label className="mt-3">Observaciones para el Proveedor</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                disabled={orderStatus === "Cancel"}
                            ></textarea>
                            <button
                                className="btn btn-primary mt-3 w-100"
                                onClick={handleAssignProvider}
                                disabled={orderStatus === "Cancel"}
                            >
                                Asignar Traslado
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};









