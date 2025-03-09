import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AddAdminModal = ({ show, onClose }) => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const success = await actions.addAdmin(formData);
        if (success) {
            toast.success("Administrador creado correctamente");
            onClose();
            actions.getAdmins(); // ✅ Actualiza la lista de administradores
        } else {
            toast.error("Error al crear el administrador");
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Añadir Administrador</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating my-3">
                                <input type="text" className="form-control" name="name" placeholder="Nombre"
                                    onChange={handleChange} required />
                                <label>Nombre</label>
                            </div>
                            <div className="form-floating my-3">
                                <input type="text" className="form-control" name="last_name" placeholder="Apellidos"
                                    onChange={handleChange} required />
                                <label>Apellidos</label>
                            </div>
                            <div className="form-floating my-3">
                                <input type="email" className="form-control" name="email" placeholder="Email"
                                    onChange={handleChange} required />
                                <label>Email</label>
                            </div>
                            <div className="form-floating my-3">
                                <input type="text" className="form-control" name="phone" placeholder="Teléfono"
                                    onChange={handleChange} required />
                                <label>Teléfono</label>
                            </div>
                            <div className="form-floating my-3">
                                <input type="password" className="form-control" name="password" placeholder="Contraseña"
                                    onChange={handleChange} required />
                                <label>Contraseña</label>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Guardar</button>
                            <button type="button" className="btn btn-secondary w-100 mt-2" onClick={onClose}>Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


