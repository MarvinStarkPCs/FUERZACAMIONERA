<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CasoJuridico extends Model
{
    protected $table = 'casos_juridicos';

    protected $fillable = [
        'numero_caso','fecha_apertura','tipo_proceso','estado',
        'afiliado_id','propietario_id','contacto_id',
        'empresa_transporte_id','generador_carga_id','responsable_juridico_id',
        'valor_reclamado','valor_recuperado','valor_no_recuperado',
        'valor_apertura','valor_anticipo','fecha_anticipo','cuenta_anticipo',
        'valor_saldo','fecha_saldo','cuenta_saldo',
        'porcentaje_aplicado','valor_asociacion','valor_juridicos',
        'observaciones','fecha_cierre',
    ];

    protected function casts(): array
    {
        return [
            'fecha_apertura'  => 'date',
            'fecha_anticipo'  => 'date',
            'fecha_saldo'     => 'date',
            'fecha_cierre'    => 'date',
        ];
    }

    const TIPOS = [
        'cobro_manifiesto'       => 'Cobro de saldos de manifiesto',
        'cobro_stand_by'         => 'Cobro de stand by',
        'cobro_saldo_stand_by'   => 'Cobro de saldo y stand by',
        'homonimos'              => 'Homonimos',
        'supresion_antecedentes' => 'Supresion de antecedentes',
        'tramites_transito'      => 'Tramites de transito',
        'otro'                   => 'Otro proceso juridico',
    ];

    const ESTADOS = [
        'abierto'               => 'Abierto',
        'en_proceso'            => 'En proceso',
        'conciliacion'          => 'En conciliacion',
        'cerrado_exitoso'       => 'Cerrado exitoso',
        'cerrado_sin_recuperar' => 'Cerrado sin recuperar',
        'cerrado_parcial'       => 'Cerrado parcial',
    ];

    public function afiliado()       { return $this->belongsTo(Afiliado::class); }
    public function propietario()    { return $this->belongsTo(Propietario::class); }
    public function contacto()       { return $this->belongsTo(ContactoSolicitante::class, 'contacto_id'); }
    public function empresaTransporte() { return $this->belongsTo(EmpresaTransporte::class, 'empresa_transporte_id'); }
    public function generadorCarga() { return $this->belongsTo(GeneradorCarga::class, 'generador_carga_id'); }
    public function responsableJuridico() { return $this->belongsTo(User::class, 'responsable_juridico_id'); }
    public function actuaciones()    { return $this->hasMany(ActuacionCaso::class, 'caso_juridico_id')->orderByDesc('fecha'); }
    public function reuniones()      { return $this->hasMany(ReunionCaso::class, 'caso_juridico_id')->orderByDesc('fecha'); }

    public static function generarNumero(): string
    {
        $anio  = date('Y');
        $total = self::whereYear('created_at', $anio)->count();
        return 'CJ-' . $anio . '-' . str_pad($total + 1, 4, '0', STR_PAD_LEFT);
    }
}
