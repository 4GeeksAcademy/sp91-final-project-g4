from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from datetime import datetime
from api.models import db, Users, Vehicles, Customers, OrderDocuments, Providers, Locations, Orders, Contact
import enum


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# API Key de OpenRouteService para geolocalización (Debes reemplazarla con una válida)
ORS_API_KEY = "5b3ce3597851110001cf624838efe49eff8748218b0a9b692f3fb14e"

@api.route('/admins', methods=['GET'])
@jwt_required()
def get_admins():
    """
    Endpoint para obtener solo los usuarios con rol de administrador.
    Solo los administradores pueden acceder a esta información.
    """
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':  # Solo los administradores pueden acceder
        return jsonify({"message": "Usuario no autorizado"}), 403
    admins = db.session.execute(db.select(Users).where(Users.role == "admin", Users.is_active == True)).scalars()
    result = [admin.serialize() for admin in admins]
    return jsonify({"message": "Lista de administradores", "results": result}), 200

@api.route("/calculate-distances", methods=["POST"])
@jwt_required()  # Requiere autenticación JWT
def calculate_distance():
    response_body = {}
    # Obtener datos de la solicitud
    data = request.json
    origin_id = data.get("origin_id")
    destination_id = data.get("destination_id")
    # Validar que se proporcionaron las ubicaciones
    if not origin_id or not destination_id:
        return jsonify({"message": "Debes proporcionar 'origin_id' y 'destination_id'"}), 400
    # Buscar las ubicaciones en la base de datos
    origin = db.session.execute(db.select(Locations).where(Locations.id == origin_id)).scalar()
    destination = db.session.execute(db.select(Locations).where(Locations.id == destination_id)).scalar()
    if not origin or not destination:
        return jsonify({"message": "Una o ambas ubicaciones no existen"}), 404
    # Construir la petición a la API externa
    url = "https://api.openrouteservice.org/v2/matrix/driving-car"
    headers = {"Authorization": ORS_API_KEY, "Content-Type": "application/json"}
    body = {
        "locations": [
            [origin.longitude, origin.latitude],
            [destination.longitude, destination.latitude]
        ],"metrics": ["distance"]}
    # Hacer la solicitud a OpenRouteService
    try:
        response = requests.post(url, json=body, headers=headers)
        response_data = response.json()
        # Extraer la distancia en metros y convertir a kilómetros
        distance_meters = response_data["distances"][0][1]
        distance_km = round(distance_meters / 1000, 2)
        # Construir respuesta
        response_body["message"] = "Distancia calculada correctamente"
        response_body["results"] = {
            "origin": origin.name,
            "destination": destination.name,
            "distance_km": distance_km}
        return response_body, 200
    except Exception as e:
        return jsonify({"message": "Error al conectar con OpenRouteService", "error": str(e)}), 500


@api.route("/users-admin", methods=["POST"])
# AUTENTICACION OPCIONAL PRIMER ADMIN SIGUIENTES CON TOKEN - OK
@jwt_required(optional=True)  
def create_admin():
    # Verificar si ya existen admins en la base de datos
    existing_admin = db.session.execute(db.select(Users).where(Users.role == "admin")).scalar() 
    if existing_admin:  # Si ya hay un admin, requiere autenticación
        claims = get_jwt()
        role_from_token = claims.get("role")
        if role_from_token != "admin":
            return jsonify({"message": "No autorizado. Solo un admin puede crear otro admin."}), 403
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")
    last_name = data.get("last_name", "")
    phone = data.get("phone", "")
    if not email or not password:
        return jsonify({"message": "Email y password son requeridos"}), 400
    # Verificar si el usuario ya existe
    existing_user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if existing_user:
        return jsonify({"message": "El usuario ya existe"}), 409
    new_admin = Users(
        email=email,
        name=name,
        last_name=last_name,
        phone=phone,
        role="admin",  # 🔹 SOLO admin
        is_active=True)
    # Encriptar contraseña
    new_admin.set_password(password)
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": "Usuario ADMIN creado exitosamente"}), 201


