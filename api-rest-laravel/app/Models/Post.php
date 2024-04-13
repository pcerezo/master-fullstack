<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';
    
    // Los campos que se pueden modificar de forma masiva
    protected $fillable = [
        'title',
        'content',
        'category_id',
        'image'
    ];
    
    // Relación de muchos a uno
    public function user() {
        return $this->belongsTo('App\Models\User', 'user_id');
    }
    
    public function category() {
        return $this->belongsTo('App\Models\Category', 'category_id');
    }
}
