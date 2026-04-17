<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reuniones_caso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caso_juridico_id')->constrained('casos_juridicos')->cascadeOnDelete();
            $table->string('tipo');
            $table->date('fecha');
            $table->time('hora')->nullable();
            $table->string('lugar')->nullable();
            $table->enum('modalidad', ['presencial', 'virtual'])->default('presencial');
            $table->text('personas_convocadas')->nullable();
            $table->text('observaciones')->nullable();
            $table->text('resultado')->nullable();
            $table->string('proxima_accion')->nullable();
            $table->date('fecha_alerta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('reuniones_caso'); }
};
