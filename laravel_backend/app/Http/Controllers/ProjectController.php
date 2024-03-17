<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Auth::user()->projects;
        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $project = new Project();
        $project->user_id = Auth::user()->id;
        $project->save();
        return response()->json($project, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if(Auth::user()->id !== $project->user_id){
            abort(403, 'Unauthorized action.');
        }
        $project->delete();
        return response(["message"=>"deleted"]);
    }

    public function tasks(Project $project)
    {
        if(Auth::user()->id !== $project->user_id){
            abort(403, 'Unauthorized action.');
        }

        $backlog = Task::where("project_id",$project->id)->where("container","Backlog")->orderBy('order')->get();
        $in_progress = Task::where("project_id",$project->id)->where("container","In Progress")->orderBy('order')->get();
        $in_review = Task::where("project_id",$project->id)->where("container","In Review")->orderBy('order')->get();
        $done = Task::where("project_id",$project->id)->where("container","Done")->orderBy('order')->get();

        return response()->json(["tasks"=>[
            "Backlog"=>$backlog,
            "In Progress"=>$in_progress,
            "In Review"=>$in_review,
            "Done"=>$done,
            ]]);
    }
}
