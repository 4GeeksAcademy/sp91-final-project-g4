from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from datetime import datetime
from api.models import db, Users, Vehicles, Customers, Order_document, Providers, Locations, Orders, Contact


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# API Key de OpenRouteService para geolocalización (Debes reemplazarla con una válida)
ORS_API_KEY = "5b3ce3597851110001cf624838efe49eff8748218b0a9b692f3fb14e"

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

@api.route("/users", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")
    last_name = data.get("last_name", "")
    role = data.get("role", "customer")  # Asignamos por defecto "customer
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    existing_user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if existing_user:
        return jsonify({"message": "El usuario already exist"}), 409
    new_user = Users(email=email, name=name, last_name=last_name, phone=data.get("phone", ""), role=role, is_active=True)
    new_user.set_password(password)  # Encripta la contraseña
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if not user or not user.check_password(password):  # Comprobar la contraseña encriptada
        return jsonify({"message": "User or password incorrect"}), 401
    if not user.is_active:
        return jsonify({"message": "User is inactive, please contact support"}), 403
    access_token = create_access_token(identity=email, additional_claims={"user_id": user.id, "role": user.role})
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
@jwt_required()
def user(id):
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    user_id = additional_claims.get("user_id")  # Obtiene el ID del usuario autenticado
    user = db.session.get(Users, id)
    if not user:
        response_body['message'] = 'User not found'
        return response_body, 404
    if role == "admin":
        if request.method == 'GET':
            response_body['message'] = f'User {id} found'
            response_body['results'] = user.serialize()
            return response_body, 200
        if request.method == 'PUT':
            data = request.json
            user.name = data.get("name", user.name)
            user.last_name = data.get("last_name", user.last_name)
            user.email = data.get("email", user.email)
            user.phone = data.get("phone", user.phone)
            if "is_active" in data:
                user.is_active = data["is_active"]
            db.session.commit()
            response_body['message'] = f'User {id} updated successfully'
            response_body['results'] = user.serialize()
            return response_body, 200
        if request.method == 'DELETE':
            user.is_active = False  # En lugar de eliminar, solo se desactiva
            db.session.commit()
            response_body['message'] = f'User {id} deactivated successfully'
            return response_body, 200   
    if role in ["customer", "provider"]:  # CUSTOMER y PROVIDER pueden hacer GET y PUT pero solo sobre su propio usuario
        if user.id != user_id:
            return jsonify({"message": "You can only access your own data"}), 403
        if request.method == 'GET':
            response_body['message'] = f'User {id} found'
            response_body['results'] = user.serialize()
            return response_body, 200
        if request.method == 'PUT':
            data = request.json
            user.name = data.get("name", user.name)
            user.last_name = data.get("last_name", user.last_name)
            user.phone = data.get("phone", user.phone)
            db.session.commit()
            response_body['message'] = f'User {id} updated successfully'
            response_body['results'] = user.serialize()
            return response_body, 200 
    return jsonify({"message": "Unauthorized"}), 403  # Si no es admin y está tratando de hacer DELETE, denegar acceso

@api.route('/customers', methods=['GET', 'POST'])
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
            contact_name=data.get("contact_name"),
            phone=data.get("phone"),
            address=data.get("address"),
            cust_base_tariff=cust_base_tariff,
            user_id=data.get("user_id"),
            is_active=True)
        db.session.add(new_customer)
        db.session.commit()
        response_body['message'] = "Cliente creado exitosamente"
        response_body['results'] = new_customer.serialize()
        return response_body, 201
    
