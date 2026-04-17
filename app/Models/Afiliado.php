<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Afiliado extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'nombre',
        'cedula',
        'direccion',
        'email',
        'telefono',
        'foto',
        'copia_cedula',
        'estado',
        'fecha_afiliacion',
        'fecha_ultimo_pago',
        'meses_mora',
        'deuda_total',
        'activo',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha_afiliacion'   => 'date',
            'fecha_ultimo_pago'  => 'date',
            'deuda_total'        => 'decimal:2',
            'activo'             => 'boolean',
        ];
    }

    const ESTADOS = [
        'afiliado'     => 'Afiliado',
        'suspendido'   => 'Suspendido temporal',
        'no_afiliado'  => 'No afiliado',
    ];

    const MENSUALIDAD = 30000;
    const AFILIACION  = 100000;

    public function vehiculos()
    {
        return $this->hasMany(Vehiculo::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    // Recalcula mora y estado segun los pagos registrados
    public function actualizarEstado(): void
    {
        $meses = $this->meses_mora;

        if ($meses === 0) {
            $this->estado = 'afiliado';
        } elseif ($meses <= 2) {
            $this->estado = 'suspendido';
        } else {
            $this->estado = 'no_afiliado';
        }

        $this->deuda_total = $meses * self::MENSUALIDAD;
        $this->save();
    }

    // Genera codigo unico: FC-00001
    public static function generarCodigo(): string
    {
        $ultimo = self::max('id') ?? 0;
        return 'FC-' . str_pad($ultimo + 1, 5, '0', STR_PAD_LEFT);
    }
}
