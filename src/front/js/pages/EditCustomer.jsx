import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Alert } from "../component/Alert.jsx";
import { AddCustomerUserModal } from "../pages/AddCustomerUserModal.jsx"; // ✅ Corregida la importación

export const EditCustomer = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // ✅ Estado para el modal de usuario

    const currentCustomer = store.currentCustomer;
    const [companyName, setCompanyName] = useState(currentCustomer?.company_name || "");
    const [contactName, setContactName] = useState(currentCustomer?.contact_name || "");
    const [phone, setPhone] = useState(currentCustomer?.phone || "");
    const [address, setAddress] = useState(currentCustomer?.address || "");
    const [custBaseTariff, setCustBaseTariff] = useState(currentCustomer?.cust_base_tariff || "");

    // Obtener usuarios del cliente cuando cambia el ID del cliente
    useEffect(() => {
        if (currentCustomer?.id) {
            actions.getCustomerById(currentCustomer.id);
        }
    }, [currentCustomer?.id]);

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        actions.setAlert({ text: "Cliente editado correctamente", background: "primary", visible: true });

        const dataToSend = {
            company_name: companyName,
            contact_name: contactName,
            phone,
            address,
            cust_base_tariff: parseFloat(custBaseTariff) || 0  // ✅ Convertimos tarifa a número
        };

        actions.editCustomer(currentCustomer.id, dataToSend);
        navigate("/admin/customers");
    };

    const handleCancel = () => {
        navigate("/admin/customers");
    };

    // ✅ Activar/Desactivar usuario
    const handleToggleUserStatus = async (user) => {
        const updatedUser = { ...user, is_active: !user.is_active };
        await actions.editUser(user.id, updatedUser);
        actions.getCustomerById(currentCustomer.id); // ✅ Actualizar la lista tras cambio de estado
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h1 className="h3 fw-bold text-center my-2">Editar datos de cliente</h1>
                <Alert />
                <form onSubmit={handleSubmitEdit}>
                    <div className="form-floating my-3">
                        <input type="text" className="form-control" placeholder="Company name"
                            value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        <label>Nombre de la empresa</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="text" className="form-control" placeholder="Contact name"
                            value={contactName} onChange={(e) => setContactName(e.target.value)} />
                        <label>Persona de contacto</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="tel" className="form-control" placeholder="Phone"
                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <label>Teléfono</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="text" className="form-control" placeholder="Address"
                            value={address} onChange={(e) => setAddress(e.target.value)} />
                        <label>Dirección</label>
                    </div>
                    <div className="form-floating my-3">
                        <input type="number" step="0.01" className="form-control" placeholder="Base tariff"
                            value={custBaseTariff} onChange={(e) => setCustBaseTariff(e.target.value)} />
                        <label>Tarifa aplicada</label>
                    </div>
                    <button type="submit" className="btn btn-warning w-100 my-2">Guardar</button>
                    <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancelar</button>
                </form>
            </div>

            {/* ✅ Tabla de usuarios del cliente */}
            <div className="card p-4 mt-4 shadow">
                <h2 className="h4 text-secondary text-center">Usuarios del Cliente</h2>
                <button onClick={() => setShowModal(true)} className="btn btn-primary w-100 my-3">Añadir Usuario</button>
                <table className="table table-info">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Estado</th>  {/* ✅ Nueva columna de estado */}
                            <th>Activar/Desactivar</th> {/* ✅ Nuevo botón de encendido/apagado */}
                        </tr>
                    </thead>
                    <tbody>
                        {store.currentCustomer?.users && store.currentCustomer.users.length > 0 ? (
                            store.currentCustomer.users.map(user => (
                                <tr key={user.id} className="table-light">
                                    <td>{user.name} {user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.role}</td>
                                    <td>{user.is_active ? "Activo" : "Inactivo"}</td> {/* ✅ Mostrar estado */}
                                    <td>
                                        <button onClick={() => handleToggleUserStatus(user)} 
                                                className={`btn ${user.is_active ? "btn-success" : "btn-danger"}`}>
                                            <i className="fas fa-power-off"></i> {/* ✅ Ícono de encendido/apagado */}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center">No hay usuarios asignados.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal para añadir usuario */}
            {showModal && (
                <AddCustomerUserModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    customerId={currentCustomer.id} // ✅ Pasamos correctamente el customerId
                />
            )}
        </div>
    );
};




