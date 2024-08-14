"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from datetime import date
from api.models import db, User, WeeklyRoutine, Routine, Exercise, ExerciseRoutine, FollowUp, Week, PhysicalInformation
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required




api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)




@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():


    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }


    return jsonify(response_body), 200


# CREAR USUARIO
@api.route('/register', methods=['POST'])
def post_user():
    user = request.get_json()
    user_by_email = User.query.filter_by(email=user['email']).first()

    # Arreglar lo que son los codigos de estado y poner los mensajes desde el frontend

    if not isinstance(user['name'], str) or len(user['name'].strip()) == 0:
         return({'error':'"name" must be a string'}), 400
    if not isinstance(user['birthday'], str) or len(user['birthday'].strip()) == 0:
         return({'error':'"birthday" must be a string'}), 400
    if not isinstance(user['sex'], str) or len(user['sex'].strip()) == 0:
        return({'error':'"sex" must be a string'}), 400
    if not isinstance(user['email'], str) or len(user['email'].strip()) == 0:
         return({'error':'"email" must be a string'}), 400
    if user_by_email:
        if user_by_email.email == user['email']:
            return ({'error':'This email is already used'}), 400
    if not isinstance(user['password'], str) or len(user['password'].strip()) == 0:
         return({'error':'"password" must be a string'}), 400
    if not isinstance(user['confirm_password'], str) or len(user['confirm_password'].strip()) == 0:
         return({'error':'"confirm_password" must be a string'}), 400
    if user['password'] != user['confirm_password']:
        return({'error':'"password" and "confirm_password" must be the same'}), 400

    user_created = User(name=user['name'], birthday=user['birthday'], sex=user['sex'], email=user['email'], password=user['password'])
    db.session.add(user_created)
    db.session.commit()
    return jsonify(user_created.serialize()), 200


# INICIAR SESION
@api.route('/login', methods=['POST'])
def login():
    user = request.get_json()

    if not isinstance(user['email'], str) or len(user['email'].strip()) == 0:
         return({'error':'"email" must be a string'}), 400
    if not isinstance(user['password'], str) or len(user['password'].strip()) == 0:
         return({'error':'"password" must be a string'}), 400

    user_db = User.query.filter_by(email=user['email'], password=user['password']).first()
    if user_db is None:
        return jsonify({"error":"incorrect credentials"}), 401
   
    access_token = create_access_token(identity={"email": user_db.email, "id": user_db.id})
    return jsonify({"access_token":access_token, "logged":True}), 200


# VALIDAR TOKEN
@api.route("/valid-token", methods=["GET"])
@jwt_required()
def valid_token():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
   
    user_exist = User.query.filter_by(email=current_user['email']).first()
    if user_exist is None:
        return jsonify(logged=False), 404

    return jsonify(logged=True), 200

# TRAER PERFIL
@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user['email']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user=user.serialize()), 200

# PHYSICAL INFORMATION
# GET ALL PhysicalInformation / TRAER TODAS INFORMACION FISICA
@api.route('/physical-information', methods=['GET'])
def get_all_physical_information():
    physical_information = PhysicalInformation.query.all()
    if physical_information == 0:
        return ({'error':'physical information list not found'}), 404
    else:
        data_serialized = list(map(lambda information: information.serialize(), physical_information))
        return jsonify(data_serialized), 200
    
# GET ONE PhysicalInformation / TRAER UNA INFORMACION FISICA
@api.route('/physical-user-information', methods=['GET'])
@jwt_required()
def get_one_physical_user_information():
    current_user=get_jwt_identity()
    physical_information = PhysicalInformation.query.filter_by(user_id=current_user["id"]).first()
    if physical_information is None:
        return ({'error':'physical information not found'}), 404
    else:
        data_serialized = physical_information.serialize()
        return jsonify(data_serialized), 200

# POST PhysicalInformation / AGREGAR INFORMACION FISICA
@api.route('/physical-information', methods=['POST'])
@jwt_required()
def post_physical_information():
    current_user=get_jwt_identity()
    physical_information = request.get_json()
    if not isinstance(physical_information['height'], str) or len(physical_information['height'].strip()) == 0:
         return({'error':'"height" must be a string'}), 400
    if not isinstance(physical_information['weight'], str) or len(physical_information['weight'].strip()) == 0:
         return({'error':'"weight" must be a string'}), 400

    physical_information_created = PhysicalInformation(user_id=current_user["id"], height=physical_information["height"], weight=physical_information["weight"], date=date.today())
    
    db.session.add(physical_information_created)
    db.session.commit()
    return jsonify(physical_information_created.serialize()), 200

