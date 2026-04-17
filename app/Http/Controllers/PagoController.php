<?php

namespace App\Http\Controllers;

use App\Models\Afiliado;
use App\Models\Pago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PagoController extends Controller
{
    public function index(Request $request)
    {
        $pagos = Pago::with('afiliado')
            ->when($request->afiliado_id, fn($q) => $q->where('afiliado_id', $request->afiliado_id))
            ->when($request->tipo, fn($q) => $q->where('tipo', $request->tipo))
            ->orderByDesc('fecha')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Pagos/Index', [
            'pagos'   => $pagos,
            'tipos'   => Pago::TIPOS,
            'filters' => $request->only(['afiliado_id', 'tipo']),
        ]);
    }

    public function create(Request $request)
    {
        $afiliado = $request->afiliado_id ? Afiliado::find($request->afiliado_id) : null;

        return Inertia::render('Pagos/Create', [
            'afiliados' => Afiliado::orderBy('nombre')->get(['id','nombre','cedula','codigo']),
            'tipos'     => Pago::TIPOS,
            'afiliado'  => $afiliado,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'afiliado_id'    => 'required|exists:afiliados,id',
            'tipo'           => 'required|in:' . implode(',', array_keys(Pago::TIPOS)),
            'valor'          => 'required|numeric|min:1',
            'fecha'          => 'required|date',
            'periodo'        => 'nullable|string',
            'estado'         => 'required|in:pagado,pendiente,anulado',
            'cuenta_destino' => 'nullable|string',
            'observaciones'  => 'nullable|string',
            'soporte'        => 'nullable|file|max:4096',
        ]);

        if ($request->hasFile('soporte')) {
            $data['soporte'] = $request->file('soporte')->store('pagos/soportes', 'public');
        }

        $data['registrado_por'] = auth()->id();
        Pago::create($data);

        // Actualizar estado del afiliado si es mensualidad
        $afiliado = Afiliado::find($data['afiliado_id']);
        if ($data['tipo'] === 'mensualidad' && $data['estado'] === 'pagado') {
            $afiliado->fecha_ultimo_pago = $data['fecha'];
            $afiliado->save();
        }

        return redirect()->route('afiliados.show', $data['afiliado_id'])
            ->with('success', 'Pago registrado correctamente.');
    }

    public function destroy(Pago $pago)
    {
        $afiliado_id = $pago->afiliado_id;
        $pago->delete();
        return redirect()->route('afiliados.show', $afiliado_id)->with('success', 'Pago eliminado.');
    }
}
