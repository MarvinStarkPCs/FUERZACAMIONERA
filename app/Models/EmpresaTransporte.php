<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaTransporte extends Model
{
    protected $table = 'empresas_transporte';
    protected $fillable = ['razon_social','nit','direccion','email','telefono','representante_legal','observaciones'];

    public function casosJuridicos()
    {
        return $this->hasMany(CasoJuridico::class, 'empresa_transporte_id');
    }
}
