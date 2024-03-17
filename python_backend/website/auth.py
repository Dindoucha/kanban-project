from flask import Blueprint, request, jsonify
from .models import User
from flask_jwt_extended import jwt_required, create_access_token


auth = Blueprint("auth",__name__)


@auth.post("/login")
def login():
  data = request.get_json()
  user = User.check_login(data["email"],data["password"])
  if user:
    token = create_access_token(identity=user.id)
    return jsonify(token=token)
  return

@auth.post("/signup")
def signup():
  data = request.get_json()
  name = data.get("name")
  email = data.get("email")
  password = data.get("password")

  if not name or not email or not password:
      return jsonify({"message": "Missing required fields"}), 400
  
  if User.query.filter_by(email=email).first():
    return jsonify({"message": "User already exists"}), 400
  
  user = User.sign_up(name=name, email=email, password=password)

  if user:
    token = create_access_token(identity=user.id)
    return jsonify(token=token), 201
  

@auth.get("/ping")
@jwt_required()
def ping():
  return jsonify({"message":"Token is valid."})

@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
  return jsonify({"message": "Successfully logged out"}), 200