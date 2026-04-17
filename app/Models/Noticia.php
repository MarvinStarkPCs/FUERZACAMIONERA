<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    protected $fillable = [
        'titulo','contenido','tipo','fecha_inicio','fecha_vencimiento','archivo','activo','creado_por',
    ];

    protected function casts(): array
    {
        return ['fecha_inicio' => 'date', 'fecha_vencimiento' => 'date', 'activo' => 'boolean'];
    }

    public function scopeVigentes($q)
    {
        return $q->where('activo', true)
            ->where('fecha_inicio', '<=', now())
            ->where(fn($q) => $q->whereNull('fecha_vencimiento')->orWhere('fecha_vencimiento', '>=', now()));
    }

    public function creador() { return $this->belongsTo(User::class, 'creado_por'); }
}
