from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(255), nullable=False)
  email = db.Column(db.String(255), unique=True, nullable=False)
  password = db.Column(db.String(255), nullable=False)
  projects = db.relationship('Project', backref='task', lazy=True)

  @staticmethod
  def sign_up(name,email,password):
    if not User.query.filter_by(email=email).first():
      admin = User(name=name,email=email, password=generate_password_hash(password))
      db.session.add(admin)
      db.session.commit()

  @staticmethod
  def check_login(email,password):
    user = User.query.filter_by(email=email).first()
    if user is not None and check_password_hash(user.password, password):return user
    return False


class Project(db.Model):
  __tablename__ = 'projects'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  tasks = db.relationship('Task', backref='project', lazy=True)

  def to_dict(self):
    return {
      "id":self.id,
      "user_id":self.user_id,
      "tasks":[task.to_dict() for task in self.tasks]
    }
  
  def save(self):
    db.session.add(self)
    db.session.commit()

class Task(db.Model):
  __tablename__ = 'tasks'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String, nullable=False)
  description = db.Column(db.String)
  due = db.Column(db.String, nullable=False)
  priority = db.Column(db.String, nullable=False)
  project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
  order = db.Column(db.Integer, nullable=False)
  container = db.Column(db.String, nullable=False)

  def to_dict(self):
    return {
      "id":self.id,
      "name":self.name,
      "description":self.description,
      "due":self.due,
      "priority":self.priority,
      "project_id":self.project_id,
      "order":self.order,
      "container":self.container
    }
  
  def save(self):
    db.session.add(self)
    db.session.commit()