@api.route("/users", methods=["POST"])
# USUARIOS PROVIDER/CUSTOMER SE CREAN Y SE ASIGNAN DIRECTAMENTE CON ID CUSTOMER/PROVIDER - SOLO DA ALTA ADMIN - OK
@jwt_required()  
def create_user():
    """
    Solo un ADMIN puede crear usuarios.
    Si `customer_id` es proporcionado, el usuario será `customer`.
    Si `provider_id` es proporcionado, el usuario será `provider`.
    NO se puede asignar ambos roles a la vez.
    Un usuario no puede ser admin con un `customer_id` o `provider_id`.
    """
    response_body = {}
    additional_claims = get_jwt()  # Se requiere autenticación obligatoria
    role_from_token = additional_claims.get("role")
    # Solo los `admin` pueden acceder a este endpoint
    if role_from_token != "admin":
        response_body['message'] = "No autorizado. Solo los administradores pueden crear usuarios."
        return jsonify(response_body), 403
    # Obtener datos del request
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")
    last_name = data.get("last_name", "")
    phone = data.get("phone", "")
    customer_id = data.get("customer_id")
    provider_id = data.get("provider_id")
    # Validar datos obligatorios
    if not email or not password:
        return jsonify({"message": "Email y password son requeridos"}), 400
    # Verificar si el usuario ya existe
    existing_user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if existing_user:
        return jsonify({"message": "El usuario ya existe"}), 409
    # No se pueden asignar ambos roles (`customer` y `provider`)
    if customer_id and provider_id:
        return jsonify({"message": "Un usuario no puede ser customer y provider al mismo tiempo"}), 400
    # Si no se proporciona `customer_id` ni `provider_id`, error
    if not customer_id and not provider_id:
        return jsonify({"message": "Debe proporcionar un customer_id o provider_id para asignar un rol"}), 400
    # Determinar el rol del usuario basado en `customer_id` o `provider_id`
    if customer_id:
        existing_customer = db.session.execute(db.select(Customers).where(Customers.id == customer_id)).scalar()
        if not existing_customer:
            return jsonify({"message": "El cliente especificado no existe"}), 404
        role = "customer"
    elif provider_id:
        existing_provider = db.session.execute(db.select(Providers).where(Providers.id == provider_id)).scalar()
        if not existing_provider:
            return jsonify({"message": "El proveedor especificado no existe"}), 404
        role = "provider"
    # Crear el nuevo usuario con el rol determinado
    new_user = Users(
        email=email,
        name=name,
        last_name=last_name,
        phone=phone,
        role=role,  # Se asigna automáticamente
        is_active=True)
    # Asociar el usuario al `customer` o `provider`
    if role == "customer":
        new_user.customer_id = customer_id
    if role == "provider":
        new_user.provider_id = provider_id
    # Encriptar la contraseña
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": f"Usuario {role} creado exitosamente"}), 201


@api.route("/login", methods=["POST"])
# ALL - OK
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if not user or not user.check_password(password):  # Comprobar la contraseña encriptada
        response_body["message"] = "User or password incorrect"
        return response_body, 401
    if not user.is_active:
        response_body["message"] = "User is inactive, please contact support"
        return response_body, 403
    access_token = create_access_token(identity=email, additional_claims={"user_id": user.id, "role": user.role, "provider_id":user.provider_id, "customer_id":user.customer_id})
    response_body['access_token'] = access_token
    response_body['message'] = 'User logged'
    response_body['results'] = user.serialize()
    return response_body, 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    current_user = get_jwt_identity() # El mail
    additional_claims = get_jwt() # Datos adicionales
    response_body['message'] = f'logged as {current_user}'
    response_body['user_id'] = additional_claims.get("user_id")
    response_body['role'] = additional_claims.get("role")
    return response_body, 200


@api.route('/users', methods=['GET'])
# SOLO ADMIN ACCEDE A ESTO - OK
@jwt_required()
def users():
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 401
    include_inactive = request.args.get("include_inactive", "false").lower() == "true"
    query = db.select(Users)
    if not include_inactive:
        query = query.where(Users.is_active == True)
    rows = db.session.execute(db.select(Users)).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = "List of users" 
    response_body['results'] = result
    return response_body, 200


