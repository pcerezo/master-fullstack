<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller
{
    // Pedir siempre la autenticación ante cada acción del controlador
    public function __construct() {
        $this->middleware('api.auth', ['except' => 
            ['index', 'show', 'getImage','getPostsByCategory', 'getPostsByUser']]);
    }
    
    public function index(Request $request) {
        $posts = Post::all()->load('category')->load('user');
        
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'posts' => $posts
        ], 200);
    }
    
    public function show($id) {
        $post = Post::find($id)->load('category')->load('user');
        
        if (is_object($post)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'post' => $post
            ];
        }
        else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'No se encontró el post'
            ];
        }
        
        return response()->json($data, $data['code']);
    }
    
    public function store(Request $request) {
        // Obtener los datos
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        // Conseguir el usuario identificado
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);
        if (!empty($params_array) && $user) {
            // Validar los datos
           $validate = \Validator::make($params_array, [
               'title' => 'required',
               'content' => 'required',
               'category_id' => 'required'
           ]);

           if ($validate->fails()) {
               $data = [
                   'code' => 400,
                   'status' => 'error',
                   'message' => 'Obligatorio rellenar título, contenido y categoría'
               ];
           }
           else {
                // Crear objeto, darle los valores y guardar
                $post = new Post();
                $post->title = $params_array['title'];
                $post->content = $params_array['content'];
                $post->category_id = $params_array['category_id'];
                $post->user_id = $user->sub;
                $post->image = $params_array['image'];
                
                $post->save();

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'post' => $post
                ];
           }
        }
        else {
            $data = [
                   'code' => 400,
                   'status' => 'error',
                   'message' => 'Usuario no identificado'
               ];
        }
       
       // Devolver la respuesta
       return response()->json($data, $data['code']);
    }
    
    /*public function update($id, Request $request) {
        // Recoger los datos
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        $default_error = [
            'code' => 400,
            'status' => 'error',
            'message' => 'Error en la edición'
        ];
        
        // Conseguir el usuario identificado
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);
        
        // Validar los datos
        if (!empty($params_array)) {
            $validate = \Validator::make($params_array, [
                'title' => 'required',
                'content' => 'required',
                'category_id' => 'required'
                //'image' => 'required'
            ]);

            if ($validate->fails()) {
                $default_error['errors'] = $validate->errors();
                return response()->json($default_error, $default_error['code']);
            }
            else {
                // Quitar lo que no interesa
                unset($params_array['id']);
                //unset($params_array['user_id']);
                //unset($params_array['user']);
                unset($params_array['created_at']);
                
                // Se obtiene el post comprobando que sea del usuario
                $post = Post::where('id', $id)
                        ->where('user_id', $user->sub)
                        ->first();
                
                // Si no lo es o no existe, devuelve error
                if (!$post || !is_object($post)) {
                    $default_error['messages'] = 'Error, el post no existe o no te pertenece';
                    
                    return response()->json($default_error, $default_error['code']);
                }
                
                // Devolver el resultado
                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'cambios' => $params_array,
                    'post' => $post->load('category')->load('user')
                ];
            }
            
            return response()->json($data, $data['code']);
        }
        
        return response()->json($default_error, $default_error['code']);
    }*/

    public function update($id, Request $request){
        // Recoger datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
   
        // Datos para devolver
        $data = array(
          'code' => 404,
          'status' => 'error',
          'message' => 'Datos enviados incorrectos'
          );
   
        if(!empty($params_array)){
        // Validar datos
        $validate = \Validator::make($params_array, [
          'title' => 'required',
          'content' => 'required',
          'category_id' => 'required'
        ]);
   
        if($validate->fails()){
               $data['errors'] = $validate->errors();
               return response()->json($data, $data['code']);
        }
   
        // Eliminar lo que no queremos actualizar ya no es necesario
      //   unset($params_array['id']);
      //   unset($params_array['user_id']);
      //   unset($params_array['created_at']);
      //   unset($params_array['user']);
   
   
        // Actualizar el registro en concreto
         $post = Post::find($id);
         $post->title = $params_array['title'];
         $post->content = $params_array['content'];
         $post->category_id = $params_array['category_id'];
         $post->image = $params_array['image'];
         $post->save();
   
         $data = array(
                'code' => 200,
                'status' => 'success',
                'post' => $post,
                'changes' => $params_array
         );
        }
   
        // Devolver respuesta
        return response()->json($data, $data['code']);
    }
    
    public function destroy($id, Request $request) {
        // Conseguir el usuario identificado
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);
        
        // Conseguir el registro
        $post = Post::where('id', $id)->where('user_id', $user->sub)->first();
        
        if (!empty($post)) {
            // Borrarlo
            $post->delete();

            // Devolver resultado
            $data = [
                'code' => 200,
                'status' => 'success',
                'post' => $post->load('category')->load('user')
            ];
        }
        else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'El post no existe o no te pertenece'
            ];
        }
        
        return response()->json($data, $data['code']);
    }
    
    public function upload(Request $request) {
        // Recoger la imagen de la petición
        $image = $request->file('file0');
        
        // Validar la imagen
        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        
        // Guardar la imagen
        if (!$image || $validate->fails()) {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Error al subir la imagen'
            ];
        }
        else {
            $image_name = time().$image->getClientOriginalName();
            
            \Storage::disk('images')->put($image_name, \File::get($image));
            
            $data = [
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            ];
        }
        
        // Devolver datos
        return response()->json($data, $data['code']);
    }
    
    public function getImage($filename) {
        // Comprobar si existe el fichero
        $isset = \Storage::disk('images')->exists($filename);
        
        if ($isset){
            // Conseguir la imagen
            $file = \Storage::disk('images')->get($filename);

            // Devolver la imagen
            return new Response($file, 200);
        }
        else {
            // Mostrar el error
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'No se encontró la imagen'
            ];
            
            return response()->json($data, $data['code']);
        }
    }
    
    public function getPostsByCategory($id) {
        $posts = Post::where('category_id', $id)->get();
        $data = [
            'code' => 200,
            'status' => 'success',
            'message' => $posts
        ];
        return response()->json($data, $data['code']);
    }
    
    public function getPostsByUser($id) {
        $posts = Post::where('user_id', $id)->get();
        $data = [
            'code' => 200,
            'status' => 'success',
            'posts' => $posts
        ];
        return response()->json($data, $data['code']);
    }
}
