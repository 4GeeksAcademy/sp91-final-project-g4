import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { toast } from "react-toastify";

export const CustomerOrderDetail = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const order = location.state?.order;

    const [selectedProvider, setSelectedProvider] = useState(order.provider_id || "");
    const [observations, setObservations] = useState("");
    const [orderStatus, setOrderStatus] = useState(order.status_order);
    const [isProviderAssigned, setIsProviderAssigned] = useState(!!order.provider_id);

    useEffect(() => {
        actions.getProviders();
    }, []);

    if (!order) {
        return <p>No hay detalles disponibles.</p>;
    }

    // ✅ Cancelar pedido y actualizar el estado
    const handleCancelOrder = async () => {
        const success = await actions.cancelOrder(order.id);
        if (success) {
            setOrderStatus("Cancel");
            toast.success("Orden cancelada correctamente.");
            await actions.getOrders(); // ✅ Actualiza la lista de pedidos
        } else {
            toast.error("Error al cancelar la orden.");
        }
    };

    // ✅ Asignar proveedor y actualizar la lista de traslados y pedidos
    const handleAssignProvider = async () => {
        if (!selectedProvider) {
            toast.error("Selecciona un proveedor antes de asignar.");
            return;
        }

        const success = await actions.assignProvider(order.id, selectedProvider, observations);
        if (success) {
            setOrderStatus("Order accepted");
            setIsProviderAssigned(true);
            await actions.getOrders(); // ✅ Actualiza la lista de pedidos de clientes
            await actions.getProviderOrders(); // ✅ Asegura que la orden aparece en traslados de proveedores
            toast.success("Proveedor asignado correctamente.");
            navigate("/customer-orders"); // ✅ Redirigir a la lista de pedidos de clientes
        } else {
            toast.error("Error al asignar el proveedor.");
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

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button className="btn btn-primary" onClick={() => navigate("/customer-orders")}>
                        Volver a Pedidos de Cliente
                    </button>
                    <span className={`badge ${orderStatus === "Cancel" ? "bg-danger" : (orderStatus === "Order accepted" ? "bg-primary" : "bg-success")}`}>
                        {orderStatus === "Cancel" ? "Orden Cancelada" : (orderStatus === "Order accepted" ? "Orden Aceptada" : orderStatus)}
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
                            <label>Contacto Origen</label>
                            <input type="text" className="form-control" value={order.origin_contact || "N/A"} readOnly />
                            <label>Teléfono Origen</label>
                            <input type="text" className="form-control" value={order.origin_phone || "N/A"} readOnly />
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
                                        <td>Tarifa base</td>
                                        <td>{order.cust_base_tariff ? order.cust_base_tariff.toFixed(2) : "N/A"} €/km</td>
                                    </tr>
                                    <tr>
                                        <td>Traslado: {order.origin} - {order.destination}</td>
                                        <td>{order.final_cost ? order.final_cost.toFixed(2) : "N/A"} €</td>
                                    </tr>
                                    <tr>
                                        <td>Suplemento tipo de vehículo</td>
                                        <td>{order.corrector_cost ? order.corrector_cost.toFixed(2) : "0.00"} €</td>
                                    </tr>
                                    <tr className="table-success">
                                        <td><strong>TARIFA (IVA no incluido)</strong></td>
                                        <td><strong>{order.final_cost ? order.final_cost.toFixed(2) : "N/A"} €</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* 🔴 Botón de cancelar pedido (lo agregamos aquí dentro) */}
                            {orderStatus !== "Cancel" && (
                                <button className="btn btn-danger mt-3 w-100" onClick={handleCancelOrder}>
                                    Cancelar Pedido
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
