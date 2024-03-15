<?php

use Illuminate\Support\Facades\Route;
// Controladores
use App\Http\Controllers\PruebasController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;

// Middlewares
use App\Http\Middleware\ApiAuthMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// RUTAS DE PRUEBA
Route::get('/welcome', function () {
    return view('welcome');
});

Route::get('/pruebas/{nombre?}', function($nombre = null){
    $texto = '<h2>Texto desde una ruta</h2>';
    $texto .= 'Nombre: ' .$nombre;
    return view('pruebas', array('texto' => $texto));
});

Route::get('/animales', [PruebasController::class, 'index']);

Route::get('/testORM', [PruebasController::class, 'testORM']);

// RUTAS DEL API
    // rutas de prueba
    //Route::get('/usuario/pruebas', [UserController::class, 'pruebas']);
    //Route::get('/categoria/pruebas', [CategoryController::class, 'pruebas']);
    //Route::get('/post/pruebas', [PostController::class, 'pruebas']);
    
    // rutas del controlador de usuario
    Route::post('/api/register', [UserController::class, 'register']);
    Route::post('/api/login', [UserController::class, 'login']);
    Route::put('/api/user/update', [UserController::class, 'update']);
    Route::post('/api/user/upload', [UserController::class, 'upload'])->middleware([ApiAuthMiddleware::class]);
    Route::get('/api/user/avatar/{filename}', [UserController::class, 'getImage']);
    Route::get('/api/user/details/{id}', [UserController::class, 'details']);
    
    // Rutas del controlador de categorías
    Route::resource('/api/category', CategoryController::class);
    
    // Rutas del controlador de posts
    Route::resource('/api/post', PostController::class);
    Route::post('/api/post/upload', [PostController::class, 'upload']);
    Route::get('/api/post/image/{filename}', [PostController::class, 'getImage']);
    Route::get('/api/post/category/{category_id}', [PostController::class, 'getPostsByCategory']);
    Route::get('/api/post/user/{user_id}', [PostController::class, 'getPostsByUser']);