@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
# HACER QUE CADA CLIENTE Y PROVIDER VEA LOS SUYOS - ADMIN PUEDE HACER ALL - OK
@jwt_required()
def manage_user(id):
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    user_id = additional_claims.get("user_id")
    user = db.session.get(Users, id) # Buscar el usuario
    if not user:
        return jsonify({"message": "User not found"}), 404
    # ADMIN puede hacer cualquier operación
    if role == "admin":
        if request.method == 'GET':
            return jsonify({"message": f'User {id} found', "results": user.serialize()}), 200     
        if request.method == 'PUT':
            data = request.json
            user.name = data.get("name", user.name)
            user.last_name = data.get("last_name", user.last_name)
            user.phone = data.get("phone", user.phone)
            user.role = data.get("role", user.role)
            if "is_active" in data:
                if user.id == user_id:  # Evitar que un Admin se desactive a sí mismo
                    return jsonify({"message": "No puedes desactivarte a ti mismo"}), 403
                user.is_active = data["is_active"]
            db.session.commit()
            return jsonify({"message": f'User {id} updated successfully', "results": user.serialize()}), 200   
        if request.method == 'DELETE':
            if user.id == user_id:  # Evitar que un Admin se desactive a sí mismo
                return jsonify({"message": "No puedes desactivarte a ti mismo"}), 403
            user.is_active = False
            db.session.commit()
            return jsonify({"message": f'User {id} deactivated successfully'}), 200
    # CUSTOMERS solo pueden ver sus propios usuarios
    customer = db.session.execute(db.select(Customers).where(Customers.id == user.customer_id)).scalar()
    if role == "customer":
        if not customer or user.customer_id != customer.id:
            return jsonify({"message": "Unauthorized access"}), 403
        if request.method == 'GET':
            return jsonify({"message": f'User {id} found', "results": user.serialize()}), 200
    # PROVIDERS solo pueden ver sus propios usuarios
    provider = db.session.execute(db.select(Providers).where(Providers.id == user.provider_id)).scalar()
    if role == "provider":
        if not provider or user.provider_id != provider.id:
            return jsonify({"message": "Unauthorized access"}), 403
        if request.method == 'GET':
            return jsonify({"message": f'User {id} found', "results": user.serialize()}), 200
    return jsonify({"message": "Unauthorized access"}), 403


