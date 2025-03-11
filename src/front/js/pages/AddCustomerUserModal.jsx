import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";

export const AddCustomerUserModal = ({ show, onClose, customerId, userData }) => {
    const { actions } = useContext(Context);


    // Estados del formulario
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState(""); // Solo se usa si se añade un usuario nuevo

    useEffect(() => {
        if (userData) {
            // ✅ Si estamos editando, rellenar los campos con los datos del usuario
            setName(userData.name || "");
            setLastName(userData.last_name || "");
            setEmail(userData.email || "");
            setPhone(userData.phone || "");
        } else {
            // ✅ Si estamos añadiendo un nuevo usuario, vaciar los campos
            setName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setPassword(""); // Solo se usa al crear usuarios
        }
    }, [userData, show]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!customerId) {
            console.error("❌ Error: No se ha proporcionado `customerId`.");
            return;
        }

        const dataToSend = {
            name,
            last_name: lastName,
            email,
            phone,
            customer_id: customerId,
        };

        let success = false;

        if (userData) {
            // ✅ Si estamos editando, actualizar el usuario
            success = await actions.editUser(userData.id, dataToSend);
        } else {
            // ✅ Si es un nuevo usuario, agregarlo con contraseña
            dataToSend.password = password; // Solo se envía en el registro
            success = await actions.addUser(dataToSend);
        }

        if (success) {
            onClose(); // ✅ Cierra el modal después de añadir/editar el usuario
            actions.getCustomerById(customerId); // ✅ Actualiza la lista de usuarios
        }
    };

    return (
        <>
            {show && (

                <div className="container-fluid p-0">
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{userData ? "Editar Usuario" : "Añadir Usuario"}</h5>
                                    <button type="button" className="btn-close" onClick={onClose}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-floating my-3">
                                            <input type="text" className="form-control" placeholder="Nombre"
                                                value={name} onChange={(e) => setName(e.target.value)} required />
                                            <label>Nombre</label>
                                        </div>
                                        <div className="form-floating my-3">
                                            <input type="text" className="form-control" placeholder="Apellidos"
                                                value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                            <label>Apellidos</label>
                                        </div>
                                        <div className="form-floating my-3">
                                            <input type="email" className="form-control" placeholder="Email"
                                                value={email} onChange={(e) => setEmail(e.target.value)} required disabled={userData !== null} />
                                            <label>Email</label>
                                        </div>
                                        <div className="form-floating my-3">
                                            <input type="text" className="form-control" placeholder="Teléfono"
                                                value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                            <label>Teléfono</label>
                                        </div>
                                        {!userData && (
                                            <div className="form-floating my-3">
                                                <input type="password" className="form-control" placeholder="Contraseña"
                                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                                                <label>Contraseña</label>
                                            </div>
                                        )}
                                        <button type="submit" className="btn btn-primary w-100">{userData ? "Guardar Cambios" : "Añadir Usuario"}</button>
                                        <button type="button" className="btn btn-secondary w-100 mt-2" onClick={onClose}>Cancelar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                </>
            );
                </>
            );
};




