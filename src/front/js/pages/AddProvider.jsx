import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const AddProvider = () => {
    const { store, actions} = useContext(Context)
    const navigate = useNavigate();

    const [ companyName, setCompanyName ] = useState("");
    const [ contactName, setcontactName ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ address, setAddres ] = useState("");
    const [ provBaseTariff, setProvBaseTariff ] = useState("");


    const handleSubmitAdd = (event) =>{
        event.preventDefault();
        const dataToSend = {
            company_name: companyName, contact_name: contactName, phone, address, prov_base_tariff: provBaseTariff
        };
        actions.addProvider(dataToSend);
        navigate("/admin/providers");
    }




    return (
        <div className="card container w-100 mt-5" style={{maxWidth: 500, padding: '1rem'}}>
            <h1 className="h3 fw-bold text-center my-2 "> Alta de proveedores </h1>
            <form onSubmit={handleSubmitAdd}> 
                <div className="form-floating my-3">
                <input type="companyName" className="form-control" id="floatingInput" placeholder="Company name"
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)} />
                    <label htmlFor="floatingInput">Nombre de la empresa</label>
                </div>
                <div className="form-floating my-3">
                    <input type="contactName" className="form-control" id="floatingInput" placeholder="Contact name"
                        value={contactName}
                        onChange={(event) => setcontactName(event.target.value)} />
                    <label htmlFor="floatingInput">Persona de contacto</label>
                </div>
                <div className="form-floating my-3">
                    <input type="tel" className="form-control" id="floatingInput" placeholder="Phone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)} />
                    <label htmlFor="floatingInput">Teléfono</label>
                </div>
                <div className="form-floating my-3">
                    <input type="address" className="form-control" id="floatingInput" placeholder="Address"
                        value={address}
                        onChange={(event) => setAddres(event.target.value)} />
                    <label htmlFor="floatingInput">Dirección</label>
                </div>
                <div className="form-floating my-3">
                    <input type="baseTariff" className="form-control" id="floatingInput" placeholder="Base tariff"
                        value={provBaseTariff}
                        onChange={(event) => setProvBaseTariff(event.target.value)} />
                    <label htmlFor="floatingInput">Tarifa aplicada</label>
                </div>
                <button
                    onSubmit={handleSubmitAdd}
                    type="submit" className="btn btn-warning container my-3">Crear
                </button>

            </form>
        </div>

    )
}