import { toast } from "react-toastify";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogged: false,
			token: localStorage.getItem('token') || null, // 🔹 Guarda el token
			alert: { text: '', background: 'primary', visible: 'false' },
			user: {},
			admins: [], // 🔹 Añadir lista de administradores
			currentUser: {},
			customers: [],
			currentCustomer: {},
			providers: [],
			currentProvider: {},
			vehicles: [],
			currentVehicle: {},
			orders: [],
			currentOrder: {},
			locations: [],
			currentLocation: {},
		},
		actions: {
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setAlert: (newAlert) => setStore({alert: newAlert}),
			setUser: (currentUser) => {setStore({user: currentUser})},
			setCurrentUser: (item) => {setStore({ currentUser: item})},
			setCurrentCustomer: (customer) => { setStore({ currentCustomer: customer}) },
			setCurrentProvider: (provider) => { setStore({ currentProvider: provider}) },
			setCurrentVehicle: (vehicle) => { setStore({ currentVehicle: vehicle}) },
			setCurrentOrder: (order) => { setStore({ currentOrder: order}) },
			setCurrentLocation: (order) => { setStore({ currentLocation: location}) },
			

			exampleFunction: () => {getActions().changeColor(0, "green");},
			getMessage: async () => {
				const uri = `${process.env.BACKEND_URL}/api/hello`
				const response = await fetch(uri);
				if (!response.ok) {
					// Gestinamos los errores
					console.log("Error:", response.status, response.statusText);
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
				return;
			},
			login: async (dataToSend) =>{
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
			
				console.log(options);
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText);
					if(response.status == 401){
						toast.error("Email o contraseña incorrecto");					
					}
					return;
				}
			
				const data = await response.json();
				toast.success("Usuario logeado correctamente");
			
				localStorage.setItem('token', data.access_token); // 🔹 Guardar token en localStorage
			
				setStore({
					isLogged: true,
					token: data.access_token, // 🔹 Añadido para que esté en el store
					user: data.results
				});
			
				if (data.results.role == "admin") {
					getActions().getCustomers();
					getActions().getProviders();
					getActions().getAdmins(); // 🔹 Llamar a getAdmins() si es admin
				}
			},
			
			accessProtected: async () => {
				const uri = `${process.env.BACKEND_URL}/api/protected`;
				const options = {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					// tratamos el erros
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data = await response.json()
				setStore({alert: {text: data.message, background: 'success', visible: true}})
			},
			addUser: async (dataToSend) => {
				const uri =`${process.env.BACKEND_URL}/api/users`
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					return  
				}
			},
			getUser: async (userId) => {
				try {
					const store = getStore();
					const token = store.token || localStorage.getItem('token');

					if (!token) {
						console.error("❌ No hay token disponible");
						return;
					}

					const uri = `${process.env.BACKEND_URL}/api/users/${userId}`;
					const options = {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${token}`,
						}
					};

					const response = await fetch(uri, options);
					if (!response.ok) throw new Error(`Error ${response.status}`);

					const data = await response.json();
					console.log("✅ Usuario obtenido:", data.results);

					setStore({ user: data.results });
				} catch (error) {
					console.error("❌ Error en getUser:", error);
				}
			},
			editUser: async (userId, dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/users/${userId}`;
				const options = {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.error(`❌ Error al editar usuario: ${response.status}`);
						return false;
					}
			
					const data = await response.json();
					setStore({ user: data.results }); // ✅ Actualiza el store con los nuevos datos
			
					return true;  // ✅ Indica que la edición fue exitosa
				} catch (error) {
					console.error("❌ Error en editUser:", error);
					return false;
				}
			},

			getAdmins: async () => {
				try {
					const store = getStore();
					const token = store.token || localStorage.getItem('token');

					if (!token) {
						console.error("❌ No hay token disponible para obtener admins");
						return;
					}

					const uri = `${process.env.BACKEND_URL}/api/users`;
					const options = {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					};

					const response = await fetch(uri, options);
					if (!response.ok) throw new Error(`Error ${response.status}`);

					const data = await response.json();
					console.log("✅ Lista de admins obtenida:", data.results);

					const userId = store.user.id; // 🔹 Obtener ID correctamente
					const admins = data.results.filter(user => user.role === "admin" && user.id !== userId);
					console.log("📌 Administradores filtrados:", admins);

					setStore({ admins });
				} catch (error) {
					console.error("❌ Error en getAdmins:", error);
				}
			},

			addAdmin: async (dataToSend) => {
				try {
					const uri = `${process.env.BACKEND_URL}/api/users-admin`;
					const token = localStorage.getItem("token");
			
					if (!token) {
						console.error("❌ No hay token disponible");
						return false;
					}
			
					const options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						},
						body: JSON.stringify(dataToSend)
					};
			
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error(`Error ${response.status}`);
			
					const data = await response.json();
					console.log("✅ Admin creado:", data);
					await getActions().getAdmins(); // Actualiza la lista de admins
			
					return true;
				} catch (error) {
					console.error("❌ Error en addAdmin:", error);
					return false;
				}
			},
			
							
			getCustomers: async () => {
				const uri = `${process.env.BACKEND_URL}/api/customers`;
				const options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error:", response.status, response.statusText);
				}
				const data = await response.json();
				setStore({ customers: data.results });
			},
			getCustomerById: async (customerId) => { /*descomentar con nuevo back*/
				/*const uri = `${process.env.BACKEND_URL}/api/customers/${customerId}`;
				const options = {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText);
					return;
				}

				const data = await response.json();*/

				setStore({ customer: dataTemp });  // Guardamos los datos del customer
			},
			addCustomer: async (dataToSend) => {
				const uri =`${process.env.BACKEND_URL}/api/customers`
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem('token')}`	
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					return  
				}
				setStore({alert: {text: 'Cliente agregado correctamente ', background: 'success', visible: true}})
				getActions().getCustomers()
			},
			deleteCustomer: async (customerId) => {		
				const uri = `${process.env.BACKEND_URL}/api/customers/${customerId}`;
				const options = {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					return
				}
				setStore({alert: {text: 'Cliente desactivado correctamente ', background: 'success', visible: true}})
				getActions().getCustomers();
			},
			editCustomer: async (customerId, dataToSend) =>{
				const uri= `${process.env.BACKEND_URL}/api/customers/${customerId}`;
				const options = {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					return;
				}
				setStore({alert: {text: 'Cliente editado correctamente ', background: 'success', visible: true}})

				getActions().getCustomers()
			},
			getProviders: async () => {
				const uri = `${process.env.BACKEND_URL}/api/providers`;
				const options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};
				
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error:", response.status, response.statusText);
				}
				const data = await response.json();
				setStore({ providers: data.results });
			},
			getProviderById: async (providerId) => { /*descomentar con nuevo back*/
				/*const uri = `${process.env.BACKEND_URL}/api/provider/${providerId}`;
				const options = {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText);
					return;
				}

				const data = await response.json();*/
				setStore({ provider: dataTemp });  // Guardamos los datos del provider
			},

			addProvider: async (dataToSend) => {
				const uri =`${process.env.BACKEND_URL}/api/providers`
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem('token')}`	
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					return  
				}
				getActions().getProviders()
			},
			deleteProviders: async (providerId ) => {		
				const uri = `${process.env.BACKEND_URL}/api/providers/${providerId}`;
				const options = {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error", response.status, response.statusText);
					return
				}
				setStore({alert: {text: 'Proveedor desactivado correctamente ', background: 'success', visible: true}})
				getActions().getProviders();
			},
			editProvider: async (providerId, dataToSend) =>{
				const uri= `${process.env.BACKEND_URL}/api/providers/${providerId}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					return;
				}
				setStore({alert: {text: 'Proveedor editado correctamente ', background: 'success', visible: true}})
				getActions().getProviders()
			},
			getVehicles: async () => {
				const uri = `${process.env.BACKEND_URL}/api/vehicles`;
				const options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error:", response.status, response.statusText);
				}
				const data = await response.json();
				setStore({ vehicles: data.results });
			},
			addVehicle: async (dataToSend) => {
				const uri =`${process.env.BACKEND_URL}/api/vehicles`
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					return  
				}
				setStore({alert: {text: 'Vehículo agregado correctamente ', background: 'success', visible: true}})
				getActions().getVehicles()
			},
			deleteVehicle: async (vehicleId) => {		
				const uri = `${process.env.BACKEND_URL}/api/vehicles/${vehicleId}`;
				const options = {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error", response.status, response.statusText);
					return
				}
				setStore({alert: {text: 'Vehículo eliminado correctamente ', background: 'success', visible: true}})
				getActions().getVehicles();
			},
			editVehicle: async (vehicleId, dataToSend) =>{
				const uri= `${process.env.BACKEND_URL}/api/vehicles/${vehicleId}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					return;
				}
				setStore({alert: {text: 'Vehículo editado correctamente ', background: 'success', visible: true}})
				getActions().getVehicles()
			},
			getOrders: async () => {
				const uri = `${process.env.BACKEND_URL}/api/orders`;
				const options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error:", response.status, response.statusText);
				}
				const data = await response.json();
				setStore({ orders: data.results });
			},
			getLocations: async () => {
				const uri = `${process.env.BACKEND_URL}/api/locations`;
				const options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error:", response.status, response.statusText);
				}
				const data = await response.json();
				setStore({ locations: data.results });
			},
			addOrder: async (dataToSend) => {
				const uri =`${process.env.BACKEND_URL}/api/orders`
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('error:', response.status, response.statusText)
					return  
				}
			},
			
		}
	};
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
