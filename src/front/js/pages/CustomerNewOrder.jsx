import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const CustomerNewOrder = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [tarifa, setTarifa] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Aquí puedes obtener los vehículos y localidades desde tu API o contexto.
    // Por ejemplo, si tienes una función fetchData para obtenerlos desde la API:

    // Obtener vehículos
    fetch("/api/vehiculos")
      .then((response) => response.json())
      .then((data) => setVehiculos(data));

    // Obtener localidades
    fetch("/api/localidades")
      .then((response) => response.json())
      .then((data) => setLocalidades(data));
  }, []);

  // Calcular la tarifa
  useEffect(() => {
    if (selectedVehicle && originLocation && destinationLocation) {
      // Suponiendo que la tarifa depende del vehículo y la distancia entre localidades.
      const calculateTariff = () => {
        const distancia = calculateDistance(originLocation, destinationLocation);
        const vehicleRate = getVehicleRate(selectedVehicle);
        return vehicleRate * distancia;
      };

      setTarifa(calculateTariff());
    }
  }, [selectedVehicle, originLocation, destinationLocation]);

  // Función para obtener la tarifa dependiendo del vehículo
  const getVehicleRate = (vehicleId) => {
    const vehicle = vehiculos.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.tarifa : 0;
  };

  // Función para calcular la distancia entre dos localidades (ejemplo simple)
  const calculateDistance = (origin, destination) => {
    // Aquí debería ir la lógica para calcular la distancia real entre localidades
    // Esto podría hacerse con una API de mapas o alguna lógica de distancias predeterminadas
    return Math.abs(origin - destination); // Esto es solo un ejemplo.
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para crear el pedido con los datos seleccionados.
    console.log({
      vehicle: selectedVehicle,
      origin: originLocation,
      destination: destinationLocation,
      tarifa,
    });

    // Redirigir después de crear el pedido
    navigate("/cliente/pedidos");
  };

  return (
    <div className="container-fluid p-0">
      <header className="bg-secondary text-white text-center py-5">
        <h1 className="display-4">Crear Nuevo Pedido</h1>
        <p className="lead">Solicita el transporte de tu vehículo rápidamente.</p>
      </header>

      <section className="container py-5">
        <h2 className="text-center mb-4">Formulario de Nuevo Pedido</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="vehicle">Selecciona tu Vehículo</label>
                    <select
                      className="form-control"
                      id="vehicle"
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                    >
                      <option value="">Selecciona un vehículo</option>
                      {vehiculos.map((vehiculo) => (
                        <option key={vehiculo.id} value={vehiculo.id}>
                          {vehiculo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mt-3">
                    <label htmlFor="origin">Localidad de Origen</label>
                    <select
                      className="form-control"
                      id="origin"
                      value={originLocation}
                      onChange={(e) => setOriginLocation(e.target.value)}
                    >
                      <option value="">Selecciona una localidad</option>
                      {localidades.map((localidad) => (
                        <option key={localidad.id} value={localidad.id}>
                          {localidad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mt-3">
                    <label htmlFor="destination">Localidad de Destino</label>
                    <select
                      className="form-control"
                      id="destination"
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                    >
                      <option value="">Selecciona una localidad</option>
                      {localidades.map((localidad) => (
                        <option key={localidad.id} value={localidad.id}>
                          {localidad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mt-3">
                    <label>Tarifa Estimada:</label>
                    <div className="alert alert-info">
                      {tarifa !== null
                        ? `La tarifa estimada es: €${tarifa}`
                        : "Por favor, selecciona un vehículo y localidades para calcular la tarifa."}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary mt-3">
                    Crear Pedido
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
