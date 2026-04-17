<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('actuaciones_caso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caso_juridico_id')->constrained('casos_juridicos')->cascadeOnDelete();
            $table->date('fecha');
            $table->string('tipo');
            $table->text('descripcion');
            $table->foreignId('responsable_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('fecha_limite')->nullable();
            $table->boolean('alerta_activa')->default(false);
            $table->enum('estado', ['pendiente', 'completada', 'vencida'])->default('pendiente');
            $table->string('documento')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('actuaciones_caso'); }
};
