<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('casos_juridicos', function (Blueprint $table) {
            $table->id();
            $table->string('numero_caso')->unique();
            $table->date('fecha_apertura');
            $table->enum('tipo_proceso', [
                'cobro_manifiesto',
                'cobro_stand_by',
                'cobro_saldo_stand_by',
                'homonimos',
                'supresion_antecedentes',
                'tramites_transito',
                'otro',
            ]);
            $table->enum('estado', [
                'abierto', 'en_proceso', 'conciliacion',
                'cerrado_exitoso', 'cerrado_sin_recuperar', 'cerrado_parcial',
            ])->default('abierto');
            // Partes involucradas
            $table->foreignId('afiliado_id')->nullable()->constrained('afiliados')->nullOnDelete();
            $table->foreignId('propietario_id')->nullable()->constrained('propietarios')->nullOnDelete();
            $table->foreignId('contacto_id')->nullable()->constrained('contactos_solicitantes')->nullOnDelete();
            $table->foreignId('empresa_transporte_id')->nullable()->constrained('empresas_transporte')->nullOnDelete();
            $table->foreignId('generador_carga_id')->nullable()->constrained('generadores_carga')->nullOnDelete();
            $table->foreignId('responsable_juridico_id')->nullable()->constrained('users')->nullOnDelete();
            // Valores
            $table->decimal('valor_reclamado', 14, 2)->default(0);
            $table->decimal('valor_recuperado', 14, 2)->default(0);
            $table->decimal('valor_no_recuperado', 14, 2)->default(0);
            // Financiero
            $table->decimal('valor_apertura', 14, 2)->default(0);
            $table->decimal('valor_anticipo', 14, 2)->default(0);
            $table->date('fecha_anticipo')->nullable();
            $table->string('cuenta_anticipo')->nullable();
            $table->decimal('valor_saldo', 14, 2)->default(0);
            $table->date('fecha_saldo')->nullable();
            $table->string('cuenta_saldo')->nullable();
            $table->decimal('porcentaje_aplicado', 5, 2)->default(0);
            $table->decimal('valor_asociacion', 14, 2)->default(0);
            $table->decimal('valor_juridicos', 14, 2)->default(0);
            $table->text('observaciones')->nullable();
            $table->date('fecha_cierre')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('casos_juridicos'); }
};
