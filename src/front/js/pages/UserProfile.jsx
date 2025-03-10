import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { AddAdminModal } from "../pages/AddAdminModal.jsx";

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (store.user.id && store.token) {
                await actions.getUser(store.user.id);

                if (store.user.role === "admin") {
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

    // ✅ Función para activar/desactivar administradores
    const handleToggleAdminStatus = async (admin) => {
        const updatedAdmin = { ...admin, is_active: !admin.is_active };
        await actions.editUser(admin.id, updatedAdmin);
        actions.getAdmins(); // ✅ Actualiza la lista de administradores
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando...</div>;
    }

    return (
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
                            <option value="admin">Administrador</option>
                            <option value="customer">Cliente</option>
                            <option value="provider">Proveedor</option>
                        </select>
                        <label>Tipo de usuario</label>
                    </div>
                    <button onClick={handleEdit} className="btn btn-warning w-100">Editar Datos</button>
                </form>
            </div>

            {/* ✅ Tabla de Administradores debajo de Mis Datos */}
            {store.user.role === "admin" && (
                <div className="card p-4 mt-4 shadow">
                    <h2 className="h4 text-secondary text-center">Usuarios Administradores</h2>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary w-100 my-3">
                        Añadir Administrador
                    </button>
                    <table className="table table-info">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Estado</th>
                                <th>Activar/Desactivar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.admins.length > 0 ? (
                                store.admins.map((admin) => (
                                    <tr key={admin.id} className="table-light">
                                        <td>{admin.name} {admin.last_name}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.is_active ? "Activo" : "Inactivo"}</td>
                                        <td>
                                            <button onClick={() => handleToggleAdminStatus(admin)}
                                                    className={`btn ${admin.is_active ? "btn-success" : "btn-danger"}`}>
                                                <i className="fas fa-power-off"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center">No hay administradores registrados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para añadir administrador */}
            <AddAdminModal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};







