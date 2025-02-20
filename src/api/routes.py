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
        return jsonify({"message": "El usuario ya existe"}), 409
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


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/protected", methods=["GET"])
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

@api.route('/customers', methods=['GET'])
def customers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Customers)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Listado de clientes" 
        response_body['results'] = result
        return response_body, 200
    
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