import { toast } from "react-toastify";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogged: false,
			token: localStorage.getItem('token') || null, // 🔹 Guarda el token
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
			setUser: (currentUser) => { setStore({ user: currentUser }) },
			setCurrentUser: (item) => { setStore({ currentUser: item }) },
			setCurrentCustomer: (customer) => { setStore({ currentCustomer: customer }) },
			setCurrentProvider: (provider) => { setStore({ currentProvider: provider }) },
			setCurrentVehicle: (vehicle) => { setStore({ currentVehicle: vehicle }) },
			setCurrentOrder: (order) => { setStore({ currentOrder: order }) },
			setCurrentLocation: (order) => { setStore({ currentLocation: location }) },


			exampleFunction: () => { getActions().changeColor(0, "green"); },
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
		

			login: async (dataToSend) => {
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
					if (response.status == 401) {
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

			deleteProviders: async (providerId) => {
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

			getDistance: async (originId, destinyId) => {
				const store = getStore();
				const token = localStorage.getItem("token");

				if (!token) {
					console.error("❌ No hay token disponible, no se puede obtener la distancia.");
					return null;
				}

				const origin = store.locations.find(loc => loc.id == originId);
				const destination = store.locations.find(loc => loc.id == destinyId);

				if (!origin || !destination) {
					console.error("❌ Origen o destino no encontrado.");
					return null;
				}

				const url = "https://api.openrouteservice.org/v2/matrix/driving-car";
				const headers = {
					"Authorization": "5b3ce3597851110001cf624838efe49eff8748218b0a9b692f3fb14e",
					"Content-Type": "application/json"
				};

				const body = {
					"locations": [
						[origin.longitude, origin.latitude],
						[destination.longitude, destination.latitude]
					],
					"metrics": ["distance"]
				};

				try {
					const response = await fetch(url, {
						method: "POST",
						headers: headers,
						body: JSON.stringify(body)
					});

					if (!response.ok) {
						console.error("❌ Error en la API de distancia:", response.status);
						return null;
					}

					const data = await response.json();
					const distance_meters = data.distances[0][1];
					const distance_km = (distance_meters / 1000).toFixed(2);

					return parseFloat(distance_km);
				} catch (error) {
					console.error("❌ Error en getDistance:", error);
					return null;
				}
			},

			addOrder: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/orders`;
				const token = localStorage.getItem("token"); // ✅ Obtener el token

				if (!token) {
					console.error("❌ No hay token disponible, no se puede crear la orden.");
					return false;
				}

				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}` // ✅ Agregar autenticación
					},
					body: JSON.stringify(dataToSend)
				};

				try {
					const response = await fetch(uri, options);

					if (response.status === 401) { //Si el token es inválido, forzar logout
						console.warn("Token inválido o expirado. Redirigiendo a login...");
						localStorage.removeItem("token");
						window.location.href = "/login";
						return false;
					}

					if (!response.ok) {
						console.error(`❌ Error al crear orden: ${response.status}`);
						return false;
					}

					const data = await response.json();
					console.log("✅ Orden creada correctamente:", data);
					return true;
				} catch (error) {
					console.error("❌ Error en addOrder:", error);
					return false;
				}
			},

			assignProvider: async (orderId, providerId, observations) => {
				const uri = `${process.env.BACKEND_URL}/api/assign-providers/${orderId}`;
				const token = localStorage.getItem("token");
			
				if (!token) {
					console.error("❌ No hay token disponible, no se puede asignar proveedor.");
					return false;
				}
			
				const options = {
					method: "",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify({ provider_id: providerId, observations })
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.error(`❌ Error al asignar proveedor: ${response.status}`);
						return false;
					}
			
					const data = await response.json();
					console.log("✅ Proveedor asignado correctamente:", data);
			
					// 🔹 Asegurar que el store se actualiza con la orden modificada
					const store = getStore();
					const updatedOrders = store.orders.map(order =>
						order.id === orderId ? { ...order, provider_id: providerId, status_order: "Order accepted" } : order
					);
					setStore({ orders: updatedOrders });
			
					// 🔹 Obtener datos actualizados desde el backend
					await getActions().getOrders();
			
					return true;
				} catch (error) {
					console.error("❌ Error en assignProvider:", error);
					return false;
				}
			},

			cancelOrder: async (orderId) => {
				const uri = `${process.env.BACKEND_URL}/api/orders/${orderId}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({ status: "Cancel" }),
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.error(`❌ Error al cancelar orden: ${response.status}`);
						return false;
					}
			
					const data = await response.json();
					console.log("✅ Orden cancelada:", data);
					
					getActions().getOrders(); // Actualiza la lista de órdenes
					return true;
				} catch (error) {
					console.error("❌ Error en cancelOrder:", error);
					return false;
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
