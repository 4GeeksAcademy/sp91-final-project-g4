import React, {useContext, useState, useEffect} from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../component/Alert.jsx";


export const EditProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const user = store.user;
    const [ name, setName ] = useState(user.name);
    const [ lastName, setLastName ] = useState(user.last_name);
    const [ email, setEmail ] = useState(user.email);
    const [ phone, setPhone ] = useState(user.phone);
    const [ roleUser, setRoleUser ] = useState(user.role);

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        actions.setAlert({text: 'Usuario editado correctamente', background: 'primary', visible: true})
        const dataToSend = {
            name, last_name: lastName, email, phone, role: roleUser
        };
        actions.editUser(user.id, dataToSend);
        navigate("/user-profile");
    }



    return (
        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: '1rem' }}>
            <h1 className="h3 fw-bold text-center my-2 "> Editar datos de usuario </h1>
            <Alert/>
            <form onSubmit={handleSubmitEdit}>
                <div className="form-floating my-3">
                    <input type="name" className="form-control" id="floatingInput" placeholder="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)} />
                    <label htmlFor="floatingInput">Nombre</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Last name"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)} />
                    <label htmlFor="floatingInput">Apellidos</label>
                </div>
                <div className="form-floating my-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                    <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating my-3">
                    <input type="phone" className="form-control" id="floatingInput" placeholder="Phone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)} />
                    <label htmlFor="floatingInput">Teléfono</label>
                </div>
{/*                 <div className="form-floating my-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Role user"
                        value={roleUser}
                        onChange={(event) => setRoleUser(event.target.value)} />
                    <label htmlFor="floatingInput">Tipo de usuario</label>
                </div> */}
                <div className="form-floating my-3">
                    <select className="form-select" placeholder="Tipo de usuario" id="floatingSelect"
                    value={roleUser}
                    onChange={(event) => setRoleUser(event.target.value)}>
                        <option value={"admin"}>Administrador</option>
                        <option value={'customer'}>Cliente</option>
                        <option value={"provider"}>Proveedor</option>

                    </select>
                        <label htmlFor="floatingSelect">Tipo de usuario</label>
                </div>
                <button type="submit" className="btn btn-warning container my-3">Guardar</button>
            </form>
        </div>
               
    )
}