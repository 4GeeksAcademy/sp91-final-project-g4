import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const AddCustomer = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [custBaseTariff, setCustBaseTariff] = useState("");

    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const dataToSend = {
            company_name: companyName,
            contact_name: contactName,
            phone,
            address,
            cust_base_tariff: custBaseTariff
        };
        actions.addCustomer(dataToSend);
        navigate("/admin/customers");
    };

    const handleCancel = () => {
        navigate("/admin/customers"); // 🔄 Redirige al listado de clientes
    };

    return (
        <div className="card container w-100 mt-5" style={{maxWidth: 500, padding: '1rem'}}>
            <h1 className="h3 fw-bold text-center my-2 "> Alta de cliente </h1>
            <form onSubmit={handleSubmitAdd}> 
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Company name"
                        value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    <label>Nombre de la empresa</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Contact name"
                        value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    <label>Persona de contacto</label>
                </div>
                <div className="form-floating my-3">
                    <input type="tel" className="form-control" placeholder="Phone"
                        value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <label>Teléfono</label>
                </div>
                <div className="form-floating my-3">
                    <input type="text" className="form-control" placeholder="Address"
                        value={address} onChange={(e) => setAddress(e.target.value)} />
                    <label>Dirección</label>
                </div>
                <div className="form-floating my-3">
                    <input type="number" step="0.01" className="form-control" placeholder="Base tariff"
                        value={custBaseTariff} onChange={(e) => setCustBaseTariff(e.target.value)} />
                    <label>Tarifa aplicada</label>
                </div>
                <button type="submit" className="btn btn-warning w-100 my-2">Crear</button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    );
};
