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
				const uri = `${process.env.BACKEND_URL}/api/users`;
				const token = localStorage.getItem("token"); // ✅ Obtener el token
			
				if (!token) {
					console.error("❌ No hay token disponible, no se puede añadir usuario.");
					return false;
				}
			
				// ✅ Validar que `customer_id` esté presente si el rol es "customer"
				if (dataToSend.role === "customer" && !dataToSend.customer_id) {
					console.error("❌ Faltante: customer_id es obligatorio para clientes.");
					return false;
				}
			
				// ✅ Validar que `password` esté presente
				if (!dataToSend.password) {
					console.error("❌ Faltante: password es obligatorio.");
					return false;
				}
			
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}` // ✅ Incluir token
					},
					body: JSON.stringify(dataToSend)
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						const errorData = await response.json();
						console.error(`❌ Error al añadir usuario: ${response.status}`, errorData);
						return false;
					}
			
					const data = await response.json();
					console.log("✅ Usuario creado:", data);
			
					return true; // ✅ Indicar que la operación fue exitosa
				} catch (error) {
					console.error("❌ Error en addUser:", error);
					return false;
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
				const token = localStorage.getItem("token");
			
				if (!token) {
					console.error("❌ No hay token disponible, no se puede obtener la lista de clientes.");
					return;
				}
			
				const options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`
					}
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.error(`❌ Error al obtener clientes: ${response.status}`);
						return;
					}
					const data = await response.json();
					setStore({ customers: data.results || [] }); // ✅ Asegurar que customers siempre sea un array
				} catch (error) {
					console.error("❌ Error en getCustomers:", error);
				}
			},
			
			getCustomerById: async (customerId) => {
				const uri = `${process.env.BACKEND_URL}/api/customers/${customerId}`;
				const token = localStorage.getItem("token"); // ✅ Obtener token
			
				if (!token) {
					console.error("❌ No hay token disponible, no se puede obtener cliente.");
					return;
				}
			
				const options = {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${token}`
					}
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.error(`❌ Error al obtener cliente: ${response.status}`);
						return;
					}
			
					const data = await response.json();
					console.log("✅ Cliente obtenido:", data.results);
			
					setStore({ currentCustomer: data.results }); // ✅ Guardar cliente en el store
				} catch (error) {
					console.error("❌ Error en getCustomerById:", error);
				}
			},
			
			addCustomer: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/customers`;
				const store = getStore();
				const token = store.token || localStorage.getItem("token"); // ✅ Asegurar que siempre use el token correcto
			
				if (!token) {
					console.error("❌ No hay token disponible, no se puede agregar cliente.");
					return false;
				}
			
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}` // ✅ Usar la variable `token` obtenida
					},
					body: JSON.stringify(dataToSend)
				};
			
				try {
					const response = await fetch(uri, options);
					
					if (!response.ok) {
						const errorData = await response.json(); // 🔹 Captura el error del backend
						console.error(`❌ Error al agregar cliente: ${response.status}`, errorData);
						return false;
					}
			
					const data = await response.json();
					console.log("✅ Cliente agregado correctamente:", data);
			
					setStore({ alert: { text: 'Cliente agregado correctamente', background: 'success', visible: true } });
			
					getActions().getCustomers(); // 🔹 Actualiza la lista de clientes
			
					return true; // ✅ Retornar `true` indica éxito
				} catch (error) {
					console.error("❌ Error en addCustomer:", error);
					return false;
				}
			},
			
			deleteCustomer: async (customerId) => {
				const uri = `${process.env.BACKEND_URL}/api/customers/${customerId}`;
				const options = {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("error", response.status, response.statusText);
					return;
				}
				getActions().getCustomers();
			},
			editCustomer: async (customerId, dataToSend) => {
				try {
					const uri = `${process.env.BACKEND_URL}/api/customers/${customerId}`;
					const options = {
						method: "PUT",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem('token')}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify(dataToSend)
					};
			
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error(`Error ${response.status}`);
			
					const data = await response.json();
					setStore({ currentCustomer: data.results }); // ✅ Actualizar el cliente editado en el store
					getActions().getCustomers(); // ✅ Refrescar la lista de clientes en la UI
			
					return true;
				} catch (error) {
					console.error("❌ Error en editCustomer:", error);
					return false;
				}
			},
			
			getProviders: async () => {
				const uri = `${process.env.BACKEND_URL}/api/providers?include_inactive=true`;
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("❌ No hay token disponible, no se puede obtener la lista de proveedores.");
                    return;
                }

                const options = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                try {
                    const response = await fetch(uri, options);
                    if (!response.ok) {
                        console.error(`❌ Error al obtener proveedores: ${response.status}`);
                        return;
                    }

                    const data = await response.json();
                    setStore({ providers: data.results || [] }); // ✅ Asegurar que providers siempre sea un array
                } catch (error) {
                    console.error("❌ Error en getProviders:", error);
                }
            },

            getProviderById: async (providerId) => {
                const uri = `${process.env.BACKEND_URL}/api/providers/${providerId}`;
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("❌ No hay token disponible, no se puede obtener proveedor.");
                    return;
                }

                const options = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };

                try {
                    const response = await fetch(uri, options);
                    if (!response.ok) {
                        console.error(`❌ Error al obtener proveedor: ${response.status}`);
                        return;
                    }

                    const data = await response.json();
                    console.log("✅ Proveedor obtenido:", data.results);
                    setStore({ currentProvider: data.results });
                } catch (error) {
                    console.error("❌ Error en getProviderById:", error);
                }
            },

			addProvider: async (dataToSend) => {
                const uri = `${process.env.BACKEND_URL}/api/providers`;
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("❌ No hay token disponible, no se puede añadir proveedor.");
                    return;
                }

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToSend)
                };

                try {
                    const response = await fetch(uri, options);
                    if (!response.ok) {
                        console.error(`❌ Error al añadir proveedor: ${response.status}`);
                        return;
                    }

                    console.log("✅ Proveedor añadido correctamente");
                    getActions().getProviders(); // ✅ Actualiza la lista de proveedores
                } catch (error) {
                    console.error("❌ Error en addProvider:", error);
                }
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
			editProvider: async (providerId, dataToSend) => {
                const uri = `${process.env.BACKEND_URL}/api/providers/${providerId}`;
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("❌ No hay token disponible, no se puede editar proveedor.");
                    return;
                }

                const options = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToSend)
                };

                try {
                    const response = await fetch(uri, options);
                    if (!response.ok) {
                        console.error(`❌ Error al editar proveedor: ${response.status}`);
                        return;
                    }

                    console.log("✅ Proveedor editado correctamente");
                    getActions().getProviders(); // ✅ Refrescar la lista de proveedores
                } catch (error) {
                    console.error("❌ Error en editProvider:", error);
                }
            },
			getVehicles: async () => {
				const uri = `${process.env.BACKEND_URL}/api/vehicles?include_inactive=true`; // ✅ Traer activos e inactivos
				const options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				};
				
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						throw new Error(`Error ${response.status}: ${response.statusText}`);
					}
					const data = await response.json();
					setStore({ vehicles: data.results });
				} catch (error) {
					console.error("❌ Error en getVehicles:", error);
				}
			},
			
			addVehicle: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/vehicles`;
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(dataToSend)
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						throw new Error(`Error ${response.status}: ${response.statusText}`);
					}
					setStore({ alert: { text: 'Vehículo agregado correctamente', background: 'success', visible: true } });
					getActions().getVehicles();
				} catch (error) {
					console.error("❌ Error en addVehicle:", error);
				}
			},
			
			editVehicle: async (vehicleId, dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/vehicles/${vehicleId}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify(dataToSend)
				};
			
				try {
					console.log("📤 Enviando datos a la API:", dataToSend);
			
					const response = await fetch(uri, options);
					if (!response.ok) {
						const errorData = await response.json();
						console.error("❌ Error en la API:", response.status, errorData);
						return false;
					}
			
					const data = await response.json();
					console.log("✅ Respuesta de la API:", data);
			
					// 🔹 Actualizar el estado directamente para reflejar el cambio sin esperar a getVehicles
					const store = getStore();
					const updatedVehicles = store.vehicles.map(vehicle => 
						vehicle.id === vehicleId ? { ...vehicle, ...dataToSend } : vehicle
					);
					setStore({ vehicles: updatedVehicles });
			
					return true;
				} catch (error) {
					console.error("❌ Error en editVehicle:", error);
					return false;
				}
			},
			
			toggleVehicleStatus: async (vehicleId, currentStatus) => {
				const updatedData = { is_active: !currentStatus }; // ✅ Alternar estado
				const uri = `${process.env.BACKEND_URL}/api/vehicles/${vehicleId}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(updatedData)
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						throw new Error(`Error ${response.status}: ${response.statusText}`);
					}
					setStore({ alert: { text: `Vehículo ${currentStatus ? "desactivado" : "activado"} correctamente`, background: 'primary', visible: true } });
					getActions().getVehicles(); // ✅ Recargar lista después de cambio de estado
				} catch (error) {
					console.error("❌ Error en toggleVehicleStatus:", error);
				}
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
			toggleProviderStatus: async (provider) => {
                const updatedData = { is_active: !provider.is_active };
                await getActions().editProvider(provider.id, updatedData);
            },
		}
	};
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
