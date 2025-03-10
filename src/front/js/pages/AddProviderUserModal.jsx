import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const AddProviderUserModal = ({ show, onClose, providerId, editingUser }) => {
    const { actions } = useContext(Context);
    
    // Estado del formulario
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        phone: "",
        password: ""
    });

    // Si se está editando, llenar los campos con los datos del usuario
    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || "",
                last_name: editingUser.last_name || "",
                email: editingUser.email || "",
                phone: editingUser.phone || "",
                password: "" // No mostrar la contraseña por seguridad
            });
        } else {
            // Si es un nuevo usuario, limpiar los campos
            setFormData({
                name: "",
                last_name: "",
                email: "",
                phone: "",
                password: ""
            });
        }
    }, [editingUser, show]);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!providerId) {
            console.error("❌ Error: No se ha proporcionado `providerId`.");
            return;
        }

        const dataToSend = {
            ...formData,
            provider_id: providerId,
        };

        let success;
        if (editingUser) {
            success = await actions.editUser(editingUser.id, dataToSend);
        } else {
            success = await actions.addUser(dataToSend);
        }

        if (success) {
            onClose();
            actions.getProviderById(providerId); // ✅ Actualizar la lista de usuarios
        }
    };

    return (
        <>
            {show && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingUser ? "Editar Usuario" : "Añadir Usuario"}</h5>
                                <button type="button" className="btn-close" onClick={onClose}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating my-3">
                                        <input type="text" name="name" className="form-control" placeholder="Nombre"
                                            value={formData.name} onChange={handleChange} required />
                                        <label>Nombre</label>
                                    </div>
                                    <div className="form-floating my-3">
                                        <input type="text" name="last_name" className="form-control" placeholder="Apellidos"
                                            value={formData.last_name} onChange={handleChange} required />
                                        <label>Apellidos</label>
                                    </div>
                                    <div className="form-floating my-3">
                                        <input type="email" name="email" className="form-control" placeholder="Email"
                                            value={formData.email} onChange={handleChange} required />
                                        <label>Email</label>
                                    </div>
                                    <div className="form-floating my-3">
                                        <input type="text" name="phone" className="form-control" placeholder="Teléfono"
                                            value={formData.phone} onChange={handleChange} required />
                                        <label>Teléfono</label>
                                    </div>
                                    {!editingUser && (
                                        <div className="form-floating my-3">
                                            <input type="password" name="password" className="form-control" placeholder="Contraseña"
                                                value={formData.password} onChange={handleChange} required />
                                            <label>Contraseña</label>
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-primary w-100">
                                        {editingUser ? "Guardar Cambios" : "Añadir Usuario"}
                                    </button>
                                    <button type="button" className="btn btn-secondary w-100 mt-2" onClick={onClose}>Cancelar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};






