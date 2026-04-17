<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccionGremial extends Model
{
    protected $table = 'acciones_gremiales';
    protected $fillable = [
        'tipo','entidad','asunto','fecha_radicacion','fecha_vencimiento',
        'responsable_id','estado','respuesta','fecha_respuesta','documento','observaciones',
    ];

    protected function casts(): array
    {
        return ['fecha_radicacion' => 'date', 'fecha_vencimiento' => 'date', 'fecha_respuesta' => 'date'];
    }

    const TIPOS = [
        'derecho_peticion'      => 'Derecho de peticion',
        'tutela'                => 'Tutela',
        'solicitud_reunion'     => 'Solicitud de reunion',
        'solicitud_intervencion'=> 'Solicitud de intervencion',
        'queja'                 => 'Queja',
        'denuncia'              => 'Denuncia',
        'otro'                  => 'Otro requerimiento',
    ];

    const ESTADOS = [
        'radicado'   => 'Radicado',
        'en_tramite' => 'En tramite',
        'respondido' => 'Respondido',
        'vencido'    => 'Vencido',
    ];

    public function responsable() { return $this->belongsTo(User::class, 'responsable_id'); }
}
