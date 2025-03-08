import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const CustomerProfile = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();

    useEffect(() => {
        // Llamamos a la acción getCustomer con el customerId de la URL
        actions.getCustomerById(params.customerId);
    }, [params.customerId]);

    return (
        <div className="container bg-light mt-5">
            <h1 className="text-secondary text-center">Perfil del Cliente</h1>

            {store.customer ? (
                <>
                    <div className="card bg-light text-dark p-3">
                        <p><strong>Nombre:</strong> {store.customer.name}</p>
                        <p><strong>Email:</strong> {store.customer.email}</p>
                    </div>
                    <h2 className="mt-4">Usuarios Asociados</h2>
                    {store.customer.users?.length > 0 ? (
                        store.customer.users.map(user => (
                            <div key={user.id} className="card my-3 bg-light text-dark p-3">
                                <p><strong>Usuario:</strong> {user.name} {user.last_name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No hay usuarios asociados.</p>
                    )}
                </>
            ) : (
                <p>Cargando información del cliente...</p>
            )}
        </div>
    );
};
