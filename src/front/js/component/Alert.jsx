import React, { useContext } from "react";
import { Context } from "../store/appContext.js";

export const Alert = () => {

  const { store, actions } = useContext(Context);

  const handleClose = () => {
    actions.setAlert({ text: "", background: "primary", visible: false });
  };
  
  return (
    <div className={`container d-flex justify-content-center align-items-center ${store.alert.visible ? '' : 'd-none'}`} style={{ minHeight: "10vh" }}>
      <div className={`alert alert-${store.alert.background} text-center d-flex flex-column align-items-center`} style={{ maxWidth: "300px" }} role="alert">
        <p className="mb-2">{store.alert.text}</p>
        <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  );
};