<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gastos_asociacion', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->string('concepto');
            $table->enum('categoria', [
                'papeleria', 'transporte', 'honorarios', 'viaticos',
                'administracion', 'tecnologia', 'reuniones', 'publicidad', 'otro',
            ]);
            $table->decimal('valor', 12, 2);
            $table->string('medio_pago')->nullable();
            $table->string('cuenta_origen')->nullable();
            $table->foreignId('responsable_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('soporte')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('gastos_asociacion'); }
};