# WEEKLY ROUTINE
# GET ALL WeeklyRoutine / TRAER TODAS RUTINA SEMANA
@api.route('/weekly-routine', methods=['GET'])
def get_all_weekly_routine():
    weekly_routine = WeeklyRoutine.query.all()
    if len(weekly_routine) == 0:
        return ({'error':'WeeklyRoutine list not found'}), 404
    else:
        data_serialized = list(map(lambda routine: routine.serialize(), weekly_routine))
        return jsonify(data_serialized), 200
   
# GET ALL WeeklyRoutine OF USER / TRAER TODAS RUTINA SEMANA DE USUARIO
@api.route('/weekly-user-routine', methods=['GET'])
@jwt_required()
def get_all_weekly_user_routine():
    current_user=get_jwt_identity()
    weekly_routine = WeeklyRoutine.query.filter_by(user_id=current_user["id"]).all()
    if len(weekly_routine) == 0:
        return ({'error':'weekly routine list of one day not found'}), 404
    else:
        data_serialized = list(map(lambda routine: routine.serialize(), weekly_routine))
        return jsonify(data_serialized), 200

# # GET ONE WeeklyRoutine OF USER / TRAER UNA RUTINA SEMANA DE USUARIO
# @api.route('/weekly-routine/<int:user_id>/<int:week>', methods=['GET'])
# def get_one_weekly_routine_user(user_id, week):
#     print(Week(week))
#     weekly_routine = WeeklyRoutine.query.filter_by(user_id=user_id, week=Week(week)).all()
#     if len(weekly_routine) == 0:
#         return ({'error':'one WeeklyRoutine user list not found'}), 404
#     else:
#         data_serialized = list(map(lambda routine: routine.serialize(), weekly_routine))
#         return jsonify(data_serialized), 200

# GET ONE weekly-user-routine / TRAER TODAS RUTINA DEL USUARIO DE UNA SEMANA
@api.route('/weekly-user-routine/<int:week>', methods=['GET'])
@jwt_required()
def get_all_exercise_routine_one_day(week):
    current_user=get_jwt_identity()
    exercise_routine = WeeklyRoutine.query.filter_by(week=Week(week), user_id=current_user["id"]).all()
    if len(exercise_routine) == 0:
        return ({'error':'exercise routine list of one day not found'}), 404
    else:
        data_serialized = list(map(lambda routine: routine.serialize(), exercise_routine))
        return jsonify(data_serialized), 200
    
# POST WeeklyRoutine / AGREGAR RUTINA SEMANA DE USUARIO
@api.route('/weekly-routine', methods=['POST'])
@jwt_required()
def post_weekly_routine():
    current_user=get_jwt_identity()
    weekly_routine = request.get_json()
    if not isinstance(weekly_routine['routine_id'], str) or len(weekly_routine['routine_id'].strip()) == 0:
         return({'error':'"routine_id" must be a string'}), 400
    if not isinstance(weekly_routine['week'], str) or len(weekly_routine['week'].strip()) == 0:
         return({'error':'"week" must be a string'}), 400
    if not isinstance(weekly_routine['day'], str) or len(weekly_routine['day'].strip()) == 0:
         return({'error':'"day" must be a string'}), 400

    weekly_routine_created = WeeklyRoutine(user_id=current_user["id"], routine_id=weekly_routine["routine_id"], week=weekly_routine["week"], day=weekly_routine["day"])
    db.session.add(weekly_routine_created)
    db.session.commit()
    return jsonify(weekly_routine_created.serialize()), 200

# ROUTINE
# GET ALL Routine / TRAER TODAS RUTINA
@api.route('/routine', methods=['GET'])
def get_all_routine():
    routine = Routine.query.all()
    if len(routine) == 0:
        return ({'error':'Routine list not found'}), 404
    else:
        data_serialized = list(map(lambda routine: routine.serialize(), routine))
        return jsonify(data_serialized), 200
   
# GET ONE Routine / TRAER UNA RUTINA
@api.route('/routine/<int:id>', methods=['GET'])
def get_routine(id):
    routine = Routine.query.filter_by(id=id).first()
    if routine is None:
        return ({'error':'Routine not found'}), 404
    else:
        data_serialized = routine.serialize()
        return jsonify(data_serialized), 200
    
# POST Routine / AGREGAR RUTINA
@api.route('/routine', methods=['POST'])
@jwt_required()
def post_routine():
    current_user=get_jwt_identity()
    routine = request.get_json()
    if not isinstance(routine['name'], str) or len(routine['name'].strip()) == 0:
         return({'error':'"name" must be a string'}), 400

    routine_created = Routine(user_id=current_user["id"], name=routine["name"])
    db.session.add(routine_created)
    db.session.commit()
    return jsonify(routine_created.serialize()), 200

