from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
  app = Flask(__name__)
  CORS(app)

  # Set the secret key
  app.config['JWT_SECRET_KEY'] = os.urandom(32)
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
  jwt = JWTManager(app)

  db.init_app(app)

  from .auth import auth
  from .projects import projects
  from .tasks import tasks
  
  app.register_blueprint(auth, url_prefix='/api')
  app.register_blueprint(projects, url_prefix='/api/projects')
  app.register_blueprint(tasks, url_prefix='/api/tasks')

  create_database(app)

  return app

def create_database(app):
  from .models import User
  with app.app_context():
    db.create_all()
    User.sign_up("test user","test@example.com","password")
    print('Created Database !')