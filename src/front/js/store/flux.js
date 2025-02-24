const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogged: false,
			user: {},
			alert: {text:'', background: 'primary', visible: 'false'},
			currentUser: {},
		},
		actions: {
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setAlert: (newAlert) => setStore({alert: newAlert}),
			setUser: (currentUser) => {setStore({user: currentUser})},
			setCurrentUser: (item) => {setStore({ currentUser: item})},

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
				const uri = `${process.env.BACKEND_URL}/api/login`
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
					console.log('error:', response.status, response.statusText)
					if(response.status == 401){
						setStore({alert: {text: 'Email o contraseña no válido', background: 'danger', visible: true}})					
					}
					return
				}
				const data = await response.json()
				console.log(data);
				localStorage.setItem('token', data.access_token)
				setStore({
					isLogged: true,
					user: data.results
				})		
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
		}
	};
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