@api.route('/customers/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE']) 
@jwt_required()
def customer(id):
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    user_id = additional_claims.get("user_id") 
    customer = db.session.get(Customers, id)  # Buscar el cliente en la base de datos
    if not customer:
        return jsonify({"message": "Customer not found"}), 404 
    if role == "admin":  #  ADMIN puede hacer todo
        if request.method == 'GET':
            response_body['message'] = f'Customer {id} found'
            response_body['results'] = customer.serialize()
            return jsonify(response_body), 200
        if request.method in ['PUT', 'PATCH']:
            data = request.json
            customer.company_name = data.get("company_name", customer.company_name)
            customer.contact_name = data.get("contact_name", customer.contact_name)
            customer.phone = data.get("phone", customer.phone)
            customer.address = data.get("address", customer.address)
            if "is_active" in data:
                customer.is_active = data["is_active"]  # Permitir activar/desactivar
            db.session.commit()
            response_body['message'] = f'Customer {id} updated successfully'
            response_body['results'] = customer.serialize()
            return jsonify(response_body), 200
        if request.method == 'DELETE':
            customer.is_active = False  # En lugar de eliminar, solo se desactiva
            db.session.commit()
            response_body['message'] = f'Customer {id} deactivated successfully'
            return response_body, 200   
    if role == "customer":  #  CUSTOMERS pueden ver y modificar solo su perfil y sus contactos
        if customer.user_id != user_id:
            return jsonify({"message": "Unauthorized access"}), 403  # No puede modificar otro cliente
        if request.method == 'GET':
            response_body['message'] = f'Customer {id} found'
            response_body['results'] = customer.serialize()
            return jsonify(response_body), 200
        if request.method in ['PUT', 'PATCH']:
            data = request.json
            customer.contact_name = data.get("contact_name", customer.contact_name)
            customer.phone = data.get("phone", customer.phone)
            customer.address = data.get("address", customer.address)
            db.session.commit()
            response_body['message'] = f'Customer {id} updated successfully'
            response_body['results'] = customer.serialize()
            return jsonify(response_body), 200
    return jsonify({"message": "Unauthorized access"}), 403  #  PROVIDERS no pueden modificar Customers
    
@api.route('/providers', methods=['GET', 'POST'])
@jwt_required()
def providers():
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    if role != 'admin':  # Solo los administradores pueden acceder
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 401 
    include_inactive = request.args.get("include_inactive", "false").lower() == "true"
    query = db.select(Providers)
    if not include_inactive:
        query = query.where(Providers.is_active == True)
    if request.method == 'GET':
        rows = db.session.execute(query).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Listado de proveedores"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        prov_base_tariff = data.get("prov_base_tariff", 0.0)
        new_provider = Providers(
            company_name=data.get("company_name"),
            contact_name=data.get("contact_name"),
            phone=data.get("phone"),
            address=data.get("address"),
            prov_base_tariff=prov_base_tariff,
            user_id=data.get("user_id"),
            is_active=True)  # Siempre activos al crearse
        db.session.add(new_provider)
        db.session.commit()
        response_body['message'] = "Proveedor creado exitosamente"
        response_body['results'] = new_provider.serialize()
        return response_body, 201

