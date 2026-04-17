<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReunionCaso extends Model
{
    protected $table = 'reuniones_caso';
    protected $fillable = [
        'caso_juridico_id','tipo','fecha','hora','lugar','modalidad',
        'personas_convocadas','observaciones','resultado','proxima_accion','fecha_alerta',
    ];

    protected function casts(): array
    {
        return ['fecha' => 'date', 'fecha_alerta' => 'date'];
    }

    public function caso() { return $this->belongsTo(CasoJuridico::class, 'caso_juridico_id'); }
}
