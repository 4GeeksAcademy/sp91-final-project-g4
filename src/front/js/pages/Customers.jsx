import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const Customers = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (!store.token) {
            navigate("/login");  // Redirige si no hay token
            return;
        }
        actions.getCustomers();
    }, [store.token]);

    const handleToggleStatus = async (customer) => {
        const updatedData = { is_active: !customer.is_active }; // 🔄 Alternar estado
        await actions.editCustomer(customer.id, updatedData);
       /*  actions.setAlert({ 
            text: `Cliente ${customer.is_active ? "desactivado" : "activado"} correctamente`, 
            background: "primary", 
            visible: true 
        }); */
    };

    const handleEdit = async (customer) => {
        actions.setCurrentCustomer(customer);
        navigate("/admin/edit-customer"); // ✅ Corrección en la ruta de navegación
    };

    return (
        <div className="container-fluid">
            <div className="container my-2 pb-5">
                <div className="d-flex justify-content-between mx-3">
                    <h1 className="text-secondary my-4">Listado de clientes</h1>
                    <Link to="/add-customer">
                        <button type="button" className="btn btn-success my-4">Añadir cliente</button>
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
                            {store.customers.map((item) => (
                                <tr key={item.id} className="table-light">
                                    <th>{item.company_name}</th>
                                    <td>{item.contact_name}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.cust_base_tariff}</td>
                                    <td>{item.is_active ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <button onClick={() => handleEdit(item)} type="button" className="btn btn-secondary">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleToggleStatus(item)} type="button" className={`btn ${item.is_active ? "btn-success" : "btn-danger"}`}>
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

