<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GastoAsociacion extends Model
{
    protected $table = 'gastos_asociacion';
    protected $fillable = [
        'fecha','concepto','categoria','valor','medio_pago',
        'cuenta_origen','responsable_id','soporte','observaciones',
    ];

    protected function casts(): array
    {
        return ['fecha' => 'date', 'valor' => 'decimal:2'];
    }

    const CATEGORIAS = [
        'papeleria'      => 'Papeleria',
        'transporte'     => 'Transporte',
        'honorarios'     => 'Honorarios',
        'viaticos'       => 'Viaticos',
        'administracion' => 'Administracion',
        'tecnologia'     => 'Tecnologia',
        'reuniones'      => 'Reuniones',
        'publicidad'     => 'Publicidad',
        'otro'           => 'Otro',
    ];

    public function responsable() { return $this->belongsTo(User::class, 'responsable_id'); }
}
