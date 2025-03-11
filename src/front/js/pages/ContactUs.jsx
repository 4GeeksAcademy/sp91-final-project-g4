import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const ContactUs = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [comments, setComments] = useState("");

    // Aquí sería el manejador para enviar los datos al backend o a la base de datos
    const handleSubmit = (event) => {
        event.preventDefault();

        // Datos a enviar
        const dataToSend = {
            name,
            last_name: lastName,
            phone,
            email,
            comments,
        };

        // Llamar a una función que almacene los datos en el contexto o backend
        actions.addContact(dataToSend);

        // Después de enviar, redirigir o mostrar un mensaje de éxito
        navigate("/"); // Redirigir a la página principal o donde sea necesario
    };

    return (

        <div className="container-fluid p-0">
    
        <header className="bg-secondary text-white text-center py-5">
          <h1 className="display-4">Bienvenido a tu Panel de Cliente</h1>
          <p className="lead">Gestiona tus pedidos y consulta tu información fácilmente</p>
        </header>

        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: "1rem" }}>
            <h1 className="h3 fw-bold text-center my-2">Contacta con nosotros</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-floating my-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Nombre"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <label htmlFor="floatingInput">Nombre</label>
                </div>
                <div className="form-floating my-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Apellidos"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                    <label htmlFor="floatingInput">Apellidos</label>
                </div>
                <div className="form-floating my-3">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="E-mail"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <label htmlFor="floatingInput">E-mail</label>
                </div>
                <div className="form-floating my-3">
                    <input
                        type="tel"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Teléfono"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                    <label htmlFor="floatingInput">Teléfono</label>
                </div>
                <div className="form-floating my-3">
                    <textarea
                        className="form-control"
                        id="floatingInput"
                        placeholder="Comentarios"
                        value={comments}
                        onChange={(event) => setComments(event.target.value)}
                        rows="4"
                    />
                    <label htmlFor="floatingInput">Comentarios</label>
                </div>
                <button type="submit" className="btn btn-warning container my-3">
                    Enviar
                </button>
            </form>
        </div>
    </div>
    );
};
