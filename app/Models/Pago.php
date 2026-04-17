<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $fillable = [
        'afiliado_id',
        'tipo',
        'valor',
        'fecha',
        'periodo',
        'estado',
        'cuenta_destino',
        'soporte',
        'observaciones',
        'registrado_por',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'valor' => 'decimal:2',
        ];
    }

    const TIPOS = [
        'afiliacion'       => 'Afiliacion',
        'mensualidad'      => 'Mensualidad',
        'extraordinario'   => 'Pago extraordinario',
        'ajuste'           => 'Ajuste',
        'anticipo_proceso' => 'Anticipo de proceso',
        'saldo_proceso'    => 'Saldo de proceso',
        'otro'             => 'Otro ingreso',
    ];

    public function afiliado()
    {
        return $this->belongsTo(Afiliado::class);
    }

    public function registrador()
    {
        return $this->belongsTo(User::class, 'registrado_por');
    }
}
