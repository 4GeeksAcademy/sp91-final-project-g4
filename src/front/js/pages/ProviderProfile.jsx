import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProviderProfile = () => {
    const { store, actions } = useContext(Context);
    const currentProvider = store.currentProvider;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;  // Bandera para saber si el componente sigue montado.

        const fetchData = async () => {
            if (store.user?.provider_id) {
                // Usamos el provider_id del usuario para obtener el proveedor
                await actions.getProviderById(store.user.provider_id); 
                if (isMounted) {
                    setLoading(false);  // Solo actualizamos el estado si el componente sigue montado.
                }
            } else {
                if (isMounted) {
                    setLoading(false); // Si no hay provider_id, terminamos la carga
                }
            }
        };

        fetchData();

        // Cleanup function que se ejecutará cuando el componente se desmonte.
        return () => {
            isMounted = false;
        };
    }, [store.user?.provider_id, actions]); // Dependemos del provider_id del usuario para obtener el proveedor correcto

    const handleEdit = () => {
        actions.setCurrentProvider(store.provider);
        navigate("/edit-provider-user");
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando...</div>;
    }

    return (
        <div className="container-fluid p-0">
            <header className="bg-secondary text-white text-center py-5">
                <h1 className="display-4">Perfil de Usuario</h1>
                <p className="lead">Gestión de datos del proveedor y usuario</p>
            </header>

            <div className="container mt-5">
                <div className="card p-4 shadow">
                    <h1 className="h3 fw-bold text-center my-2">Mis Datos del Usuario</h1>
                    <form>
                        {/* Información del usuario */}
                        <div className="form-floating my-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                value={store.user?.name || ""}
                                disabled
                            />
                            <label>Nombre</label>
                        </div>
                        <div className="form-floating my-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Apellidos"
                                value={store.user?.last_name || ""}
                                disabled
                            />
                            <label>Apellidos</label>
                        </div>
                        <div className="form-floating my-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={store.user?.email || ""}
                                disabled
                            />
                            <label>Email</label>
                        </div>
                        <div className="form-floating my-3">
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Teléfono"
                                value={store.user?.phone || ""}
                                disabled
                            />
                            <label>Teléfono</label>
                        </div>
                        <button onClick={handleEdit} className="btn btn-warning w-100">
                            Editar Datos
                        </button>
                    </form>
                </div>

                {/* Mostrar el proveedor al que pertenece el usuario */}
                <div className="card p-4 mt-4 shadow">
                    <h2 className="h4 text-secondary text-center">Proveedor al que pertenece</h2>
                    <table className="table table-info">
                        <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Persona de contacto</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Tarifa aplicada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProvider ? (
                                <tr className="table-light">
                                    <td>{currentProvider.company_name}</td>
                                    <td>{currentProvider.contact_name}</td>
                                    <td>{currentProvider.phone}</td>
                                    <td>{currentProvider.address}</td>
                                    <td>{currentProvider.prov_base_tariff}</td>
                                </tr>
                            ) : (
                                <tr><td colSpan="5" className="text-center">No hay datos de proveedor disponibles.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
