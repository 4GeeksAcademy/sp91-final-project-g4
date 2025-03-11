import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProviderProfile = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();

    useEffect(() => {
      
        actions.getProviderById(params.providerId);
    }, [params.providerId]);

    return (
        <div className="container bg-light mt-5">
            <h1 className="text-secondary text-center">Perfil de Proveedor</h1>
            <p className="lead">Gestion de datos personales y de usuarios  </p>

            {store.provider ? (
                <>
                    <div className="card bg-light text-dark p-3">
                        <p><strong>Nombre:</strong> {store.provider.name}</p>
                        <p><strong>Email:</strong> {store.provider.email}</p>
                    </div>
                    <h2 className="mt-4">Usuarios Asociados</h2>
                    {store.provider.users?.length > 0 ? (
                        store.provider.users.map(user => (
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
                <p>Cargando información del proveedor...</p>
            )}
        </div>
    );
};
