import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Alert } from "../component/Alert.jsx";

export const OrderProvider = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const handleViewDetails = (order) => {
        navigate("/admin/order-provider-detail", { state: { order } });
    };

    const handleAddOrder = (order) => {
        navigate("/admin/add-order-provider", { state: { order } });
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
        actions.setAlert({ text: '', background: 'primary', visible: false });

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
                    origin_zip: originLocation ? originLocation.postal_code: "Desconocido",
                    destiny_zip: destinationLocation ? destinationLocation.postal_code: "Desconocido",
                    destination: destinationLocation ? destinationLocation.city : "Desconocido",
                    regionOrigin: originLocation ? originLocation.region : "Desconocido",
                    regionDestiny: destinationLocation ? destinationLocation.region : "Desconocido",
                };
            });
    
            setOrdersData(combinedData);
        }
    }, [store.orders, store.customers, store.providers, store.vehicles, store.locations]);
    


    return (
        <div className="container-fluid">
            <div className="container my-2 pb-5">
                <div className="d-flex justify-content-between mx-3 ">
                    <h1 className="text-secondary my-4">Traslados de proveedores</h1>
                    <Link to="/add-provider">
                        <button type="button" className="btn btn-success my-4">
                            Añadir traslado de proveedor
                        </button>
                    </Link>
                </div>
                <div className="container">
                    <table className="table table-info">
                        <thead>
                            <tr>
                                <th scope="col">Proveedor</th>
                                <th scope="col">Fecha de pedido</th>
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
                            {/* Mapeamos los datos combinados de orders, customers, providers, vehicles y locations */}
                            {ordersData.map((order) => (
                                <tr key={order.id} className="table-light">
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
    );
};
