import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../component/Alert.jsx";





export const EditCustomer = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const currentCustomer = store.currentCustomer;
    const [ companyName, setCompanyName ] = useState(currentCustomer.company_name);
    const [ contactName, setContactName ] = useState(currentCustomer.contact_name);
    const [ phone, setPhone ] = useState(currentCustomer.phone);
    const [ address, setAddres ] = useState(currentCustomer.address);
    const [ custBaseTariff, setcustBaseTariff ] = useState(currentCustomer.cust_base_tariff);

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        actions.setAlert({text: 'Cliente editado correctamente', background: 'primary', visible: true})
        const dataToSend = {
            company_name: companyName, contact_name: contactName, phone, address, cust_base_tariff: custBaseTariff
        };
        actions.editCustomer(currentCustomer.id, dataToSend);
        navigate("/admin/customers");
    }

    useEffect(() => {
        actions.setAlert({text:'', background:'primary', visible:false});
    }, [])

    return (
        <div className="card container w-100 mt-5" style={{ maxWidth: 500, padding: '1rem' }}>
            <h1 className="h3 fw-bold text-center my-2 "> Editar datos de cliente </h1>
            <Alert/>
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
                        onChange={(event) => setContactName(event.target.value)} />
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
                        value={custBaseTariff}
                        onChange={(event) => setcustBaseTariff(event.target.value)} />
                    <label htmlFor="floatingInput">Tarifa aplicada</label>
                </div>
                <button type="submit" className="btn btn-warning container my-3">Guardar</button>
            </form>
        </div>
               
    )
}