from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Project, Task, User

projects = Blueprint("projects", __name__)

@projects.get('')
@jwt_required()
def index():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    projects = user.projects
    return jsonify([project.to_dict() for project in projects])

@projects.post('')
@jwt_required()
def store():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    project = Project(user_id=user.id)
    project.save()
    return jsonify(project.to_dict()), 201

@projects.delete('/<int:project_id>')
@jwt_required()
def destroy(project_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    project = Project.query.get_or_404(project_id)
    if project.user_id != user.id:
        return jsonify({"message": "Unauthorized action."}), 403
    project.delete()
    return jsonify({"message": "deleted"})

@projects.get('/<int:project_id>/tasks')
@jwt_required()
def tasks(project_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    project = Project.query.get_or_404(project_id)
    if project.user_id != user.id:
        return jsonify({"message": "Unauthorized action."}), 403

    backlog = Task.query.filter_by(project_id=project.id, container="Backlog").order_by("order").all()
    in_progress = Task.query.filter_by(project_id=project.id, container="In Progress").order_by("order").all()
    in_review = Task.query.filter_by(project_id=project.id, container="In Review").order_by("order").all()
    done = Task.query.filter_by(project_id=project.id, container="Done").order_by("order").all()

    return jsonify({
        "tasks": {
            "Backlog": [task.to_dict() for task in backlog],
            "In Progress": [task.to_dict() for task in in_progress],
            "In Review": [task.to_dict() for task in in_review],
            "Done": [task.to_dict() for task in done]
        }
    })
