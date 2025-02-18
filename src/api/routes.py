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


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# CRUD de los Users
@api.route('/users', methods=['GET'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Listado de usuarios"
        response_body['results'] = result
        return response_body, 200
    
   
@api.route('/user/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    response_body = {}
    user = db.session.get(Users, id)
    if not user:
        response_body['message'] = 'Usuario no encontrado'
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
        #user.is_admin = data.get("is_admin", user.is_admin)
        #user.is_customer = data.get("is_customer", user.is_customer)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = user.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        return response_body, 200
    
    
@api.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")
    last_name = data.get("last_name", "")
    if not email or not password:
        return jsonify({"message": "Email y contraseña son obligatorios"}), 400
    existing_user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if existing_user:
        return jsonify({"message": "El usuario ya existe"}), 409
    row = Users(email=email, password=data["password"], name=name, last_name=last_name)
    db.session.add(row)
    db.session.commit()
    return jsonify({"message": "Usuario creado exitosamente"}), 201
# if request.method == 'POST':
#         data = request.json
#         row = Users(name=data.get("name"),
#                     last_name=data.get("last_name"),
#                     email=data.get("email"),
#                     phone=data.get("phone"),
#                     password=password
#                     is_admin=bool(data.get("is_admin",False)),
#                     is_customer=bool(data.get("is_customer",False)))
#         db.session.add(row)
#         db.session.commit()
#         response_body['message'] = f'El usuario {request.method} ha sido creado'
#         response_body['results'] = row.serialize()
#         return response_body, 200

@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = request.json.get("password", None)
    row = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password )).scalar()
    if not row:
        response_body['message'] = 'User not found'
        return response_body, 401
    user = row.serialize()
    claims = {'user_id': user['id']}
    access_token = create_access_token(identity=email, additional_claims=claims)
    response_body['access_token'] = access_token
    response_body['message'] = 'User logged'
    response_body['results'] = user
    return response_body, 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    current_user = get_jwt_identity() 
    additional_claims = get_jwt() 
    print(current_user)
    print(additional_claims)
    #response_body['message'] = f'logged as {current_user}'
    return response_body, 200