import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";



export const Customers = () => {

    const navigate = useNavigate()
    const { store, actions } = useContext(Context)

    const handleDelete = async (customerId) => {
        actions.deleteCustomer(customerId)
    }

    const handleEdit = async (customer) => {
        actions.setCurrentCustomer(customer)
        navigate("admin/edit-customer")
    }


    return (

        <div className="container-fluid  ">
            <div className="container my-2 pb-5">
                <div className="d-flex justify-content-between mx-3 ">
                    <h1 className="text-secondary my-4">Listado de clientes</h1>
                    <Link to="/add-customer">
                        <button type="button" className="btn btn-success  my-4">
                            Añadir cliente
                        </button>
                    </Link>
                </div>
                <div className="container ">
                    <table className="table table-info">
                        <thead>
                            <tr>
                                <th scope="col">Empresa</th>
                                <th scope="col">Persona de contacto</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Dirección</th>
                                <th scope="col">Tarifa aplicada</th>
                                <th scope="col">Activo</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {store.customers.map((item) =>
                            <tr key={item.id} className="table-light">
                                <th>{item.company_name}</th>
                                <td>{item.contact_name}</td>
                                <td>{item.phone}</td>
                                <td>{item.address}</td>
                                <td>{item.cust_base_tariff}</td>
                                <td>{item.is_active? "Activo": "Inactivo"}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)} type="button" className="btn btn-secondary me-4">
                                        <i className="fas fa-edit "></i>
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)} type="button" className="btn btn-danger" >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}