@api.route('/providers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def provider(id):
    response_body = {}
    additional_claims = get_jwt()
    role = additional_claims.get("role")
    user_id = additional_claims.get("user_id")
    provider = db.session.get(Providers, id)
    if not provider:
        return jsonify({"message": "Proveedor no encontrado"}), 404
    if role == "admin":  # ADMIN: Puede hacer todo
        if request.method == 'GET':
            response_body['message'] = f'Proveedor {id} encontrado'
            response_body['results'] = provider.serialize()
            return jsonify(response_body), 200
        if request.method in ['PUT', 'PATCH']:
            data = request.json
            provider.company_name = data.get("company_name", provider.company_name)
            provider.contact_name = data.get("contact_name", provider.contact_name)
            provider.phone = data.get("phone", provider.phone)
            provider.address = data.get("address", provider.address)
            provider.prov_base_tariff = data.get("prov_base_tariff", provider.prov_base_tariff)
            provider.user_id = data.get("user_id", provider.user_id)
            db.session.commit()
            response_body['message'] = f'Proveedor {id} actualizado correctamente'
            response_body['results'] = provider.serialize()
            return jsonify(response_body), 200
        if request.method == 'DELETE':
            provider.is_active = False  # Desactivar en lugar de eliminar
            db.session.commit()
            response_body['message'] = f'Proveedor {id} desactivado correctamente'
            return jsonify(response_body), 200
    if role == "provider":  #  PROVEEDORES: Pueden modificar solo su propio perfil
        if provider.user_id != user_id:
            return jsonify({"message": "Acceso no autorizado"}), 403
        if request.method == 'GET':
            response_body['message'] = f'Proveedor {id} encontrado'
            response_body['results'] = provider.serialize()
            return jsonify(response_body), 200
        if request.method in ['PUT', 'PATCH']:
            data = request.json
            provider.contact_name = data.get("contact_name", provider.contact_name)
            provider.phone = data.get("phone", provider.phone)
            provider.address = data.get("address", provider.address)
            db.session.commit()
            response_body['message'] = f'Proveedor {id} actualizado correctamente'
            response_body['results'] = provider.serialize()
            return jsonify(response_body), 200   
    return jsonify({"message": "Acceso no autorizado"}), 403  # CLIENTES NO PUEDEN MODIFICAR PROVEEDORES

@api.route('/vehicles', methods=['GET'])
def get_vehicles():
    response_body = {}
    rows = db.session.execute(db.select(Vehicles)).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = "Lista de vehiculos"
    response_body['results'] = result
    return response_body, 200

@api.route('/vehicles', methods=['POST'])
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
    if request.method == 'PUT':  # Hay que proteger el PUT - Get pueden todos
        data = request.json
        vehicle.brand = data.get("brand", vehicle.brand)
        vehicle.model = data.get("model", vehicle.model)
        vehicle.vehicle_type = data.get("vehicle_type", vehicle.vehicle_type)
        db.session.commit()
        response_body['message'] = f'Vehicle {id} actualizado correctamente'
        response_body['results'] = vehicle.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        vehicle.is_active = False  # Deshabilita el vehículo en lugar de eliminarlo
        db.session.commit()
        response_body['message'] = f'Vehicle {id} deshabilitado correctamente'
        return response_body, 200 

@api.route('/vehicles-admin', methods=['POST'])
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
                corrector_cost=data.get("corrector_cost"))  # Se asigna directamente
            db.session.add(new_vehicle)
            db.session.commit()
        response_body['message'] = " Vehiculo creado exitosamente"
        return response_body, 201
    
@api.route('/locations-admin', methods=['POST'])
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
                name=data.get("name"),
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

@api.route('/locations', methods=['GET']) # No hace falta proteger GET locations
def locations():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Locations)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Lista de localidades"
        response_body['results'] = result
        return response_body, 200
    
@api.route('/locations/<int:id>', methods=['GET']) # No hace falta proteger GET locations
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
    
