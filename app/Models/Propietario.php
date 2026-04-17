<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Propietario extends Model
{
    protected $fillable = ['nombre','cedula','telefono','email','direccion','observaciones'];

    public function casosJuridicos()
    {
        return $this->hasMany(CasoJuridico::class, 'propietario_id');
    }
}
