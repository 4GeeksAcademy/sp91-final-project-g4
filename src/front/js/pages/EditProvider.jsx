import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { AddProviderUserModal } from "../pages/AddProviderUserModal.jsx"; // ✅ Modal para añadir/editar usuarios

export const EditProvider = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // ✅ Estado para el modal
    const [editingUser, setEditingUser] = useState(null); // ✅ Estado para editar usuario

    const currentProvider = store.currentProvider;
    const [companyName, setCompanyName] = useState(currentProvider?.company_name || "");
    const [contactName, setContactName] = useState(currentProvider?.contact_name || "");
    const [phone, setPhone] = useState(currentProvider?.phone || "");
    const [address, setAddress] = useState(currentProvider?.address || "");
    const [provBaseTariff, setProvBaseTariff] = useState(currentProvider?.prov_base_tariff || "");

    // ✅ Obtener usuarios del proveedor cuando cambia el ID del proveedor
    useEffect(() => {
        if (currentProvider?.id) {
            actions.getProviderById(currentProvider.id);
        }
    }, [currentProvider?.id]);

    const handleSubmitEdit = (event) => {
        event.preventDefault();

        const dataToSend = {
            company_name: companyName,
            contact_name: contactName,
            phone,
            address,
            prov_base_tariff: parseFloat(provBaseTariff) || 0
        };

        actions.editProvider(currentProvider.id, dataToSend);
        navigate("/admin/providers");
    };

    const handleCancel = () => {
        navigate("/admin/providers");
    };

    // ✅ Activar/Desactivar usuario
    const handleToggleUserStatus = async (user) => {
        const updatedUser = { ...user, is_active: !user.is_active };
        await actions.editUser(user.id, updatedUser);
        actions.getProviderById(currentProvider.id);
    };

    // ✅ Abrir el modal para editar un usuario existente
    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h1 className="h3 fw-bold text-center my-2">Editar datos de proveedor</h1>
                <form onSubmit={handleSubmitEdit}>
                    <div className="form-floating my-3">
                        <input type="text" className="form-control" placeholder="Nombre de la empresa"
                            value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        <label>Nombre de la empresa</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="text" className="form-control" placeholder="Persona de contacto"
                            value={contactName} onChange={(e) => setContactName(e.target.value)} />
                        <label>Persona de contacto</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="tel" className="form-control" placeholder="Teléfono"
                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <label>Teléfono</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="text" className="form-control" placeholder="Dirección"
                            value={address} onChange={(e) => setAddress(e.target.value)} />
                        <label>Dirección</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="number" step="0.01" className="form-control" placeholder="Tarifa aplicada"
                            value={provBaseTariff} onChange={(e) => setProvBaseTariff(e.target.value)} />
                        <label>Tarifa aplicada</label>
                    </div>
                    <button type="submit" className="btn btn-warning w-100 my-2">Guardar</button>
                    <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancelar</button>
                </form>
            </div>

            {/* ✅ Tabla de usuarios del proveedor */}
            <div className="card p-4 mt-4 shadow">
                <h2 className="h4 text-secondary text-center">Usuarios del Proveedor</h2>
                <button onClick={() => { setEditingUser(null); setShowModal(true); }} className="btn btn-primary w-100 my-3">Añadir Usuario</button>
                <table className="table table-info">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Estado</th>  {/* ✅ Nueva columna de estado */}
                            <th>Editar</th>  {/* ✅ Nuevo icono para editar */}
                            <th>Activar/Desactivar</th> {/* ✅ Nuevo botón de encendido/apagado */}
                        </tr>
                    </thead>
                    <tbody>
                        {store.currentProvider?.users && store.currentProvider.users.length > 0 ? (
                            store.currentProvider.users.map(user => (
                                <tr key={user.id} className="table-light">
                                    <td>{user.name} {user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.role}</td>
                                    <td>{user.is_active ? "Activo" : "Inactivo"}</td> {/* ✅ Mostrar estado */}
                                    <td>
                                        <button onClick={() => handleEditUser(user)} className="btn btn-secondary">
                                            <i className="fas fa-edit"></i> {/* ✅ Ícono de edición */}
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleToggleUserStatus(user)} 
                                                className={`btn ${user.is_active ? "btn-success" : "btn-danger"}`}>
                                            <i className="fas fa-power-off"></i> {/* ✅ Ícono de encendido/apagado */}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center">No hay usuarios asignados.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal para añadir o editar usuario */}
            {showModal && (
                <AddProviderUserModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    providerId={currentProvider.id}
                    editingUser={editingUser} // ✅ Se pasa el usuario a editar
                />
            )}
        </div>
    );
};



