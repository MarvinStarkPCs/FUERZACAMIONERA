<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('afiliado_id')->constrained()->cascadeOnDelete();
            $table->enum('tipo', [
                'afiliacion',
                'mensualidad',
                'extraordinario',
                'ajuste',
                'anticipo_proceso',
                'saldo_proceso',
                'otro',
            ]);
            $table->decimal('valor', 12, 2);
            $table->date('fecha');
            $table->string('periodo')->nullable(); // ej: "2024-03" para mensualidades
            $table->enum('estado', ['pagado', 'pendiente', 'anulado'])->default('pagado');
            $table->string('cuenta_destino')->nullable();
            $table->string('soporte')->nullable(); // archivo adjunto
            $table->text('observaciones')->nullable();
            $table->foreignId('registrado_por')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
