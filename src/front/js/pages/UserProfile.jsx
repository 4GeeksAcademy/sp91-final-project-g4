import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const UserProfile = () => {

    const { store, actions } = useContext(Context);
    const params = useParams();
    const navigate = useNavigate()
    console.log(params);

    /*     const handleLogin = () => {
            if (store.isLogged) {
                actions.setIsLogged(false);
                actions.setUser({});
                navigate('/user-profile')
            }else{
                navigate('/login')
            }
        } */

    const handleEdit = async (user) => {
        actions.setCurrentUser(user)
        navigate("/edit-user")
    }

    useEffect(() => {
        actions.getUser(store.user.id)
    }, [])

    return (
        <div className="container bg-light mt-5">
            <div className="card my-2  bg-light text-light">
                <div className="row g-0">
                    <h1 className="text-secondary text-center">Datos de usuario </h1>
                    <div className="col-md-5 col-lg-6 col-xl-7">
                        <div className="card-body text-dark">
                            <p><strong>Name:</strong> {store.user.name}</p>
                            <p><strong>Last name:</strong> {store.user.last_name}</p>
                            <p><strong>Email:</strong> {store.user.email}</p>
                            <p><strong>Phone:</strong> {store.user.phone}</p>
                        </div>
                    </div>
                    <button onClick={() => handleEdit(store.user)} className="btn btn-warning w-100 py-2 my-3" type="submit"> Editar datos </button>
                </div>
            </div>
        </div>
    )
}