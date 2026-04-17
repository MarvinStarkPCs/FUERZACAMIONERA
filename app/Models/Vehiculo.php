<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $fillable = [
        'afiliado_id',
        'placa',
        'tarjeta_propiedad',
        'marca',
        'modelo',
        'anio',
        'color',
        'observaciones',
    ];

    public function afiliado()
    {
        return $this->belongsTo(Afiliado::class);
    }
}
