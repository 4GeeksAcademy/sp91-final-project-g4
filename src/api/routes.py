from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Vehicles, Comments, Customers, Order_document, Providers, Locations, Orders
from datetime import datetime
import requests
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API
"""""
# API Key de OpenRouteService para geolocalización (Debes reemplazarla con una válida)
ORS_API_KEY = "5b3ce3597851110001cf624838efe49eff8748218b0a9b692f3fb14e"
"""""

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
# ✅ REGISTRO DE USUARIO (SIGNUP)
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
    new_user = Users(email=email, name=name, last_name=last_name, phone=data.get("phone", ""), role=role)
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
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of users" 
        response_body['results'] = result
        return response_body, 200
    
@api.route('/user/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    response_body = {}
    user = db.session.get(Users, id)   
    if not user:
        response_body['message'] = 'User not found'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = user.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        user.name = data.get("name", user.name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.phone = data.get("phone", user.phone)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = user.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        return response_body, 200

@api.route('/customers', methods=['GET', 'POST'])
def customers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Customers)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Listado de clientes" 
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        new_customer = Customers(
            company_name=data.get("company_name"),
            contact_name=data.get("contact_name"),
            phone=data.get("phone"),
            address=data.get("address"),
            user_id=data.get("user_id"))
        db.session.add(new_customer)
        db.session.commit()
        response_body['message'] = "Cliente creado exitosamente"
        response_body['results'] = new_customer.serialize()
        return response_body, 201
    
@api.route('/customer/<int:id>', methods=['GET', 'PUT', 'DELETE']) 
def customer(id):
    response_body = {}
    customer = db.session.get(Customers, id)   
    if not customer:
        response_body['message'] = 'Client not found'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = customer.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        customer.company_name = data.get("company_name", customer.company_name)
        customer.contact_name = data.get("contact_name", customer.contact_name)
        customer.phone = data.get("phone", customer.phone)
        customer.address = data.get("address", customer.address)
        db.session.commit()
        response_body['message'] = f'Customer {id} updated successfully'
        response_body['results'] = customer.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(customer)
        db.session.commit()
        response_body['message'] = f'Customer {id} deleted successfully'
        return response_body, 200
    
@api.route('/providers', methods=['GET', 'POST'])
def providers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Providers)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of providers"
        response_body['results'] = result
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        new_provider = Providers(
            company_name=data.get("company_name"),
            contact_name=data.get("contact_name"),
            phone=data.get("phone"),
            address=data.get("address"),
            tariff=data.get("tariff"),
            user_id=data.get("user_id"))
        db.session.add(new_provider)
        db.session.commit()
        response_body['message'] = "Provider created succesfully"
        response_body['results'] = new_provider.serialize()
        return response_body, 201

@api.route('/provider/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def provider(id):
    response_body = {}
    provider = db.session.get(Providers, id)
    if not provider:
        response_body['message'] = 'Proveedor no encontrado'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'Proveedor {id} encontrado'
        response_body['results'] = provider.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        provider.company_name = data.get("company_name", provider.company_name)
        provider.contact_name = data.get("contact_name", provider.contact_name)
        provider.phone = data.get("phone", provider.phone)
        provider.address = data.get("address", provider.address)
        provider.tariff = data.get("tariff", provider.tariff)
        db.session.commit()
        response_body['message'] = f'Proveedor {id} actualizado correctamente'
        response_body['results'] = provider.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(provider)
        db.session.commit()
        response_body['message'] = f'Proveedor {id} eliminado correctamente'
        return response_body, 200

@api.route('/comments', methods=['GET', 'POST'])
def comments():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comments)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Lista de comentarios"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        new_comment = Comments(
            comment=data.get("comment"),
            user_id=data.get("user_id"),
            order_id=data.get("order_id"))
        db.session.add(new_comment)
        db.session.commit()
        response_body['message'] = "Comentario creado exitosamente"
        response_body['results'] = new_comment.serialize()
        return response_body, 201

@api.route('/comment/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def comment(id):
    response_body = {}
    comment = db.session.get(Comments, id)
    if not comment:
        response_body['message'] = 'Comentario no encontrado'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'Comentario {id} encontrado'
        response_body['results'] = comment.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        comment.comment = data.get("comment", comment.comment)
        db.session.commit()
        response_body['message'] = f'Comentario {id} actualizado correctamente'
        response_body['results'] = comment.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(comment)
        db.session.commit()
        response_body['message'] = f'Comentario {id} eliminado correctamente'
        return response_body, 200
    
@api.route('/vehicles', methods=['GET', 'POST'])
def vehicles():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Vehicles)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Lista de vehiculos"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
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

