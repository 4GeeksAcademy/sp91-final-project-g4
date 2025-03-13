import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { AddCustomerUserModal } from "../pages/AddCustomerUserModal.jsx";

export const CustomerProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (store.user.id && store.token) {
                await actions.getUser(store.user.id);

                if (store.user.role === "customer") {
                    await actions.getCustomers(store.user.id); // 🔹 Carga solo los usuarios de este cliente
                }

                setLoading(false);
            }
        };

        fetchData();
    }, [store.user.id, store.token]);


    if (loading) {
        return <div className="text-center mt-5">Cargando...</div>;
    }

    return (
        <div className="container-fluid p-0">
            <header className="bg-secondary text-white text-center py-5">
                <h1 className="display-4">Perfil de Cliente</h1>
                <p className="lead">Gestión de datos personales y de usuarios asociados</p>
            </header>

            <div className="container mt-5">
                <div className="card p-4 shadow">
                    <h1 className="h3 fw-bold text-center my-2">Mis Datos</h1>
                    <form>
                        <div className="form-floating my-3">
                            <input type="text" className="form-control" placeholder="Nombre"
                                value={store.user.name || ""} disabled />
                            <label>Nombre</label>
                        </div>
                        <div className="form-floating my-3">
                            <input type="text" className="form-control" placeholder="Apellidos"
                                value={store.user.last_name || ""} disabled />
                            <label>Apellidos</label>
                        </div>
                        <div className="form-floating my-3">
                            <input type="email" className="form-control" placeholder="Email"
                                value={store.user.email || ""} disabled />
                            <label>Email</label>
                        </div>
                        <div className="form-floating my-3">
                            <input type="phone" className="form-control" placeholder="Teléfono"
                                value={store.user.phone || ""} disabled />
                            <label>Teléfono</label>
                        </div>
                        <div className="form-floating my-3">
                            <select className="form-select" disabled>
                                <option value="customer">Cliente</option>
                            </select>
                            <label>Tipo de usuario</label>
                        </div>
                    </form>
                </div>

                {/* ✅ Tabla de Usuarios Asociados debajo de Mis Datos */}
                {store.user.role === "customer" && (
                    <div className="card p-4 mt-4 shadow">
                        <h2 className="h4 text-secondary text-center">Usuarios Asociados</h2>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary w-100 my-3">
                            Añadir Usuario
                        </button>
                        <table className="table table-info">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.customers.length > 0 ? (
                                    store.customers.map((user) => (
                                        <tr key={user.id} className="table-light">
                                            <td>{user.name} {user.last_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.is_active ? "Activo" : "Inactivo"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" className="text-center">No hay usuarios asociados.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal para añadir usuario asociado */}
                <AddCustomerUserModal show={showModal} onClose={() => setShowModal(false)} />
            </div>
        </div>
    );
};

