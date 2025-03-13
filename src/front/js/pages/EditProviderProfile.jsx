import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const EditProviderProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const user = store.user;

    // Estados para manejar los datos del usuario
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        if (user && user.id) {
            setName(user.name || "");
            setLastName(user.last_name || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    // Guardar cambios en el perfil
    const handleSubmitEdit = async (event) => {
        event.preventDefault();
        
        
        const dataToSend = {
            name, last_name: lastName, email, phone
        };
    
        const success = await actions.editUser(user.id, dataToSend); // Esperar resultado
    
        if (success) {
            navigate("/provider-profile"); // Redirigir si la edición fue exitosa
        } else {
            console.error("❌ Error al editar el usuario.");
        }
    };

    // Redirigir a Mis Datos sin guardar cambios
    const handleCancel = () => {
        navigate("/provider-profile");
    };

    return (
        <div className="container-fluid p-0">
            <header className="bg-secondary text-white text-center py-5">
                <h1 className="display-4">Editar datos de usuario</h1>
            </header>

        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: "1rem" }}>
            <h1 className="h3 fw-bold text-center my-2">Editar datos de usuario</h1>
            <form onSubmit={handleSubmitEdit}>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Nombre" value={name}
                        onChange={(event) => setName(event.target.value)} />
                    <label>Nombre</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Apellidos" value={lastName}
                        onChange={(event) => setLastName(event.target.value)} />
                    <label>Apellidos</label>
                </div>
                <div className="form-floating my-3">
                    <input type="email" className="form-control" placeholder="Email" value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                    <label>Email</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Teléfono" value={phone}
                        onChange={(event) => setPhone(event.target.value)} />
                    <label>Teléfono</label>
                </div>

                <button type="submit" className="btn btn-warning container my-3">Guardar</button>
                <button type="button" className="btn btn-secondary container" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
        </div>
    );
};

