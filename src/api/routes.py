"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
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
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    existing_user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if existing_user:
        return jsonify({"message": "El usuario already exist"}), 409
    new_user = Users(email=email, name=name, last_name=last_name, phone=data.get("phone", ""))
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
    access_token = create_access_token(identity=email, additional_claims={"user_id": user.id})
    response_body['access_token'] = access_token
    response_body['message'] = 'User logged'
    response_body['results'] = user.serialize()
    return response_body, 200

@api.route("/protected", methods=["GET"])
# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@jwt_required()
def protected():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity() # El mail
    additional_claims = get_jwt() # Datos adicionales
    print(current_user) 
    print(additional_claims) 
    #response_body['message'] = f'logged as {current_user}'
    return response_body, 200


# CRUD de los Users
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
    
    #  Nuevo
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

        