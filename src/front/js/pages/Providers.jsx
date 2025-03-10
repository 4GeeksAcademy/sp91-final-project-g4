import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Alert } from "../component/Alert.jsx";

export const Providers = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProviders(); // ✅ Asegurar que se obtienen TODOS los proveedores
    }, []);

    const handleToggleStatus = async (provider) => {
        const updatedData = { is_active: !provider.is_active }; // 🔄 Alternar estado
        await actions.editProvider(provider.id, updatedData);
        actions.getProviders(); // ✅ Refrescar la lista de proveedores después del cambio
    };

    const handleEdit = (provider) => {
        actions.setCurrentProvider(provider);
        navigate("/admin/edit-provider");
    };

    return (
        <div className="container-fluid">
            <div className="container my-2 pb-5">
                <div className="d-flex justify-content-between mx-3">
                    <h1 className="text-secondary my-4">Listado de Proveedores</h1>
                    <Link to="/add-provider">
                        <button type="button" className="btn btn-success my-4">Añadir Proveedor</button>
                    </Link>
                </div>
                <div className="container">
                    <table className="table table-info">
                        <thead>
                            <tr>
                                <th scope="col">Empresa</th>
                                <th scope="col">Persona de contacto</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Dirección</th>
                                <th scope="col">Tarifa aplicada</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Activar/Desactivar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.providers.map((provider) => (
                                <tr key={provider.id} className="table-light">
                                    <th>{provider.company_name}</th>
                                    <td>{provider.contact_name}</td>
                                    <td>{provider.phone}</td>
                                    <td>{provider.address}</td>
                                    <td>{provider.prov_base_tariff}</td>
                                    <td>{provider.is_active ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <button onClick={() => handleEdit(provider)} type="button" className="btn btn-secondary">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleToggleStatus(provider)} type="button" 
                                                className={`btn ${provider.is_active ? "btn-success" : "btn-danger"}`}>
                                            <i className="fas fa-power-off"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};




