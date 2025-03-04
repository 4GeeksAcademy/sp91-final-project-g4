import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";



export const EditProvider = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const currentProvider = store.currentProvider;
    const [ companyName, setCompanyName ] = useState(currentProvider.company_name);
    const [ contactName, setcontactName ] = useState(currentProvider.contact_name);
    const [ phone, setPhone ] = useState(currentProvider.phone);
    const [ address, setAddres ] = useState(currentProvider.address);
    const [ provBaseTariff, setProvBaseTariff ] = useState(currentProvider.prov_base_tariff);

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        const dataToSend = {
            company_name: companyName, contact_name: contactName, phone, address, prov_base_tariff: provBaseTariff
        };
        actions.editProvider(currentProvider.id, dataToSend);
        navigate("/admin/providers");
    }

    return (
        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: '1rem' }}>
            <h1 className="h3 fw-bold text-center my-2 "> Editar datos de proveedor </h1>
            <form onSubmit={handleSubmitEdit}>
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
                <button type="submit" className="btn btn-warning container my-3">Guardar</button>
            </form>
        </div>
               
    )
}