@api.route('/customers', methods=['GET', 'POST'])
# SOLO ADMIN PUEDE HACER GET DE TODOS Y POST - OK
@jwt_required()
def customers():
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 401 
    include_inactive = request.args.get("include_inactive", "false").lower() == "true"
    query = db.select(Customers)
    if not include_inactive:
        query = query.where(Customers.is_active == True)
    if request.method == 'GET':
        rows = db.session.execute(db.select(Customers)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Listado de clientes" 
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        cust_base_tariff = data.get("cust_base_tariff", 0.0)
        new_customer = Customers(
            company_name=data.get("company_name"),
            contact_name=data.get("contact_name"),  # dejar en blanco
            phone=data.get("phone"),
            address=data.get("address"),
            cust_base_tariff=cust_base_tariff,
            is_active=True)
        db.session.add(new_customer)
        db.session.commit()
        response_body['message'] = "Cliente creado exitosamente"
        response_body['results'] = new_customer.serialize()
        return response_body, 201
    

@api.route('/customers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
# ADMIN HACE ALL Y CLIENTE SOLO PUEDE HACER GET Y VE LO SUYO RECUPERANDO SUS PROPIOS CONTACTOS ASOCIADOS - DELETE = DESACTIVAR - OK
@jwt_required()
def customer(id):
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    user_id = additional_claims.get("user_id")
    customer = db.session.get(Customers, id)  # Buscar el cliente en la base de datos
    if not customer:
        return jsonify({"message": "Customer not found"}), 404
    # ADMIN puede hacer todo
    if role == "admin":  
        if request.method == 'GET':
            users = db.session.execute(db.select(Users).where(Users.customer_id == id)).scalars()
            user_list = [user.serialize() for user in users]
            customer_data = customer.serialize()
            customer_data["users"] = user_list  # Agregar los usuarios ligados
            return jsonify({"message": f'Customer {id} found', "results": customer_data}), 200     
        if request.method == 'PUT':
            data = request.json
            customer.company_name = data.get("company_name", customer.company_name)
            customer.contact_name = data.get("contact_name", customer.contact_name)
            customer.phone = data.get("phone", customer.phone)
            customer.address = data.get("address", customer.address)
            if "cust_base_tariff" in data:
                try:
                    customer.cust_base_tariff = float(data["cust_base_tariff"])  # ✅ Convertir a número
                except ValueError:
                    return jsonify({"message": "Invalid value for cust_base_tariff"}), 400  # Manejo de error
            if "is_active" in data:
                customer.is_active = data["is_active"]  # Permitir activar/desactivar
            db.session.commit()
            return jsonify({"message": f'Customer {id} updated successfully', "results": customer.serialize()}), 200  
        if request.method == 'DELETE':
            customer.is_active = False  # En lugar de eliminar, solo se desactiva
            db.session.commit()
            return jsonify({"message": f"Customer {id} deactivated successfully"}), 200  
    # CUSTOMERS solo pueden VER su propia información (no modificarla)
    user = db.session.get(Users, user_id)
    if role == "customer":
        if not user or user.customer_id != customer.id:
            return jsonify({"message": "Unauthorized access"}), 403  # No puede modificar otro cliente      
        if request.method == 'GET':
            users = db.session.execute(db.select(Users).where(Users.customer_id == id)).scalars()
            user_list = [user.serialize() for user in users]
            customer_data = customer.serialize()
            customer_data["users"] = user_list  # Agregar los usuarios ligados
            return jsonify({"message": f'Customer {id} found', "results": customer_data}), 200   
        # Customers NO pueden modificar datos
        if request.method == 'PUT':
            return jsonify({"message": "Unauthorized access"}), 403  
    return jsonify({"message": "Unauthorized access"}), 403


@api.route('/providers', methods=['GET', 'POST'])
@jwt_required()
def providers():
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':  # Solo los administradores pueden acceder
        response_body['message'] = 'Usuario no autorizado'
        return jsonify(response_body), 401 
    # Verifica si se deben incluir inactivos
    include_inactive = request.args.get("include_inactive", "false").lower() == "true"
    # Construir consulta para obtener proveedores
    query = db.select(Providers)
    if not include_inactive:
        query = query.where(Providers.is_active == True)  # Filtra por activos si no se solicita lo contrario
    if request.method == 'GET':
        rows = db.session.execute(query).scalars()
        result = [row.serialize() for row in rows]  # Convertir cada proveedor en JSON
        response_body['message'] = "Listado de proveedores"
        response_body['results'] = result
        return jsonify(response_body), 200
    if request.method == 'POST':
        data = request.json
        prov_base_tariff = data.get("prov_base_tariff", 0.0)  
        new_provider = Providers(
            company_name=data.get("company_name"),
            contact_name=data.get("contact_name"),  # Puede quedar en blanco
            phone=data.get("phone"),
            address=data.get("address"),
            prov_base_tariff=prov_base_tariff,
            is_active=True)  # Siempre activos al crearse
        db.session.add(new_provider)
        db.session.commit()
        response_body['message'] = "Proveedor creado exitosamente"
        response_body['results'] = new_provider.serialize()
        return jsonify(response_body), 201



@api.route('/providers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
# ADMIN HACE ALL Y PROVIDER SOLO PUEDE HACER GET Y VE LO SUYO RECUPERANDO SUS PROPIOS CONTACTOS ASOCIADOS - DELETE = DESACTIVAR - OK
@jwt_required()
def provider(id): 
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    user_id = additional_claims.get("user_id")  
    provider = db.session.get(Providers, id)  # Buscar el proveedor en la base de datos
    if not provider:
        return jsonify({"message": "Proveedor no encontrado"}), 404
    # ADMIN puede hacer todo   
    if role == "admin":
        if request.method == 'GET':
            users = db.session.execute(db.select(Users).where(Users.provider_id == id)).scalars()
            user_list = [user.serialize() for user in users]
            provider_data = provider.serialize()
            provider_data["users"] = user_list  # Agregar los usuarios ligados
            return jsonify({"message": f'Proveedor {id} encontrado', "results": provider_data}), 200     
        if request.method == 'PUT':
            data = request.json
            provider.company_name = data.get("company_name", provider.company_name)
            provider.contact_name = data.get("contact_name", provider.contact_name)
            provider.phone = data.get("phone", provider.phone)
            provider.address = data.get("address", provider.address)
            if "prov_base_tariff" in data:
                try:
                    provider.prov_base_tariff = float(data["prov_base_tariff"])  # ✅ Convertir a número
                except ValueError:
                    return jsonify({"message": "Valor inválido para prov_base_tariff"}), 400  # Manejo de error      
            # ✅ Manejo del estado activo/inactivo
            if "is_active" in data:
                provider.is_active = data["is_active"]  # Permitir activar/desactivar
            db.session.commit()
            return jsonify({"message": f'Proveedor {id} actualizado correctamente', "results": provider.serialize()}), 200      
        if request.method == 'DELETE':
            provider.is_active = False  # En lugar de eliminar, solo se desactiva
            db.session.commit()
            return jsonify({"message": f"Proveedor {id} desactivado correctamente"}), 200  
    # PROVIDERS solo pueden VER su propia información (no modificarla)
    user = db.session.get(Users, user_id)
    if role == "provider":
        if not user or user.provider_id != provider.id:
            return jsonify({"message": "Acceso no autorizado"}), 403  # No puede modificar otro proveedor       
        if request.method == 'GET':
            users = db.session.execute(db.select(Users).where(Users.provider_id == id)).scalars()
            user_list = [user.serialize() for user in users]
            provider_data = provider.serialize()
            provider_data["users"] = user_list  # Agregar los usuarios ligados
            return jsonify({"message": f'Proveedor {id} encontrado', "results": provider_data}), 200 
        # Providers NO pueden modificar datos
        if request.method == 'PUT':
            return jsonify({"message": "Acceso no autorizado"}), 403  
    return jsonify({"message": "Acceso no autorizado"}), 403


@api.route('/vehicles', methods=['GET'])
# NO HACE FALTA PROTEGER - OK
def get_vehicles():
    response_body = {}
    rows = db.session.execute(db.select(Vehicles)).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = "Lista de vehiculos"
    response_body['results'] = result
    return response_body, 200


@api.route('/vehicles', methods=['POST'])
# SOLO ADMIN PUEDE HACER POST - OK
@jwt_required()
def vehicles():
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 401
    data = request.json
    new_vehicle = Vehicles(
        brand=data.get("brand"),
        model=data.get("model"),
        vehicle_type=data.get("vehicle_type"))
        
    db.session.add(new_vehicle)
    db.session.commit()
    response_body['message'] = " Vehiculo creado exitosamente"
    response_body['results'] = new_vehicle.serialize()
    return response_body, 201


@api.route('/vehicles/<int:id>', methods=['GET', 'PUT', 'DELETE'])
# SOLO ADMIN PUEDE HACER ALL - PROVIDERS Y CUSTOMERS SOLO GET - DELETE = DESACTIVAR - OK
@jwt_required()
def vehicle(id):
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    vehicle = db.session.get(Vehicles, id)
    if not vehicle:
        response_body['message'] = 'Vehiculo no encontrado'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'Vehiculo {id} encontrado'
        response_body['results'] = vehicle.serialize()
        return response_body, 200
    if role != 'admin':
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 401
    if request.method == 'PUT':  # ✅ Ahora permite actualizar `is_active`
        data = request.json
        vehicle.brand = data.get("brand", vehicle.brand)
        vehicle.model = data.get("model", vehicle.model)
        vehicle.vehicle_type = data.get("vehicle_type", vehicle.vehicle_type)      
        # permite activar/desactivar el vehículo
        if "is_active" in data:
            vehicle.is_active = data["is_active"]
        db.session.commit()
        response_body['message'] = f'Vehiculo {id} actualizado correctamente'
        response_body['results'] = vehicle.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        vehicle.is_active = False  # Deshabilita el vehículo en lugar de eliminarlo
        db.session.commit()
        response_body['message'] = f'Vehiculo {id} deshabilitado correctamente'
        return response_body, 200


@api.route('/vehicles-admin', methods=['POST'])
# SOLO ADMIN PUEDE HACER - OK
@jwt_required()
def vehicles_admin():
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 401
    if request.method == 'POST':
        my_list = request.json
        for data in my_list:
            new_vehicle = Vehicles(
                brand=data.get("brand"),
                model=data.get("model"),
                vehicle_type=data.get("vehicle_type"),
                is_active=data.get("is_active", True))
            db.session.add(new_vehicle)
            db.session.commit()
        response_body['message'] = " Vehiculo creado exitosamente"
        return response_body, 201
    

@api.route('/locations-admin', methods=['POST'])
# SOLO ADMIN PUEDE HACER - OK
@jwt_required()
def locations_admin():
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 401
    if request.method == 'POST':
        my_list = request.json  
        for data in my_list:
            new_location = Locations(
                region=data.get("region"),
                city=data.get("city"),    
                postal_code=data.get("postal_code"),  
                country=data.get("country"),
                latitude=data.get("latitude"),
                longitude=data.get("longitude"))
            db.session.add(new_location)  
        db.session.commit() 
        response_body['message'] = "Localidades creadas exitosamente."
        response_body['total_created'] = len(my_list)
        return jsonify(response_body), 201 
    return jsonify({'error': 'Método no permitido'}), 405


@api.route('/locations', methods=['GET'])
# NO HACE FALTA PROTEGER - OK
def locations():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Locations)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Lista de localidades"
        response_body['results'] = result
        return response_body, 200
    

@api.route('/locations/<int:id>', methods=['GET'])
# NO HACE FALTA PROTEGER - OK
def location(id):
    response_body = {}
    location = db.session.get(Locations, id)
    if not location:
        response_body['message'] = 'Localidad no encontrada'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'Localidad {id} encontrada'
        response_body['results'] = location.serialize()
        return response_body, 200
    

@api.route('/orders', methods=['GET', 'POST'])
@jwt_required()
def orders():
    response_body = {}
    user_email = get_jwt_identity()
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = claims.get("user_id")
    customer_id = claims.get("customer_id")
    provider_id = claims.get("provider_id")
    print(f"🔍 JWT Identity (Email): {user_email}")
    
    # 📌 Obtener órdenes (GET)
    if request.method == 'GET':
        query = db.select(Orders)
        if user_role == "customer":  # Solo ve sus propias órdenes          
            customer = db.session.execute(db.select(Customers).where(Customers.id == customer_id)).scalar()
            if not customer:
                return jsonify({"message": "Customer not found"}), 404
            query = query.where(Orders.customer_id == customer_id)
        elif user_role == "provider":  # Solo ve sus órdenes asignadas          
            provider = db.session.execute(db.select(Providers).where(Providers.id == provider_id)).scalar()
            if not provider:
                return jsonify({"message": "Provider not found"}), 404
            query = query.where(Orders.provider_id == provider_id)
        # Admin puede ver todas las órdenes
        orders = db.session.execute(query).scalars()
        result = [order.serialize() for order in orders]
        
        response_body['message'] = "List of orders"
        response_body['results'] = result
        return jsonify(response_body), 200

    # 📌 Crear una nueva orden (POST)
    if request.method == 'POST':
        if user_role not in ["customer", "admin"]:
            return jsonify({"message": "Only customers and admins can create orders"}), 403
        
        data = request.json
        origin_id = data.get("origin_id")
        destination_id = data.get("destiny_id")
        vehicle_id = data.get("vehicle_id")
        print(data)

        # 🔹 Validación de campos obligatorios
        if not origin_id or not destination_id or not vehicle_id:
            return jsonify({"message": "Missing required fields (origin_id, destiny_id, vehicle_id)"}), 400
        
        # 🔹 Buscar ubicaciones y vehículo
        origin = db.session.get(Locations, origin_id)
        destination = db.session.get(Locations, destination_id)
        vehicle = db.session.get(Vehicles, vehicle_id)
        customer = db.session.get(Customers, data.get("customer_id"))

        if not origin or not destination:
            return jsonify({"message": "Origin or destination not found"}), 404
        if not vehicle:
            return jsonify({"message": "Vehicle not found"}), 404
        if not customer:
            return jsonify({"message": "Customer not found"}), 404

        corrector_cost = vehicle.corrector_cost  # Ajuste de costo por tipo de vehículo

        # 🔹 Calcular distancia usando OpenRouteService
        url = "https://api.openrouteservice.org/v2/matrix/driving-car"
        headers = {"Authorization": ORS_API_KEY, "Content-Type": "application/json"}
        body = {
            "locations": [[origin.longitude, origin.latitude], [destination.longitude, destination.latitude]],
            "metrics": ["distance"]
        }

        try:
            response = requests.post(url, json=body, headers=headers)
            response_data = response.json()
            distance_meters = response_data["distances"][0][1]
            distance_km = round(distance_meters / 1000, 2)
        except Exception as e:
            return jsonify({"message": "Error connecting to OpenRouteService", "error": str(e)}), 500

        # 🔹 Calcular tarifa del cliente
        cust_base_tariff = customer.cust_base_tariff
        final_cost_customer = (cust_base_tariff * distance_km) + corrector_cost

        # 🔹 Crear nueva orden con datos adicionales
        new_order = Orders(
            plate=data.get("plate"),
            distance_km=distance_km,
            estimated_date_end=data.get("estimated_date_end"),
            corrector_cost=corrector_cost,
            final_cost=final_cost_customer,
            cust_base_tariff=cust_base_tariff,
            status_order="Order created",
            order_created_date=datetime.utcnow(),
            customer_id=data.get("customer_id"),
            vehicle_id=vehicle_id,
            origin_id=origin_id,
            destiny_id=destination_id,
            comment=data.get("comment"),
            origin_contact=data.get("origin_contact"),
            origin_phone=data.get("origin_phone"),
            destiny_contact=data.get("destiny_contact"),
            destiny_phone=data.get("destiny_phone"),
        )

        db.session.add(new_order)
        db.session.commit()

        response_body["message"] = "Order created successfully (without provider assigned)"
        response_body["order"] = new_order.serialize()
        response_body["distance_km"] = distance_km
        response_body["final_cost_customer"] = round(final_cost_customer, 2)

        return jsonify(response_body), 201


@api.route('/orders/<int:order_id>', methods=['GET' , 'PUT', 'DELETE'])  # PENDING - MANEJAR ESTADOS
@jwt_required()
def get_order(order_id):
    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = claims.get("user_id")  
    order = db.session.get(Orders, order_id)  # Buscar la orden en la base de datos
    if not order:
        return jsonify({"message": "Order not found"}), 404   
    if user_role == "admin":  # ADMIN: Puede ver, modificar y cancelar cualquier orden
        if request.method == 'GET':
            response_body["message"] = f"Order {order_id} found"
            response_body["order"] = order.serialize()
            documents = db.session.execute(db.select(OrderDocuments).where(OrderDocuments.order_id == order.id)).scalars()
            response_body["documents"] = [doc.serialize() for doc in documents] if documents else []
            return jsonify(response_body), 200
        if request.method == 'PUT':  # Modificar orden
            data = request.json
            valid_statuses = ["Order created", "Order accepted", "In progress", "Delivered", "Canceled"]
            if "status" in data:
                order.status_order = data["status"]
            order.final_cost = data.get("total_price", order.final_cost)
            order.delivered_date = data.get("delivery_date", order.delivered_date)
            db.session.commit()
            response_body["message"] = f"Order {order_id} updated successfully"
            response_body["order"] = order.serialize()
            return jsonify(response_body), 200
        if request.method == 'DELETE':  # Cancelar orden
            order.status_order = "Canceled"  # En lugar de eliminar, la marcamos como cancelada
            db.session.commit()
            return jsonify({"message": f"Order {order_id} has been canceled"}), 200 
    customer = db.session.execute(db.select(Customers).where(Customers.user_id == user_id)).scalar()
    # CLIENTE: Verifica si pertenece al cliente de la orden
    if customer and order.customer_id == customer.id:
        response_body["message"] = f"Order {order_id} found"
        response_body["order"] = order.serialize()
        documents = db.session.execute(db.select(OrderDocuments).where(OrderDocuments.order_id == order.id)).scalars()
        response_body["documents"] = [doc.serialize() for doc in documents] if documents else []
        return jsonify(response_body), 200
    provider = db.session.execute(db.select(Providers).where(Providers.user_id == user_id)).scalar()
    # PROVEEDOR: Verifica si pertenece al proveedor de la orden
    if provider and order.provider_id == provider.id:
        response_body["message"] = f"Order {order_id} found"
        response_body["order"] = order.serialize()
        documents = db.session.execute(db.select(OrderDocuments).where(OrderDocuments.order_id == order.id)).scalars()
        response_body["documents"] = [doc.serialize() for doc in documents] if documents else []
        return jsonify(response_body), 200  
    return jsonify({"message": "Unauthorized access"}), 403  # Si no cumple ninguna regla, denegar acceso


@api.route('/assign-providers/<int:order_id>', methods=['PATCH'])  # OK
# Endpoint para que un admin asigne un proveedor a la orden
@jwt_required()
def assign_provider(order_id):
    class StatusOrderType:
        ORDER_CREATED = 'Order created'
        ORDER_ACCEPTED = 'Order accepted'
        IN_TRANSIT = 'In transit'
        DELIVERED = 'Delivered'
        CANCEL = 'Cancel'

    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")
    if user_role != "admin":
        return jsonify({"message": "Only admins can assign providers"}), 403
    order = db.session.get(Orders, order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
    data = request.json
    provider_id = data.get("provider_id")  
    provider = db.session.execute(db.select(Providers).where(Providers.id == provider_id)).scalar()  # Buscar proveedor en la BD
    if not provider:
        return jsonify({"message": "Provider not found"}), 404   
    url = "https://api.openrouteservice.org/v2/matrix/driving-car"  # Obtener distancia en tiempo real usando la API externa
    headers = {"Authorization": ORS_API_KEY, "Content-Type": "application/json"}
    body = {"locations": [
            [order.location_origin_to.longitude, order.location_origin_to.latitude],
            [order.location_destiny_to.longitude, order.location_destiny_to.latitude]
            ],"metrics": ["distance"]}
    try:
        response = requests.post(url, json=body, headers=headers)
        response_data = response.json()
        distance_meters = response_data["distances"][0][1]
        distance_km = round(distance_meters / 1000, 2)
    except Exception as e:
        return jsonify({"message": "Error connecting to OpenRouteService", "error": str(e)}), 500   
    prov_base_tariff = provider.prov_base_tariff  # Calcular tarifa del proveedor
    final_cost_provider = (prov_base_tariff * distance_km) + order.corrector_cost
    order.provider_id = provider_id  # Asignar proveedor a la orden
    order.final_cost = round(final_cost_provider, 2)
    order.status_order = StatusOrderType.ORDER_CREATED
    db.session.commit()
    response_body["message"] = "Provider assigned successfully"
    response_body["order"] = order.serialize()
    response_body["final_cost_provider"] = round(final_cost_provider, 2)
    return jsonify(response_body), 200


@api.route("/contacts-admin", methods=["GET"])
# Solo admin puede hacer get de todos formularios de contacto - OK
@jwt_required()
def get_contacts():
    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")
    if user_role != "admin":
        response_body["error"] = "No autorizado"
        return response_body, 401
    rows = db.session.execute(db.select(Contact)).scalars()
    result = [row.serialize() for row in rows]
    response_body["message"] = "Lista de contactos"
    response_body["results"] = result
    return response_body, 200


@api.route("/contacts", methods=["POST"])
# Cualquier usuario puede enviar un formulario de contacto - OK
def add_contact():
    data = request.get_json()
    name = data.get("name")
    last_name = data.get("last_name")
    phone = data.get("phone")
    email = data.get("email")
    comments = data.get("comments")
    if not name or not last_name or not email:
        return jsonify({"error": "Faltan datos requeridos"}), 400
    new_contact = Contact(
                          name=name,
                          last_name=last_name,
                          phone=phone,
                          email=email,
                          comments=comments)
    try:
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({"message": "Contacto creado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Contacto ya registrado"}), 500
    
"""""
@api.route('/order_documents', methods=['GET'])  # OK
# GET - Solo Admin puede ver todos los documentos
@jwt_required() 
def order_documents():
    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")   
    if request.method == 'GET':
        if user_role != "admin":
            return jsonify({"message": "Access denied. Only admin can view order documents"}), 403
        rows = db.session.execute(db.select(OrderDocuments)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Documentación de los pedidos"
        response_body['results'] = result
        return jsonify(response_body), 200
    
    if request.method == 'POST':  
        if user_role not in ["provider", "admin"]:
            return jsonify({"message": "Access denied. Only providers and admins can manage order documents"}), 403
        data = request.json
        new_document = OrderDocuments(
            document_type=data.get("document_type"),
            document_url=data.get("document_url"),
            order_id=data.get("order_id"))
        db.session.add(new_document)
        db.session.commit()
        response_body['message'] = "Documentación creada exitosamente"
        response_body['results'] = new_document.serialize()
        return jsonify(response_body), 201"

        
@api.route('/orders/<int:order_id>/add-document', methods=['POST'])  # PENDING
# Endpoint para que proveedor o admin adjunten documentos al cambiar estado a init o end
@jwt_required()
def add_order_document(order_id):
    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")   
    if user_role not in ["provider", "admin"]:  # Solo proveedores y administradores pueden adjuntar documentos
        return jsonify({"message": "Only providers and admins can add documents"}), 403
    order = db.session.get(Orders, order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404   
    if order.status_order not in ["init", "end"]:  # Verificar que el estado de la orden es "init" o "end"
        return jsonify({"message": "Documents can only be added when order status is 'init' or 'end'"}), 400
    data = request.json
    new_document = OrderDocuments(
        document_type=data.get("document_type"),
        document_url=data.get("document_url"),
        order_id=order.id)
    db.session.add(new_document)
    db.session.commit()
    response_body["message"] = "Document added successfully"
    response_body["order_document"] = new_document.serialize()
    return jsonify(response_body), 201

    
@api.route('/order_documents/<int:id>', methods=['GET', 'PUT', 'DELETE'])  # PENDING
# DELETE - Solo Admin puede eliminar
# GET - Cualquier usuario autenticado puede ver los documentos
# PUT - Solo Admin puede modificar
@jwt_required()
def order_document_by_id(id):
    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")
    order_document = db.session.get(OrderDocuments, id)  # Buscar el documento por ID
    if not order_document:
        response_body['message'] = 'Order document not found'
        return jsonify(response_body), 404   
    if request.method == 'GET':
        if user_role not in ["admin", "customer", "provider"]:
            return jsonify({"message": "Access denied."}), 403
        response_body['message'] = f'Document {id} retrieved successfully'
        response_body['results'] = order_document.serialize()
        return jsonify(response_body), 200  
    if request.method == 'PUT':
        if user_role != "admin":
            return jsonify({"message": "Access denied. Only admin can update documents."}), 403
        data = request.json
        order_document.document_type = data.get("document_type", order_document.document_type)
        order_document.document_url = data.get("document_url", order_document.document_url)
        db.session.commit()
        response_body['message'] = f'Document {id} updated successfully'
        response_body['results'] = order_document.serialize()
        return jsonify(response_body), 200
    if request.method == 'DELETE':
        if user_role != "admin":
            return jsonify({"message": "Access denied. Only admin can delete documents."}), 403
        db.session.delete(order_document)
        db.session.commit()
        response_body['message'] = f'Document {id} deleted successfully'
        return jsonify(response_body), 200
"""""    