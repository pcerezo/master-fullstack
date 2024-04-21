<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class JwtAuth {
    public $key;
    
    public function __construct() {
        $this->key = 'clave_secreta-77';
    }
    public function signup($email, $password, $getToken = null) {
        // Buscar si existe el usuario con sus credenciales
        /*$user = User::where([
            'email'     => $email,
            'password'  => $password
        ])->first();*/
        if (Auth::attempt(['email' => $email, 'password' => $password])) {
            // Autenticación exitosa
            $user = User::where('email', $email)->first();
            $signup = true;
        }
        else {
            $signup = false;
        }
        
        // Generar el token con los datos del usuario
        if ($signup) {
            $token = array(
                'sub'       => $user->id,
                'email'     => $user->email,
                'name'      => $user->name,
                'surname'   => $user->surname,
                'description' => $user->description,
                'role'      => $user->role,
                'image'     => $user->image,
                'iat'       => time(), // fecha actual de creación del token
                'exp'       => time() + (7*24*60*60)// tiempo de caducidad
            );
            
            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            // Devolver los datos decodificados o el token en función de un parámetro
            if(is_null($getToken)){
                $data = $jwt;
            }
            else {
                $data = $decoded;
            }
        }
        else {
            $data = array(
                'status' => 'error',
                'message' => 'Login incorrecto',
            );
        }
        
        return $data;
    }
    
    public function checkToken($jwt, $getIdentity = false) {
        $auth = false;
        $jwt = str_replace('"', '', $jwt); //<-- elimina las comillas dobles si las hubiera
        try {
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
        } catch(\UnexpectedValueException $e) {
            $auth = false;
        } catch(\DomainException $e) {
            $auth = false;
        }
        
        // Ver que no está vacía, es un objeto y que contiene el id del usuario
        if (!empty($decoded) && is_object($decoded) && isset($decoded->sub)) {
            $auth = true;
        }
        else {
            $auth = false;
        }
        
        if ($getIdentity) {
            return $decoded;
        }
        
        return $auth;
    }
}

