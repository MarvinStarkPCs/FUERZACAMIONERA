<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('afiliados', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // codigo interno del afiliado
            $table->string('nombre');
            $table->string('cedula')->unique();
            $table->string('direccion');
            $table->string('email')->nullable();
            $table->string('telefono');
            $table->string('foto')->nullable();
            $table->string('copia_cedula')->nullable();
            $table->enum('estado', ['afiliado', 'suspendido', 'no_afiliado'])->default('afiliado');
            $table->date('fecha_afiliacion');
            $table->date('fecha_ultimo_pago')->nullable();
            $table->integer('meses_mora')->default(0);
            $table->decimal('deuda_total', 12, 2)->default(0);
            $table->boolean('activo')->default(true);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('afiliados');
    }
};
