import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const AddProvider = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    // Estados para los campos del formulario
    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [provBaseTariff, setProvBaseTariff] = useState("");

    // ✅ Función para enviar el formulario
    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const dataToSend = {
            company_name: companyName,
            contact_name: contactName,
            phone,
            address,
            prov_base_tariff: provBaseTariff
        };

        actions.addProvider(dataToSend);
        navigate("/admin/providers"); // ✅ Redirigir al listado de proveedores
    };

    // ✅ Función para cancelar y volver al listado
    const handleCancel = () => {
        navigate("/admin/providers"); // ✅ Redirigir al listado de proveedores
    };

    return (
        <div className="container-fluid p-0">
        <header className="bg-secondary text-white text-center py-5">
            <h1 className="display-4">Nuevo Proveedor</h1>
            <p className="lead">Datos de proveedor y usuarios </p>
        </header>

        <div className="card container w-100 mt-5" style={{maxWidth: 500, padding: '1rem'}}>
            <h1 className="h3 fw-bold text-center my-2 "> Alta de proveedores </h1>
            <form onSubmit={handleSubmitAdd}> 
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Nombre de la empresa"
                        value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
                    <label>Nombre de la empresa</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Persona de contacto"
                        value={contactName} onChange={(event) => setContactName(event.target.value)} />
                    <label>Persona de contacto</label>
                </div>
                <div className="form-floating my-3">
                    <input type="tel" className="form-control" placeholder="Teléfono"
                        value={phone} onChange={(event) => setPhone(event.target.value)} />
                    <label>Teléfono</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Dirección"
                        value={address} onChange={(event) => setAddress(event.target.value)} />
                    <label>Dirección</label>
                </div>
                <div className="form-floating my-3">
                    <input type="number" step="0.01" className="form-control" placeholder="Tarifa aplicada"
                        value={provBaseTariff} onChange={(event) => setProvBaseTariff(event.target.value)} />
                    <label>Tarifa aplicada</label>
                </div>
                
                {/* ✅ Botón para Guardar */}
                <button type="submit" className="btn btn-warning container my-3">Guardar</button>

                {/* ✅ Botón para Cancelar */}
                <button type="button" className="btn btn-secondary container" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    </div>
    );
};
