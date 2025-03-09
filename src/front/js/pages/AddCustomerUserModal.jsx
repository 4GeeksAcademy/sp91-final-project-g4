import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext.js";

export const AddCustomerUserModal = ({ show, onClose, customerId }) => {
    const { actions } = useContext(Context);
    
    // Estados del formulario
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!show) {
            setName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setPassword("");
        }
    }, [show]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!customerId) {
            console.error("❌ Error: No se ha proporcionado `customerId`.");
            return;
        }

        const dataToSend = {
            name,
            last_name: lastName, // ✅ Se corrigió `last_name`
            email,
            phone,
            password,
            customer_id: customerId, // ✅ Se envía correctamente el ID del cliente
        };

        const success = await actions.addUser(dataToSend);

        if (success) {
            onClose(); // ✅ Cierra el modal después de añadir el usuario
            actions.getCustomerById(customerId); // ✅ Actualiza la lista de usuarios
        }
    };

    return (
        <>
            {show && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Añadir Usuario</h5>
                                <button type="button" className="btn-close" onClick={onClose}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating my-3">
                                        <input type="text" className="form-control" placeholder="Nombre"
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                        <label>Nombre</label>
                                    </div>
                                    <div className="form-floating my-3">
                                        <input type="text" className="form-control" placeholder="Apellidos"
                                            value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        <label>Apellidos</label>
                                    </div>
                                    <div className="form-floating my-3">
                                        <input type="email" className="form-control" placeholder="Email"
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <label>Email</label>
                                    </div>
                                    <div className="form-floating my-3">
                                        <input type="text" className="form-control" placeholder="Teléfono"
                                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        <label>Teléfono</label>
                                    </div>
                                    <div className="form-floating my-3">
                                        <input type="password" className="form-control" placeholder="Contraseña"
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <label>Contraseña</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Guardar</button>
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



