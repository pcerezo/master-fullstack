<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\User;

class UserController extends Controller
{
    public function pruebas(Request $request) {
        return "Acción de UserController";
    }
    
    public function register(Request $request) {
        // Recoger los datos del usuario por post
        $json = $request->input('json', null); //<-- 2º parámetro es el valor por defecto (si no hay una clave 'json')
        $params = json_decode($json); // Obtener un objeto
        $params_array = json_decode($json, true); // Obtener un array
        
        if (!empty($params) && !empty($params_array)) {
            //Limpiar datos
            $params_array = array_map('trim', $params_array);

            // Validar datos
            $validate = \Validator::make($params_array, [
                'name' => 'required|alpha',
                'surname' => 'required',
                'email' => 'required|email|unique:users', // con unique asegura que el email es único en la tabla users
                'password' => 'required'
            ]);

            if ($validate->fails()) {
                $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'El usuario no se ha creado',
                    'errors' => $validate->errors()
                );
            }
            else {
                // Validación correcta
                
                // Cifrar la contraseña
                // Problema de password_hash() --> no siempre encripta de la misma forma
//                $pwd = password_hash($params_array['password'], PASSWORD_BCRYPT, ['cost' => 4]);
                // hash() encripta siempre de la misma manera
                $pwd = hash('sha256', $params_array['password']);
                
                // Crear el usuario
                $user = new User();
                $user->name = $params_array['name'];
                $user->surname = $params_array['surname'];
                $user->email = $params_array['email'];
                $user->password = $pwd;
                $user->role = 'ROLE_USER';
                
                // Guardar el usuario
                $user->save();
                
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El usuario creado correctamente',
                    'user' => $user
                );
                
                //var_dump($user);
            }
        }
        else {
            $data = array(
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'Los datos enviados no son correctos'
                );
        }
        
        return response()->json($data, $data['code']);
    }
    
    public function login(Request $request) {
        $jwtAuth = new \JwtAuth(); // Se llama al alias con la barra invertida delante
        
        // Recibir datos por POST
        $json = $request->input('json', null); //<-- 2º parámetro es el valor por defecto (si no hay una clave 'json')
        $params = json_decode($json);
        $params_array = json_decode($json, true); // Obtener un array
        $params_array = array_map('trim', $params_array);
        
        // Validar datos
        $validate = \Validator::make($params_array, [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Comprobar si hay errores
        if ($validate->fails()) {
            $signup = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'El usuario no se ha posido identificar',
                'errors' => $validate->errors()
            );
        }
        else {
            // Cifrar la contraseña
            $pwd = hash('sha256', $params_array['password']);
            // Devolver token o datos
            if (!empty($params_array['gettoken'])) {
                // Se devuelven los datos
                $signup = $jwtAuth->signup($params_array['email'], $pwd, true);
            }
            else {
                // Se devuelve el token
                $signup = $jwtAuth->signup($params_array['email'], $pwd);
            }
        }
        
        return response()->json($signup);
    }
    
    public function update(Request $request) {
        // Comprobar si el usuario está identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);
        
        // Recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        if ($checkToken && !empty($params_array)) {
            // Sacar usuario identificado
            $user = $jwtAuth->checkToken($token, true);
            
            // Validar datos
            $validate = \Validator::make($params_array, [
                'name' => 'required|alpha',
                'surname' => 'required|alpha',
                'email' => 'required|email|unique:users,'.$user->sub, // se concatena con el identificador para que no dé error de validación
            ]);
            
            // Quitar los campos que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_token']);
            
            // Actualizar usuario en bdd
            $user_update = User::where('id', $user->sub)->update($params_array);
            
            // Devolver array con resultado
            $data = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Usuario identificado correctamente',
                'old user' => $user,
                'changes' => $params_array
            );
        }
        else {
            $data = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'El usuario no se ha posido identificar'
            );
        }
        
        return response()->json($data, $data['code']);
    }
    
    public function upload(Request $request) {
        // Recoger datos de la petición
        $image = $request->file('file0');
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        $user = null;

        if ($checkToken) {
            // Sacar usuario identificado
            $user = $jwtAuth->checkToken($token, true);
        }

        // Validación de imagen
        $validator = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,JPG,jpeg,jpe,png,gif,jfif,webp'
        ]);
        
        // Guardar imagen
        if (!$image || $validator->fails()) {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'Error al subir imagen'
            );
        }
        else {
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk('users')->put($image_name, \File::get($image));

            if ($user) {
                $params_array['image'] = $image_name;
                $user_update = User::where('id', $user->sub)->update($params_array);
            }
            
            $data = array(
                'code' => 200,
                'status' => 'success',
                'image' => $image_name,
                'message' => $user->name
            );
        }
        
        // Devolver el resultado
        return response()->json($data, $data['code']);
    }
    
    public function getImage($filename) {
        $isset = \Storage::disk('users')->exists($filename);
        
        if ($isset) {
            $file = \Storage::disk('users')->get($filename);
            return new Response($file, 200);
        }
        else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'La imagen no existe'
            );
            
            return response()->json($data, $data['code']);
        }
    }
    
    public function details($id) {
        $user = User::find($id);
        
        if (is_object($user)) {
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $user
            );
        }
        else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'El usuario no existe'
            );
        }
        
        return response()->json($data, $data['code']);
    }
}
