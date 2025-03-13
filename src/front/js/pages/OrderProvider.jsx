import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const OrderProvider = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const handleViewDetails = (order) => {
        navigate("/admin/order-provider-detail", { state: { order } });
    };

    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await actions.getCustomers();
            await actions.getProviders();
            await actions.getOrders();
            await actions.getVehicles();
            await actions.getLocations();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (
            store.orders &&
            store.orders.length > 0 &&
            store.customers &&
            store.customers.length > 0 &&
            store.providers &&
            store.providers.length > 0 &&
            store.vehicles &&
            store.vehicles.length > 0 &&
            store.locations &&
            store.locations.length > 0
        ) {
            const combinedData = store.orders.map((order) => {
               // .filter(order => order.provider_id !== null) DESCOMENTAR CUANDO FUNCIONE
                const provider = store.providers.find((provider) => provider.id === order.provider_id);
                const customer = store.customers.find((customer) => customer.id === order.customer_id);
                const vehicle = store.vehicles.find((vehicle) => vehicle.id === order.vehicle_id);
                const originLocation = store.locations.find((location) => location.id === order.origin_id);
                const destinationLocation = store.locations.find((location) => location.id === order.destiny_id);

                let formattedStatus;
                let statusClass;

                switch (order.status_order) {
                    case "Order created":
                        formattedStatus = "Pendiente de asignar";
                        statusClass = "text-warning";
                        break;
                    case "Order accepted":
                        formattedStatus = "Orden asignada";
                        statusClass = "text-primary";
                        break;
                    case "Cancel":
                        formattedStatus = "Orden Cancelada";
                        statusClass = "text-danger";
                        break;
                    default:
                        formattedStatus = order.status_order;
                        statusClass = "";
                }

                return {
                    ...order,
                    orderCreatedDate: order.order_created_date
                        ? new Date(order.order_created_date).toLocaleDateString()
                        : "Desconocido",
                    providerCompanyName: provider ? provider.company_name : "No asignado",
                    providerContactName: provider ? provider.contact_name : "N/A",
                    providerPhone: provider ? provider.phone : "N/A",
                    customerCompanyName: customer ? customer.company_name : "Desconocido",
                    model: vehicle ? vehicle.model : "Desconocido",
                    brand: vehicle ? vehicle.brand : "Desconocido",
                    origin: originLocation ? originLocation.city : "Desconocido",
                    originRegion: originLocation ? originLocation.region : "Desconocido",
                    destination: destinationLocation ? destinationLocation.city : "Desconocido",
                    destinyRegion: destinationLocation ? destinationLocation.region : "Desconocido",
                    statusOrder: formattedStatus,
                    statusClass: statusClass,
                };
            });

            setOrdersData(combinedData);
        }
    }, [store.orders, store.customers, store.providers, store.vehicles, store.locations]);

    return (
        <div className="container-fluid p-0">
            <header className="bg-secondary text-white text-center py-5">
                <h1 className="display-4">Traslados de Proveedores</h1>
                <p className="lead">Gestión de traslados de proveedores y consulta de información</p>
            </header>
            <div className="container-fluid">
                <div className="container my-2 pb-5">
                    <div className="d-flex justify-content-between mx-3">
                        <h1 className="text-secondary my-4">Listado de Traslados</h1>
                    </div>
                    <div className="container">
                        <table className="table table-info">
                            <thead>
                                <tr>
                                    <th scope="col">Fecha de pedido</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Proveedor</th>
                                    <th scope="col">Origen</th>
                                    <th scope="col">Destino</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Modelo</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersData.map((order) => (
                                    <tr key={order.id} className="table-light">
                                        <td>{order.orderCreatedDate}</td>
                                        <td>{order.customerCompanyName}</td>
                                        <td>{order.providerCompanyName}</td>
                                        <td>{order.origin}</td>
                                        <td>{order.destination}</td>
                                        <td>{order.brand}</td>
                                        <td>{order.model}</td>
                                        <td className={order.statusClass}>{order.statusOrder}</td>
                                        <td>
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                type="button"
                                                className="btn btn-secondary me-4"
                                            >
                                                <i className="fa-solid fa-magnifying-glass-plus"></i>
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
};