@api.route('/order_documents', methods=['GET', 'POST'])
@jwt_required() 
def order_documents():
     response_body = {}
     claims = get_jwt()
     user_role = claims.get("role")
     if user_role not in ["provider", "admin"]:
        return jsonify({"message": "Access denied. Only providers and admins can manage order documents"}), 403
     if request.method == 'GET':
        rows = db.session.execute(db.select(Order_document)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Documentacion de los pedidos"
        response_body['results'] = result
        return jsonify(response_body), 200
     if request.method == 'POST':
        data = request.json
        new_document = Order_document(
              document_type=data.get("document_type"),
              document_url=data.get("document_url"),
              order_id=data.get("order_id"))
        db.session.add(new_document)
        db.session.commit()
        response_body['message'] = "Documentacion creada exitosamente"
        response_body['results'] = new_document.serialize()
        return jsonify(response_body), 201

@api.route('/order_documents/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def order_document_by_id(id):
    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")
    if user_role not in ["provider", "admin"]:
        return jsonify({"message": "Access denied. Only providers and admins can manage order documents"}), 403
    order_document = db.session.get(Order_document, id)
    if not order_document:
        response_body['message'] = 'Order_document not found'
        return jsonify(response_body), 404
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = order_document.serialize()
        return jsonify(response_body), 200
    if request.method == 'PUT':
        data = request.json
        order_document.document_type = data.get("document_type", order_document.document_type)
        order_document.document_url = data.get("document_url", order_document.document_url)
        db.session.commit()
        response_body['message'] = f'Documento {id} actualizado correctamente'
        response_body['results'] = order_document.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(order_document)
        db.session.commit()
        response_body['message'] = f'Documento {id} eliminado correctamente'
        return response_body, 200 
    
@api.route('/orders', methods=['GET', 'POST'])
@jwt_required()
def orders():
    response_body = {}
    user_email = get_jwt_identity()
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = claims.get("user_id")  
    if request.method == 'GET':  # GET: Obtener órdenes según el rol
        query = db.select(Orders)
        if user_role == "customer":
            query = query.where(Orders.customer_id == user_id)
        elif user_role == "provider":
            query = query.where(Orders.provider_id == user_id)
        orders = db.session.execute(query).scalars()
        result = [order.serialize() for order in orders]
        response_body['message'] = "List of orders"
        response_body['results'] = result
        return jsonify(response_body), 200   
    if request.method == 'POST':  # POST: Solo clientes y administradores pueden crear órdenes sin proveedor asignado
        if user_role not in ["customer", "admin"]:
            return jsonify({"message": "Only customers and admins can create orders"}), 403
        data = request.json
        origin_id = data.get("origin_id")
        destination_id = data.get("destiny_id")
        vehicle_id = data.get("vehicle_id")        
        if not origin_id or not destination_id or not vehicle_id:  # Validaciones - Si o si hay que rellenar para crear una orden
            return jsonify({"message": "Missing required fields (origin_id, destiny_id, vehicle_id)"}), 400       
        origin = db.session.execute(db.select(Locations).where(Locations.id == origin_id)).scalar() # Buscar ubicaciones en la BD
        destination = db.session.execute(db.select(Locations).where(Locations.id == destination_id)).scalar()
        if not origin or not destination:
            return jsonify({"message": "Origin or destination not found"}), 404      
        vehicle = db.session.get(Vehicles, vehicle_id)  # Buscar vehículo y obtener corrector_cost
        if not vehicle:
            return jsonify({"message": "Vehicle not found"}), 404
        corrector_cost = vehicle.corrector_cost 
        customer = db.session.execute(db.select(Customers).where(Customers.id == data.get("customer_id"))).scalar()  # Buscar cliente en la BD
        if not customer:
            return jsonify({"message": "Customer not found"}), 404       
        url = "https://api.openrouteservice.org/v2/matrix/driving-car"  # Obtener distancia en tiempo real usando la API externa
        headers = {"Authorization": ORS_API_KEY, "Content-Type": "application/json"}
        body = {"locations": [
                [origin.longitude, origin.latitude],
                [destination.longitude, destination.latitude]],"metrics": ["distance"]}
        try:
            response = requests.post(url, json=body, headers=headers)
            response_data = response.json()
            distance_meters = response_data["distances"][0][1]
            distance_km = round(distance_meters / 1000, 2)
        except Exception as e:
            return jsonify({"message": "Error connecting to OpenRouteService", "error": str(e)}), 500        
        cust_base_tariff = customer.cust_base_tariff  # Calcular tarifa del cliente
        final_cost_customer = (cust_base_tariff * distance_km) + corrector_cost      
        new_order = Orders(
            # Crear orden SIN proveedor asignado -- agregar comments puede ser null 
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
            destiny_id=destination_id)
        db.session.add(new_order)
        db.session.commit()     
        response_body["message"] = "Order created successfully (without provider assigned)"   #  Respuesta con detalles de la orden creada
        response_body["order"] = new_order.serialize()
        response_body["distance_km"] = distance_km
        response_body["final_cost_customer"] = round(final_cost_customer, 2)
        return jsonify(response_body), 201

@api.route('/orders/<int:order_id>/add-document', methods=['POST'])
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
    new_document = Order_document(
        document_type=data.get("document_type"),
        document_url=data.get("document_url"),
        order_id=order.id)
    db.session.add(new_document)
    db.session.commit()
    response_body["message"] = "Document added successfully"
    response_body["order_document"] = new_document.serialize()
    return jsonify(response_body), 201

@api.route('/assign-providers/<int:order_id>', methods=['PUT'])
# Endpoint para que un admin asigne un proveedor a la orden
@jwt_required()
def assign_provider(order_id):
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
    order.final_cost = final_cost_provider
    order.status_order = "Provider assigned"
    db.session.commit()
    response_body["message"] = "Provider assigned successfully"
    response_body["order"] = order.serialize()
    response_body["final_cost_provider"] = round(final_cost_provider, 2)
    return jsonify(response_body), 200

@api.route('/orders/<int:order_id>', methods=['GET' , 'PUT', 'DELETE'])
@jwt_required()
def get_order(order_id):
    response_body = {}
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = claims.get("user_id")  
    order = db.session.get(Orders, order_id)  # Buscar la orden en la base de datos
    if not order:
        return jsonify({"message": "Order not found"}), 404   
    if user_role == "admin":  # ADMIN: Puede ver, modificar y cancelar cualquier orden TODO me falta postman PUT DELETE
        if request.method == 'GET':
            response_body["message"] = f"Order {order_id} found"
            response_body["order"] = order.serialize()
            documents = db.session.execute(db.select(Order_document).where(Order_document.order_id == order.id)).scalars()
            response_body["documents"] = [doc.serialize() for doc in documents] if documents else []
            return jsonify(response_body), 200
        if request.method == 'PUT':  # Modificar orden
            data = request.json
            order.status = data.get("status", order.status)
            order.total_price = data.get("total_price", order.total_price)
            order.delivery_date = data.get("delivery_date", order.delivery_date)
            db.session.commit()
            response_body["message"] = f"Order {order_id} updated successfully"
            response_body["order"] = order.serialize()
            return jsonify(response_body), 200
        if request.method == 'DELETE':  # Cancelar orden
            order.status = "Canceled"  # En lugar de eliminar, la marcamos como cancelada
            db.session.commit()
            return jsonify({"message": f"Order {order_id} has been canceled"}), 200 
    customer = db.session.execute(db.select(Customers).where(Customers.user_id == user_id)).scalar()
    # CLIENTE: Verifica si pertenece al cliente de la orden
    if customer and order.customer_id == customer.id:
        response_body["message"] = f"Order {order_id} found"
        response_body["order"] = order.serialize()
        documents = db.session.execute(db.select(Order_document).where(Order_document.order_id == order.id)).scalars()
        response_body["documents"] = [doc.serialize() for doc in documents] if documents else []
        return jsonify(response_body), 200
    provider = db.session.execute(db.select(Providers).where(Providers.user_id == user_id)).scalar()
    # PROVEEDOR: Verifica si pertenece al proveedor de la orden
    if provider and order.provider_id == provider.id:
        response_body["message"] = f"Order {order_id} found"
        response_body["order"] = order.serialize()
        documents = db.session.execute(db.select(Order_document).where(Order_document.order_id == order.id)).scalars()
        response_body["documents"] = [doc.serialize() for doc in documents] if documents else []
        return jsonify(response_body), 200  
    return jsonify({"message": "Unauthorized access"}), 403  # Si no cumple ninguna regla, denegar acceso

@api.route("/contacts-admin", methods=["GET"])
@jwt_required()
def get_contacts():
    # Solo admin puede hacer get de todos formularios de contacto
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
def add_contact():
    # Cualquier usuario puede enviar un formulario de contacto
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
        return jsonify({"error": "Hubo un error al guardar los datos"}), 500