# EXERCISE
# GET ALL EXERCICE / TRAER TODOS EJERCICIO
@api.route('/exercise', methods=['GET'])
def get_all_exercise():
    exercise = Exercise.query.all()
    if len(exercise) == 0:
        return ({'error':'exercise list not found'}), 404
    else:
        data_serialized = list(map(lambda exercise: exercise.serialize(), exercise))
        return jsonify(data_serialized), 200

# GET ONE EXERCIE / TRAER UN EJERCICIO
@api.route('/exercise/<int:id>', methods=['GET'])
def get_one_exercise(id):
    exercise = Exercise.query.filter_by(id=id).first()
    if exercise is None:
        return ({'error':'exercise not found'}), 404
    else:
        data_serialized = exercise.serialize()
        return jsonify(data_serialized), 200

# POST EXERCISE / AGREGAR EJERCICIO
@api.route('/exercise', methods=['POST'])
def post_exercise():
    exercise = request.get_json()
    if not isinstance(exercise['name'], str) or len(exercise['name'].strip()) == 0 :
        return ({'error': "'name' must be a string"}), 400
    if not isinstance(exercise['category'], str) or len(exercise['category'].strip()) == 0 :
        return ({'error': "'category' must be a string"}), 400
    if not isinstance(exercise['description'], str) or len(exercise['description'].strip()) == 0 :
        return ({'error': "'description' must be a string"}), 400
    if not isinstance(exercise['image'], str) or len(exercise['image'].strip()) == 0 :
        return ({'error': "'image' must be a string"}), 400

    exercise_created = Exercise(name = exercise['name'], category = exercise['category'], description = exercise['description'], image = exercise['image'])
    db.session.add(exercise_created)
    db.session.commit()
    return jsonify(exercise_created.serialize())

# GET ALL ExerciseRoutine / TRAER TODAS RUTINA EJERCICIO
@api.route('/exercise-routine', methods=['GET'])
def get_all_exercise_routine():
    exercise_routine = ExerciseRoutine.query.all()
    if len(exercise_routine) == 0:
        return ({'error':'exercise routine list not found'}), 404
    else:
        data_serialized = list(map(lambda routine: routine.serialize(), exercise_routine))
        return jsonify(data_serialized), 200

# POST ExerciseRoutine / AGREGAR RUTINA EJERCICIO
@api.route('/exercise-routine', methods=['POST'])
def post_exercise_routine():
    exercise_routine = request.get_json()
    if not isinstance(exercise_routine['routine_id'], str) or len(exercise_routine['routine_id'].strip()) == 0 :
        return ({'error': "'routine_id' must be a string"}), 400
    if not isinstance(exercise_routine['exercise_id'], str) or len(exercise_routine['exercise_id'].strip()) == 0 :
        return ({'error': "'exercise_id' must be a string"}), 400

    exercise_routine_created = ExerciseRoutine(routine_id = exercise_routine['routine_id'], exercise_id = exercise_routine['exercise_id'])
    db.session.add(exercise_routine_created)
    db.session.commit()
    return jsonify(exercise_routine_created.serialize())

# GET ALL FollowUp / TRAER TODOS SEGUIMIENTO
@api.route('/follow-up', methods=['GET'])
def get_all_follow_up():
    follow_up = FollowUp.query.all()
    if len(follow_up) == 0:
        return ({'error':'followUp list not found'}), 404
    else:
        data_serialized = list(map(lambda followUp: followUp.serialize(), follow_up))
        return jsonify(data_serialized), 200

# GET ALL FollowUp weekly_routine / TRAER TODOS SEGUIMIENTO DE UNA RUITNA SEMANA
@api.route('/follow-up/<int:weekly_routine_id>', methods=['GET'])
def get_one_follow_up(weekly_routine_id):
    follow_up = FollowUp.query.filter_by(weekly_routine_id=weekly_routine_id).all()
    if len(follow_up) == 0:
        return ({'error':'followUp of one week not found'}), 404
    else:
        data_serialized = list(map(lambda followUp: followUp.serialize(), follow_up))
        return jsonify(data_serialized), 200

# POST FollowUp / AGREGAR SEGUIMIENTO
@api.route('/follow-up', methods=['POST'])
def post_follow_up():
    follow_up = request.get_json()
    if not isinstance(follow_up['weekly_routine_id'], str) or len(follow_up['weekly_routine_id'].strip()) == 0 :
        return ({'error': "'weekly_routine_id' must be a string"}), 400
    if not isinstance(follow_up['exercise_routine_id'], str) or len(follow_up['exercise_routine_id'].strip()) == 0 :
        return ({'error': "'exercise_routine_id' must be a string"}), 400

    follow_up_created = FollowUp(weekly_routine_id = follow_up['weekly_routine_id'], exercise_routine_id = follow_up['exercise_routine_id'])
    db.session.add(follow_up_created)
    db.session.commit()
    return jsonify(follow_up_created.serialize())