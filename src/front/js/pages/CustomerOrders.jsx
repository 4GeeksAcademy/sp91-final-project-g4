import React, { useState, useEffect } from "react";

export const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulamos una llamada API para obtener los pedidos.
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);

  // Función para filtrar pedidos por el término de búsqueda
  const filteredOrders = orders.filter(
    (order) =>
      order.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.originLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para traducir los estados
  const translateStatus = (status) => {
    switch (status) {
      case "Order created":
        return "Orden creada";
      case "Order accepted":
        return "Orden aceptada";
      case "In transit":
        return "En tránsito";
      case "Delivered":
        return "Entregado";
      case "Cancel":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div className="container-fluid p-0">
      <header className="bg-secondary text-white text-center py-5">
        <h1 className="display-4">Mis Pedidos</h1>
        <p className="lead">Consulta el estado de tus pedidos</p>
      </header>

      <section className="container py-5">
        <h2 className="text-center mb-4">Listado de Pedidos</h2>
        <div className="row mb-3">
          <div className="col-md-6 offset-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por vehículo, origen, destino o estado"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="alert alert-info text-center">
            Aún no hay pedidos realizados.
          </div>
        ) : (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.vehicleName}</td>
                  <td>{order.originLocation}</td>
                  <td>{order.destinationLocation}</td>
                  <td>{translateStatus(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};