@api.route('/vehicle/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def vehicle(id):
    response_body = {}
    vehicle = db.session.get(Vehicles, id)
    if not comment:
        response_body['message'] = 'Vehiculo no encontrado'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'Vehiculo {id} encontrado'
        response_body['results'] = vehicle.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        vehicle = data.get("Vehicle", vehicle)
        db.session.commit()
        response_body['message'] = f'Vehicle {id} actualizado correctamente'
        response_body['results'] = vehicle.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(vehicle)
        db.session.commit()
        response_body['message'] = f'Vehicle {id} eliminado correctamente'
        return response_body, 200 

@api.route('/vehicles-admin', methods=['POST'])
def vehicles_admin():
    response_body = {}
    if request.method == 'POST':
        my_list = request.json
        for data in my_list:
            new_vehicle = Vehicles(
                brand=data.get("brand"),
                model=data.get("model"),
                vehicle_type=data.get("vehicle_type"))
            db.session.add(new_vehicle)
            db.session.commit()
        response_body['message'] = " Vehiculo creado exitosamente"
        return response_body, 201
    
@api.route('/locations-admin', methods=['POST'])
def locations_admin():
    response_body = {}
    if request.method == 'POST':
        my_list = request.json  
        for data in my_list:
            new_location = Locations(
                name=data.get("name"),
                region=data.get("region"),
                city=data.get("region"),    
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
    
@api.route('/order_documents', methods=['GET', 'POST'])
def order_documents():
     response_body = {}
     if request.method == 'GET':
        rows = db.session.execute(db.select(Order_document)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Documentacion de los pedidos"
        response_body['results'] = result
        return jsonify(response_body), 200
     if request.method == 'POST':
        data = request.json
        row = Order_document(
              document_type=data.get("document_type"),
              document_url=data.get("document_url"),
              order_id=data.get("order_id"))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Documentacion creada exitosamente"
        response_body['results'] = row.serialize()
        return jsonify(response_body), 201

@api.route('/order_document/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def order_document_by_id(id):
    response_body = {}
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
        vehicle = data.get("Order_document", order_document)
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
    user_email = get_jwt_identity()  # Usuario autenticado
    claims = get_jwt()
    user_role = claims.get("role")  # "customer", "provider", "admin"
    user_id = claims.get("user_id")  # ID del usuario autenticado
    if request.method == 'GET':
        query = db.select(Orders)
        # Filtrar según el rol
        if user_role == "customer":
            query = query.where(Orders.customer_id == user_id)
        elif user_role == "provider":
            query = query.where(Orders.provider_id == user_id)
        orders = db.session.execute(query).scalars()
        result = [order.serialize() for order in orders]
        response_body['message'] = "List of orders"
        response_body['results'] = result
        return jsonify(response_body), 200
    if request.method == 'POST':
        if user_role != "customer":
            return jsonify({"message": "Only customers can create orders"}), 403
        data = request.json
        new_order = Orders(
            plate=data.get("plate"),
            distance_km=data.get("distance_km"),
            estimated_date_end=data.get("estimated_date_end"),
            base_cost=data.get("base_cost"),
            corrector_cost=data.get("corrector_cost"),
            final_cost=data.get("final_cost"),
            total_customer_price=data.get("total_customer_price"),
            status_order=data.get("status_order"),
            order_created_date=data.get("order_created_date"),
            customer_id=user_id,
            provider_id=data.get("provider_id"),
            vehicle_id=data.get("vehicle_id"),
            origin_id=data.get("origin_id"),
            destiny_id=data.get("destiny_id"))
        db.session.add(new_order)
        db.session.commit()
        response_body['message'] = "Order created successfully"
        response_body['results'] = new_order.serialize()
        return jsonify(response_body), 201

@api.route('/order/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def order(id):
    response_body = {}
    user_email = get_jwt_identity()
    claims = get_jwt()
    user_role = claims.get("role")
    user_id = claims.get("user_id")
    order = db.session.get(Orders, id)
    if not order:
        response_body['message'] = 'Order not found'
        return jsonify(response_body), 404
    if request.method == 'GET':
        # Validar acceso
        if user_role == "customer" and order.customer_id != user_id:
            return jsonify({"message": "Unauthorized access"}), 403
        if user_role == "provider" and order.provider_id != user_id:
            return jsonify({"message": "Unauthorized access"}), 403
        response_body['message'] = f'Order {id} found'
        response_body['results'] = order.serialize()
        return jsonify(response_body), 200
    if request.method == 'PUT':
        data = request.json
        # Solo provider puede cambiar el estado del pedido
        if user_role == "provider":
            if "status_order" in data:
                order.status_order = data["status_order"]
            else:
                return jsonify({"message": "Providers can only update status"}), 403
        elif user_role == "admin":
            # Admin puede modificar todo
            order.plate = data.get("plate", order.plate)
            order.distance_km = data.get("distance_km", order.distance_km)
            order.estimated_date_end = data.get("estimated_date_end", order.estimated_date_end)
            order.base_cost = data.get("base_cost", order.base_cost)
            order.corrector_cost = data.get("corrector_cost", order.corrector_cost)
            order.final_cost = data.get("final_cost", order.final_cost)
            order.total_customer_price = data.get("total_customer_price", order.total_customer_price)
            order.status_order = data.get("status_order", order.status_order)
            order.order_created_date = data.get("order_created_date", order.order_created_date)
            order.order_acepted_date = data.get("order_acepted_date", order.order_acepted_date)
            order.in_transit_date = data.get("in_transit_date", order.in_transit_date)
            order.delivered_date = data.get("delivered_date", order.delivered_date)
            order.cancel_date = data.get("cancel_date", order.cancel_date)
            order.customer_id = data.get("customer_id", order.customer_id)
            order.provider_id = data.get("provider_id", order.provider_id)
            order.vehicle_id = data.get("vehicle_id", order.vehicle_id)
            order.origin_id = data.get("origin_id", order.origin_id)
            order.destiny_id = data.get("destiny_id", order.destiny_id)
        else:
            return jsonify({"message": "Unauthorized to modify orders"}), 403
        db.session.commit()
        response_body['message'] = f'Order {id} updated successfully'
        response_body['results'] = order.serialize()
        return jsonify(response_body), 200
    if request.method == 'DELETE':
        if user_role != "admin":
            return jsonify({"message": "Only admins can delete orders"}), 403
        db.session.delete(order)
        db.session.commit()
        response_body['message'] = f'Order {id} deleted successfully'
        return jsonify(response_body), 200
    

""""
@api.route('/fetch_location', methods=['POST'])
def fetch_location():  
    # Obtiene la geolocalización de una dirección usando OpenRouteService y la almacena en la BD.
    data = request.json
    if not data:
        return jsonify({"message": "No data received"}), 400
    address = f"{data.get('name')}, {data.get('street', '')}, {data.get('city')}, {data.get('region')}, {data.get('country', 'Spain')}"
    ors_url = f"https://api.openrouteservice.org/geocode/search?api_key={ORS_API_KEY}&text={address}"
    response = requests.get(ors_url)
    if response.status_code != 200:
        return jsonify({"message": "Failed to fetch location from OpenRouteService"}), 500
    geo_data = response.json()
    if "features" in geo_data and geo_data["features"]:
        coordinates = geo_data["features"][0]["geometry"]["coordinates"]
        properties = geo_data["features"][0]["properties"]
        country = properties.get("country", "").lower()
        if country != "spain":
            return jsonify({"message": "Location must be in Spain"}), 400
        latitude, longitude = coordinates[1], coordinates[0]
        # Guardar en la BD
        new_location = Locations(
            name=data.get("name"),
            region=data.get("region"),
            city=data.get("city"),
            latitude=latitude,
            longitude=longitude,
            street=data.get("street"),
            country="Spain")         
        db.session.add(new_location)
        db.session.commit()
        return jsonify({"message": "Location stored successfully", "results": new_location.serialize()}), 201  
    return jsonify({"message": "Could not fetch location"}), 400
"""
""" 
# ✅ ENDPOINT PARA ASIGNAR UN PROVEEDOR A UNA ORDEN
@api.route('/assign_order/<int:order_id>', methods=['PUT'])
def assign_order(order_id):
    data = request.json
    order = db.session.get(Orders, order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
    provider = db.session.get(Providers, data.get("provider_id"))
    if not provider:
        return jsonify({"message": "Provider not found"}), 404
    order.provider_id = provider.id
    order.status_order = "Order accepted"
    order.order_acepted_date = datetime.utcnow()
    order.base_cost = provider.tariff
    order.final_cost = order.distance_km * provider.tariff * order.corrector_cost
    db.session.commit()
    return jsonify({"message": f"Order {order_id} assigned to provider {provider.id}", "results": order.serialize()}), 200
"""
