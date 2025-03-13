import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);

    const handleSignIn = async (event) => {
        event.preventDefault();
        const dataToSend = { email, password };
        await actions.login(dataToSend);
        if (store.isLogged) {
            navigate("/");
        }
    };

    return (
        <div className="card w-100 m-auto mt-5" style={{ maxWidth: 330, padding: '1rem' }}>
            <form onSubmit={handleSignIn} className="container">
                <h1 className="h3 text-center my-2 fw-bold">Iniciar sesión</h1>
                <div className="form-floating mb-2">
                    <input 
                        value={email}
                        onChange={handleEmail}
                        type="email" 
                        className="form-control my-3" 
                        id="floatingInput" 
                        placeholder="name@example.com" 
                    />
                    <label htmlFor="floatingInput">Introduce tu dirección de e-mail</label>
                </div> 
                <div className="form-floating">
                    <input 
                        value={password}
                        onChange={handlePassword}
                        type="password" 
                        className="form-control" 
                        id="floatingPassword" 
                        placeholder="Password" 
                    />
                    <label htmlFor="floatingPassword">Contraseña</label>
                </div>
                <button className="btn btn-warning w-100 py-2 my-3" type="submit">Iniciar sesión</button>

                {/* 🔹 Sección de "Crear cuenta" comentada para que no aparezca */}
                {/* 
                <div className="fs-6 fw-lighter">
                    ¿Eres nuevo cliente? 
                    <Link to="/sign-up" className="ms-1 text-decoration-none"> Crear cuenta </Link>
                </div> 
                */}
            </form>
        </div>
    );
};