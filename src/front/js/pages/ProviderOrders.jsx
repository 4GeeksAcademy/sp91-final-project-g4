import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProviderOrders = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const handleViewDetails = (order) => {
    navigate("/provider-order-detail", { state: { order } });
  };


  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamar al backend para obtener solo las órdenes del proveedor actual
        await actions.getOrders(); // Asegúrate de que `actions.getOrders()` esté obteniendo las órdenes del proveedor logueado
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (store.orders && store.orders.length > 0) {
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
          providerPhone: provider ? provider.phone : "Desconocido",
          providerCompanyName: store.provider ? store.provider.company_name : "Pendiente de asignar",
          providerContactName: provider ? provider.contact_name : "Pendiente de asignar",
          model: vehicle ? vehicle.model : "Desconocido",
          brand: vehicle ? vehicle.brand : "Desconocido",
          origin: order.origin_city ? order.origin_city : "Desconocido",
          destination: order.destiny_city ? order.destiny_city : "Desconocido",
        };
      });

      setOrdersData(combinedData);
    }
  }, [store.orders, store.customers, store.providers, store.vehicles, store.locations]);

  return (
    <div className="container-fluid p-0">
      <header className="bg-secondary text-white text-center py-5">
        <h1 className="display-4">Traslados</h1>
        <p className="lead">Gestión de traslados de proveedores y consulta de información</p>
      </header>

      <div className="container-fluid">
        <div className="container my-2 pb-5">
          <div className="d-flex justify-content-between mx-3">
            <h1 className="text-secondary my-4">Traslados de proveedores</h1>
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
                </tr>
              </thead>
              <tbody>
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
