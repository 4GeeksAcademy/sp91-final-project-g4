import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const CustomerOrders = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    // Aquí obtenemos el ID del cliente actual desde el store (asegúrate de que esté disponible)
    const currentCustomerId = store.currentUser?.id; // Suponiendo que el cliente está guardado en store.currentUser

    const handleViewDetails = (order) => {
        navigate("/admin/order-customer-detail", { state: { order } });
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
            // Filtramos los pedidos para que solo vea los del cliente actual
            const filteredOrders = store.orders.filter(order => order.customer_id === currentCustomerId);

            const combinedData = filteredOrders.map((order) => {
                const customer = store.customers.find((customer) => customer.id === order.customer_id);
                const provider = store.providers.find((provider) => provider.id === order.provider_id);
                const vehicle = store.vehicles.find((vehicle) => vehicle.id === order.vehicle_id);
                const originLocation = store.locations.find((location) => location.id === order.origin_id);
                const destinationLocation = store.locations.find((location) => location.id === order.destiny_id);

                return {
                    ...order,
                    customerCompanyName: customer ? customer.company_name : "Desconocido",
                    customerContactName: customer ? customer.contact_name : "Desconocido",
                    customerPhone: customer ? customer.phone : "Desconocido",
                    providerPhone: provider ? provider.phone : "Desconocido",
                    providerCompanyName: provider ? provider.company_name : "Pendiente de asignar",
                    providerContactName: provider ? provider.contact_name : "Pendiente de asignar",
                    customerContact: customer ? customer.contact_name : "Desconocido",
                    providerContact: provider ? provider.contact_name : "Desconocido",
                    model: vehicle ? vehicle.model : "Desconocido",
                    brand: vehicle ? vehicle.brand : "Desconocido",
                    origin: originLocation ? originLocation.city : "Desconocido",
                    origin_zip: originLocation ? originLocation.postal_code : "Desconocido",
                    destiny_zip: destinationLocation ? destinationLocation.postal_code : "Desconocido",
                    destination: destinationLocation ? destinationLocation.city : "Desconocido",
                    regionOrigin: originLocation ? originLocation.region : "Desconocido",
                    regionDestiny: destinationLocation ? destinationLocation.region : "Desconocido",
                };
            });

            setOrdersData(combinedData);
        }
    }, [store.orders, store.customers, store.providers, store.vehicles, store.locations, currentCustomerId]);

    return (
        <div className="container-fluid p-0">
            <header className="bg-secondary text-white text-center py-5">
                <h1 className="display-4">Pedidos de clientes</h1>
                <p className="lead">Gestión de pedidos y consulta de información</p>
            </header>
            <div className="container-fluid">
                <div className="container my-2 pb-5">
                    <div className="d-flex justify-content-between mx-3 ">
                        <h1 className="text-secondary my-4">Pedidos de clientes</h1>
                        {/* El botón de "Añadir pedido" solo se muestra a los administradores o usuarios con permisos especiales */}
                        {store.currentUser?.role === "admin" && (
                            <button
                                type="button"
                                className="btn btn-success my-4"
                                onClick={() => navigate("/admin/add-order-customer")}>
                                Añadir pedido cliente
                            </button>
                        )}
                    </div>
                    <div className="container">
                        <table className="table table-info">
                            <thead>
                                <tr>
                                    <th scope="col">Fecha de pedido</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Proveedor</th>
                                    <th scope="col">Fecha estimada de entrega</th>
                                    <th scope="col">Origen</th>
                                    <th scope="col">Destino</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Modelo</th>
                                    <th scope="col">Matrícula</th>
                                    <th scope="col">Estado del pedido</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersData.map((order) => (
                                    <tr key={order.id} className="table-light">
                                        <td>{order.customerCompanyName}</td>
                                        <td>{order.providerCompanyName}</td>
                                        <td>{order.order_created_date}</td>
                                        <td>{order.estimated_date_end}</td>
                                        <td>{order.origin}</td>
                                        <td>{order.destination}</td>
                                        <td>{order.brand}</td>
                                        <td>{order.model}</td>
                                        <td>{order.plate}</td>
                                        <td>{order.status_order}</td>
                                        <td>
                                            <button onClick={() => handleViewDetails(order)} type="button" className="btn btn-secondary me-4">
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

