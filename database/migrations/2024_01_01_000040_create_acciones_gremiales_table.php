<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('acciones_gremiales', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', [
                'derecho_peticion', 'tutela', 'solicitud_reunion',
                'solicitud_intervencion', 'queja', 'denuncia', 'otro',
            ]);
            $table->string('entidad');
            $table->string('asunto');
            $table->date('fecha_radicacion');
            $table->date('fecha_vencimiento')->nullable();
            $table->foreignId('responsable_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('estado', ['radicado', 'en_tramite', 'respondido', 'vencido'])->default('radicado');
            $table->text('respuesta')->nullable();
            $table->date('fecha_respuesta')->nullable();
            $table->string('documento')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('acciones_gremiales'); }
};
