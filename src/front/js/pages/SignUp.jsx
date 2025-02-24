import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const SignUp = () => {
    const { store, actions} = useContext(Context)
    const navigate = useNavigate();

    const [ name, setfirstName ] = useState("")
    const [ lastName, setLastName ] = useState("")
    const [ phone, setPhone ] = useState("")  
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleSubmitAdd = (event) =>{
        event.preventDefault();
        const dataToSend = {
            name, last_name: lastName, phone, email, password
        };
        actions.addUser(dataToSend);
        navigate("/login");
    }


    return (
        <div className="card container w-100 mt-5" style={{maxWidth: 500, padding: '1rem'}}>
            <h1 className="h3 fw-bold text-center my-2 "> Crear cuenta </h1>
            <form onSubmit={handleSubmitAdd}> 
                <div className="form-floating my-3">
                    <input type="firstName" className="form-control" id="floatingInput" placeholder="First name" 
                    value={name}
                    onChange={(event) =>setfirstName(event.target.value)}/>
                    <label htmlFor="floatingInput">Nombre</label>
                </div>
                <div className="form-floating my-3">
                    <input type="lastName" className="form-control" id="floatingInput" placeholder="Last name" 
                    value={lastName}
                    onChange={(event) =>setLastName(event.target.value)}/>
                    <label htmlFor="floatingInput">Apellidos</label>
                </div>
                <div className="form-floating my-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="E-mail" 
                    value={email}
                    onChange={(event) =>setEmail(event.target.value)}/>
                    <label htmlFor="floatingInput">E-mail</label>
                </div>
                <div className="form-floating my-3">
                    <input type="tel" className="form-control" id="floatingInput" placeholder="Phone" 
                    value={phone}
                    onChange={(event) =>setPhone(event.target.value)}/>
                    <label htmlFor="floatingInput">Teléfono</label>
                </div>
                <div className="form-floating my-3">
                    <input type="password" className="form-control" id="floatingInput" placeholder="Password" 
                    value={password}
                    onChange={(event) =>setPassword(event.target.value)}/>
                    <label htmlFor="floatingInput">Contraseña</label>
                </div>
                <button 
                onSubmit={handleSubmitAdd}
                type="submit" className="btn btn-warning container my-3">Guardar</button>
            </form>
        </div>

    )
}