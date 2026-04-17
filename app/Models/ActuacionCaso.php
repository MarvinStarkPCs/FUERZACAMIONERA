<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActuacionCaso extends Model
{
    protected $table = 'actuaciones_caso';
    protected $fillable = [
        'caso_juridico_id','fecha','tipo','descripcion',
        'responsable_id','fecha_limite','alerta_activa','estado','documento','observaciones',
    ];

    protected function casts(): array
    {
        return ['fecha' => 'date', 'fecha_limite' => 'date', 'alerta_activa' => 'boolean'];
    }

    const TIPOS = [
        'poder_general','poder_superintendencia','poder_tutela',
        'contrato_servicios','cuenta_cobro','denuncia_supertransporte',
        'denuncia_superintendencia','derecho_peticion','verificacion_vencimiento',
        'tutela','solicitud_audiencia','audiencia_conciliacion','demanda','otro',
    ];

    public function caso()        { return $this->belongsTo(CasoJuridico::class, 'caso_juridico_id'); }
    public function responsable() { return $this->belongsTo(User::class, 'responsable_id'); }
}
