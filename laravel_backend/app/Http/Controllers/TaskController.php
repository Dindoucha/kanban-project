<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $task = new Task($request->only("name","description","due","order","container","priority"));
        $project = Auth::user()->projects->where("id",$request->project_id)->firstOrFail();
        $task->project_id = $project->id;
        $task->save();
        return response(["id" => $task->id]);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if (Auth::user()->id !== $task->project->user_id){
            abort(403, "Unauthorized action.");
        }
        $task->delete();
        return response(["message" => "Task deleted successfully"]);
    }

    public function massUpdate(Request $request)
    {
        foreach ($request->tasks as $container=>$tasks) {
            $order = 1;
            foreach($tasks as $taskData){
                // return response()->json($taskData["id"]);
                $task = Task::find($taskData["id"]);
                
                if (Auth::user()->id !== $task->project->user_id){
                    abort(403, "Unauthorized action.");
                }
                
                $task->update([
                    "name" => $order,
                    "container" => $container
                ]);
                $order++;
            }
        }

        return response()->json(["message" => "Tasks updated successfully"]);
    }
}
