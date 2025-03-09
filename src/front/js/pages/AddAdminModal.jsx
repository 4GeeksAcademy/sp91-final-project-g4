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
            onClose(); // Cierra el modal
            navigate("/admin-profile"); // Redirige a "Mis Datos"
        } else {
            toast.error("Error al crear el administrador");
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="text-center">Añadir Administrador</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="name" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Apellidos</label>
                        <input type="text" name="last_name" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="text" name="phone" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mt-3">Dar de Alta</button>
                </form>
                <button className="btn btn-danger w-100 mt-2" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

