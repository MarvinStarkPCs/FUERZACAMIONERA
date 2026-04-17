<?php

namespace App\Http\Controllers;

use App\Models\Afiliado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QrController extends Controller
{
    // Consulta publica por QR — solo muestra nombre, cedula y estado
    public function consulta(Request $request)
    {
        $afiliado = null;

        if ($request->cedula) {
            $afiliado = Afiliado::where('cedula', $request->cedula)
                ->select('id','nombre','cedula','codigo','estado')
                ->first();
        }

        return Inertia::render('Consulta/Publica', [
            'afiliado' => $afiliado,
            'estados'  => Afiliado::ESTADOS,
            'buscado'  => $request->cedula ?? null,
        ]);
    }

    // Acceso privado con cedula + codigo interno
    public function privada(Request $request)
    {
        $afiliado = null;
        $error    = null;

        if ($request->isMethod('post')) {
            $request->validate([
                'cedula' => 'required|string',
                'codigo' => 'required|string',
            ]);

            $afiliado = Afiliado::where('cedula', $request->cedula)
                ->where('codigo', $request->codigo)
                ->with(['vehiculos', 'pagos' => fn($q) => $q->orderByDesc('fecha')])
                ->first();

            if (!$afiliado) {
                $error = 'Cedula o codigo incorrecto.';
            }
        }

        return Inertia::render('Consulta/Privada', [
            'afiliado'  => $afiliado,
            'estados'   => Afiliado::ESTADOS,
            'tiposPago' => \App\Models\Pago::TIPOS,
            'error'     => $error,
        ]);
    }
}
