<?php

namespace  App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// Login Route
Route::post('/login',[AuthController::class,"login"])->name("login");
Route::post('/signup',[AuthController::class,"signup"]);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/ping', function (Request $request) {
        return response()->json(['message' => 'Token is valid.']);
    });
    
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    });

    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects/{project}/tasks', [ProjectController::class, 'tasks']);
    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/mass-update', [TaskController::class, 'massUpdate']);


});