<?php

namespace App\Http\Controllers;

use App\Models\AccionGremial;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccionGremialController extends Controller
{
    public function index(Request $request)
    {
        $acciones = AccionGremial::with('responsable')
            ->when($request->tipo, fn($q) => $q->where('tipo', $request->tipo))
            ->when($request->estado, fn($q) => $q->where('estado', $request->estado))
            ->orderByDesc('fecha_radicacion')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Gremial/Index', [
            'acciones' => $acciones,
            'tipos'    => AccionGremial::TIPOS,
            'estados'  => AccionGremial::ESTADOS,
            'filters'  => $request->only(['tipo','estado']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Gremial/Create', [
            'tipos'      => AccionGremial::TIPOS,
            'estados'    => AccionGremial::ESTADOS,
            'responsables' => User::whereIn('role',['administrador','coordinador','juridico'])->get(['id','name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo'              => 'required|in:' . implode(',', array_keys(AccionGremial::TIPOS)),
            'entidad'           => 'required|string',
            'asunto'            => 'required|string',
            'fecha_radicacion'  => 'required|date',
            'fecha_vencimiento' => 'nullable|date',
            'responsable_id'    => 'nullable|exists:users,id',
            'observaciones'     => 'nullable|string',
            'documento'         => 'nullable|file|max:5120',
        ]);

        if ($request->hasFile('documento')) {
            $data['documento'] = $request->file('documento')->store('gremial', 'public');
        }

        AccionGremial::create($data);
        return redirect()->route('gremial.index')->with('success', 'Accion gremial registrada.');
    }

    public function edit(AccionGremial $gremial)
    {
        return Inertia::render('Gremial/Edit', [
            'accion'       => $gremial,
            'tipos'        => AccionGremial::TIPOS,
            'estados'      => AccionGremial::ESTADOS,
            'responsables' => User::whereIn('role',['administrador','coordinador','juridico'])->get(['id','name']),
        ]);
    }

    public function update(Request $request, AccionGremial $gremial)
    {
        $data = $request->validate([
            'tipo'              => 'required|in:' . implode(',', array_keys(AccionGremial::TIPOS)),
            'entidad'           => 'required|string',
            'asunto'            => 'required|string',
            'fecha_radicacion'  => 'required|date',
            'fecha_vencimiento' => 'nullable|date',
            'responsable_id'    => 'nullable|exists:users,id',
            'estado'            => 'required|in:' . implode(',', array_keys(AccionGremial::ESTADOS)),
            'respuesta'         => 'nullable|string',
            'fecha_respuesta'   => 'nullable|date',
            'observaciones'     => 'nullable|string',
        ]);

        $gremial->update($data);
        return redirect()->route('gremial.index')->with('success', 'Accion gremial actualizada.');
    }

    public function destroy(AccionGremial $gremial)
    {
        $gremial->delete();
        return redirect()->route('gremial.index')->with('success', 'Accion eliminada.');
    }
}
