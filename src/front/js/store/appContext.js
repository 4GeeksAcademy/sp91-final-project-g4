import React, { useState, useEffect } from "react";
import getState from "./flux.js";
import { jwtDecode } from "jwt-decode";



// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);


// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);
		/*
		  EDIT THIS!
		  This function is the equivalent to "window.onLoad", it only runs once on the entire application lifetime
		  you should do your ajax requests or fetch api requests here. Do not use setState() to save data in the
		  store, instead use actions, like this:
		*/
		useEffect(() => {
			/* state.actions.getMessage(); */  // Calling this function from the flux.js actions
			state.actions.getVehicles(); 
			const token = localStorage.getItem('token')
			if (token){
				const decodeToken = jwtDecode(token)
				console.log(decodeToken);
				const nowDate = new Date().getTime()/1000
				const result = decodeToken.exp > Math.floor(nowDate)
				console.log(result);
				console.log(nowDate);
				if (result) {
					state.actions.setIsLogged(true);
					state.actions.getUser(decodeToken.user_id)
					state.actions.getProviderById(decodeToken.provider_id);
					state.actions.getCustomerById(decodeToken.customer_id);
				}
				else{
					state.actions.setIsLogged(false);
				}
				

				
			}
		}, []);

		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	
	return StoreWrapper;
};

export default injectContext;
