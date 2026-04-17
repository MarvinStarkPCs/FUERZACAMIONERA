<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneradorCarga extends Model
{
    protected $table = 'generadores_carga';
    protected $fillable = ['razon_social','nit','direccion','email','telefono','representante_legal','observaciones'];

    public function casosJuridicos()
    {
        return $this->hasMany(CasoJuridico::class, 'generador_carga_id');
    }
}
