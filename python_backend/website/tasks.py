from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Task, Project, User

tasks = Blueprint("tasks", __name__)

@tasks.post('')
@jwt_required()
def store():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    project_id = request.json.get('project_id')
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if not project:
        return jsonify({"message": "Project not found or unauthorized"}), 404

    task = Task(
        name=request.json.get("name"),
        description=request.json.get("description"),
        due=request.json.get("due"),
        order=request.json.get("order"),
        container=request.json.get("container"),
        priority=request.json.get("priority"),
        project_id=project.id
    )
    task.save()
    return jsonify({"id": task.id}), 201

@tasks.delete('/<int:task_id>')
@jwt_required()
def destroy(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.get_or_404(task_id)
    if task.project.user_id != current_user_id:
        return jsonify({"message": "Unauthorized action."}), 403
    task.delete()
    return jsonify({"message": "Task deleted successfully"})

@tasks.post('/mass-update')
@jwt_required()
def mass_update():
    current_user_id = get_jwt_identity()
    tasks_data = request.json.get('tasks', {})
    for container, tasks in tasks_data.items():
        for task_data in tasks:
            task_id = task_data.get("id")
            task = Task.query.get_or_404(task_id)
            if task.project.user_id != current_user_id:
                return jsonify({"message": "Unauthorized action."}), 403
            task.order=task_data.get("order")
            task.container=container
            task.save()
    return jsonify({"message": "Tasks updated successfully"})
