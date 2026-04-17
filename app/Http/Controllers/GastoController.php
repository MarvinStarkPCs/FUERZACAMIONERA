<?php

namespace App\Http\Controllers;

use App\Models\GastoAsociacion;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GastoController extends Controller
{
    public function index(Request $request)
    {
        $gastos = GastoAsociacion::with('responsable')
            ->when($request->categoria, fn($q) => $q->where('categoria', $request->categoria))
            ->when($request->mes, fn($q) => $q->whereRaw("DATE_FORMAT(fecha,'%Y-%m') = ?", [$request->mes]))
            ->orderByDesc('fecha')
            ->paginate(20)
            ->withQueryString();

        $totalMes = GastoAsociacion::when($request->mes,
            fn($q) => $q->whereRaw("DATE_FORMAT(fecha,'%Y-%m') = ?", [$request->mes])
        )->sum('valor');

        return Inertia::render('Gastos/Index', [
            'gastos'     => $gastos,
            'categorias' => GastoAsociacion::CATEGORIAS,
            'filters'    => $request->only(['categoria','mes']),
            'total_mes'  => $totalMes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Gastos/Create', [
            'categorias'   => GastoAsociacion::CATEGORIAS,
            'responsables' => User::where('activo', true)->orderBy('name')->get(['id','name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'fecha'          => 'required|date',
            'concepto'       => 'required|string',
            'categoria'      => 'required|in:' . implode(',', array_keys(GastoAsociacion::CATEGORIAS)),
            'valor'          => 'required|numeric|min:1',
            'medio_pago'     => 'nullable|string',
            'cuenta_origen'  => 'nullable|string',
            'responsable_id' => 'nullable|exists:users,id',
            'observaciones'  => 'nullable|string',
            'soporte'        => 'nullable|file|max:4096',
        ]);

        if ($request->hasFile('soporte')) {
            $data['soporte'] = $request->file('soporte')->store('gastos', 'public');
        }

        GastoAsociacion::create($data);
        return redirect()->route('gastos.index')->with('success', 'Gasto registrado.');
    }

    public function destroy(GastoAsociacion $gasto)
    {
        $gasto->delete();
        return redirect()->route('gastos.index')->with('success', 'Gasto eliminado.');
    }
}
