import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Alert } from "../component/Alert.jsx";
import { AddAdminModal } from "../pages/AddAdminModal.jsx";

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Estado para abrir/cerrar el modal

    useEffect(() => {
        const fetchData = async () => {
            if (store.user.id && store.token) {
                await actions.getUser(store.user.id);

                if (store.user.role === "admin") {
                    console.log("🟢 Usuario es admin, obteniendo administradores...");
                    await actions.getAdmins();
                }

                setLoading(false);
            }
        };

        fetchData();
    }, [store.user.id, store.token]);

    const handleEdit = () => {
        actions.setCurrentUser(store.user);
        navigate("/edit-user");
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Tarjeta de Mis Datos */}
                <div className="col-md-6">
                    <div className="card w-100 p-4 shadow">
                        <h1 className="h3 fw-bold text-center mb-3"> Mis Datos </h1>
                        <Alert />
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
                                <select className="form-select" id="floatingSelect" value={store.user.role || ""} disabled>
                                    <option value="admin">Administrador</option>
                                    <option value="customer">Cliente</option>
                                    <option value="provider">Proveedor</option>
                                </select>
                                <label>Tipo de usuario</label>
                            </div>
                            <button onClick={handleEdit} className="btn btn-warning w-100">Editar Datos</button>
                        </form>
                    </div>
                </div>

                {/* Tarjeta de Administradores */}
                {store.user.role === "admin" && (
                    <div className="col-md-6">
                        <div className="card w-100 p-4 shadow">
                            <h2 className="text-center text-secondary">Usuarios Administradores</h2>
                            <button onClick={() => setShowModal(true)} className="btn btn-primary w-100 my-3">
                                Añadir Administrador
                            </button>
                            <ul className="list-group">
                                {Array.isArray(store.admins) && store.admins.length > 0 ? (
                                    store.admins.map((admin) => (
                                        <li key={admin.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {admin.name} {admin.last_name} - {admin.email}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item text-center">No hay administradores registrados.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal para añadir administrador */}
            <AddAdminModal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};





