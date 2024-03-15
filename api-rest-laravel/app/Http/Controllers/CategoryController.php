<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Category;

class CategoryController extends Controller
{
    // Cargar middleware para no tener que llamarlo en el archivo de rutas
    public function __construct() {
        $this->middleware('api.auth', ['except' => ['index', 'show']]);
    }
    
    public function index(Request $request) {
        $categories = Category::all();
        
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'categories' => $categories
        ]);
    }
    
    public function show($id) {
        $category = Category::find($id);
        
        if (is_object($category)) {
            $data = response()->json([
                'code' => 200,
                'status' => 'success',
                'category' => $category
            ]);
        }
        else {
            $data = response()->json([
                'code' => 400,
                'status' => 'error',
                'category' => 'No existe la categoría solicitada'
            ]);
        }
        
        return $data;
    }
    
    public function store(Request $request) {
        // Recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        $errorVacio = [
            'code' => 400,
            'status' => 'error',
            'message' => 'No se ha enviado ninguna categoría'
        ];
        $error = [
            'code' => 400,
            'status' => 'error',
            'message' => 'Error al guardar la categoría'
        ];
        
        if ($params_array == null || empty($params_array)) {
            return response()->json($errorVacio, $errorVacio['code']);
        }
        // Validar los datos
        $validate = \Validator::make($params_array, [
            'name' => 'required'
        ]);
        
        // Guardar la categoría
        if ($validate->fails()) {
            $data = $error;
        }
        else {
            $category = new Category();
            $category->name = $params_array['name'];
            $category->save();
            
            $data = [
                'code' => 200,
                'status' => 'success',
                'category' => $category
            ];
        }
        
        // Devolver el resultado
        return response()->json($data, $data['code']);
    }
    
    public function update($id, Request $request) {
        // Recoger datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        if (!empty($params_array)){
            // Validar los datos
            $validate = \Validator::make($params_array, [
                'name' => 'required'
            ]);
            
            if ($validate->fails()) {
                $data = [
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'Se requiere dar valor al nombre'
                ];
            }
            else {

                // Quitar lo que no quiero actualizar
                unset($params_array['id']);
                unset($params_array['created_at']);

                // Actualizar el registro
                $actualizado = Category::where('id', $id)->update($params_array);
                
                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'category' => $params_array
                ];

                // Devolver los datos
            }
        }
        else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'No has enviado ninguna categoría'
            ];
        }
        
        return response()->json($data, $data['code']);
    }
}
