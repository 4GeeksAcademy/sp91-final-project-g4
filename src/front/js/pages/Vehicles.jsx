import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";



export const Vehicles = () => {

    const navigate = useNavigate()
    const { store, actions } = useContext(Context)

/*     const handleDelete = async (vehicleID) => {
        actions.deleteVehicle(vehicleID)
    } */

    const handleEdit = async (vehicle) => {
        actions.setCurrentVehicle(vehicle)
        navigate("admin/edit-vehicle")
    }


    return (

        <div className="container-fluid  ">
            <div className="container my-2 pb-5">
                <div className="d-flex justify-content-between mx-3 ">
                    <h1 className="text-secondary my-4">Listado de vehículos</h1>
                    <Link to="/add-vehicle">
                        <button type="button" className="btn btn-success  my-4">
                            Añadir vehículo
                        </button>
                    </Link>
                </div>
                <div className="container ">
                    <table className="table table-info">
                        <thead>
                            <tr>
                                <th scope="col">Marca</th>
                                <th scope="col">Modelo</th>
                                <th scope="col">Tipo de vehículo</th>
                                <th scope="col">Coste del transporte</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {store.vehicles.map((item) =>
                            <tr key={item.id} className="table-light">
                                <th>{item.brand}</th>
                                <td>{item.model}</td>
                                <td>{item.vehicle_type}</td>
                                <td>{item.corrector_cost}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)} type="button" className="btn btn-secondary me-4">
                                        <i className="fas fa-edit "></i>
                                    </button>
                                </td>
                                {/* <td>
                                    <button onClick={() => handleDelete(item.id)} type="button" className="btn btn-danger" >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td> */}
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}