<?php

namespace App\Http\Controllers;

use App\Models\Afiliado;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AfiliadoController extends Controller
{
    public function index(Request $request)
    {
        $afiliados = Afiliado::query()
            ->when($request->search, fn($q) => $q
                ->where('nombre', 'like', "%{$request->search}%")
                ->orWhere('cedula', 'like', "%{$request->search}%")
                ->orWhere('codigo', 'like', "%{$request->search}%"))
            ->when($request->estado, fn($q) => $q->where('estado', $request->estado))
            ->with('vehiculos')
            ->orderBy('nombre')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Afiliados/Index', [
            'afiliados' => $afiliados,
            'estados'   => Afiliado::ESTADOS,
            'filters'   => $request->only(['search', 'estado']),
            'resumen'   => [
                'total'       => Afiliado::count(),
                'afiliados'   => Afiliado::where('estado', 'afiliado')->count(),
                'suspendidos' => Afiliado::where('estado', 'suspendido')->count(),
                'no_afiliados'=> Afiliado::where('estado', 'no_afiliado')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Afiliados/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'          => 'required|string|max:255',
            'cedula'          => 'required|string|unique:afiliados,cedula',
            'direccion'       => 'required|string',
            'email'           => 'nullable|email',
            'telefono'        => 'required|string',
            'fecha_afiliacion'=> 'required|date',
            'observaciones'   => 'nullable|string',
            'foto'            => 'nullable|file|image|max:2048',
            'copia_cedula'    => 'nullable|file|max:4096',
            // vehiculo (opcional)
            'placa'           => 'nullable|string|unique:vehiculos,placa',
            'tarjeta_propiedad' => 'nullable|string',
            'marca'           => 'nullable|string',
            'modelo'          => 'nullable|string',
            'anio'            => 'nullable|integer|min:1980|max:2100',
            'color'           => 'nullable|string',
        ]);

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('afiliados/fotos', 'public');
        }
        if ($request->hasFile('copia_cedula')) {
            $data['copia_cedula'] = $request->file('copia_cedula')->store('afiliados/cedulas', 'public');
        }

        $data['codigo'] = Afiliado::generarCodigo();
        $data['estado'] = 'afiliado';

        $afiliado = Afiliado::create($data);

        // Registrar vehiculo si vino placa
        if (!empty($data['placa'])) {
            $afiliado->vehiculos()->create([
                'placa'             => $data['placa'],
                'tarjeta_propiedad' => $data['tarjeta_propiedad'] ?? null,
                'marca'             => $data['marca'] ?? null,
                'modelo'            => $data['modelo'] ?? null,
                'anio'              => $data['anio'] ?? null,
                'color'             => $data['color'] ?? null,
            ]);
        }

        // Registrar pago de afiliacion automaticamente
        $afiliado->pagos()->create([
            'tipo'          => 'afiliacion',
            'valor'         => Afiliado::AFILIACION,
            'fecha'         => $data['fecha_afiliacion'],
            'estado'        => 'pagado',
            'registrado_por'=> auth()->id(),
        ]);

        return redirect()->route('afiliados.index')->with('success', 'Afiliado registrado correctamente.');
    }

    public function show(Afiliado $afiliado)
    {
        $afiliado->load(['vehiculos', 'pagos' => fn($q) => $q->orderByDesc('fecha')]);

        return Inertia::render('Afiliados/Show', [
            'afiliado' => $afiliado,
            'estados'  => Afiliado::ESTADOS,
            'tiposPago'=> \App\Models\Pago::TIPOS,
        ]);
    }

    public function edit(Afiliado $afiliado)
    {
        $afiliado->load('vehiculos');

        return Inertia::render('Afiliados/Edit', [
            'afiliado' => $afiliado,
        ]);
    }

    public function update(Request $request, Afiliado $afiliado)
    {
        $data = $request->validate([
            'nombre'          => 'required|string|max:255',
            'cedula'          => "required|string|unique:afiliados,cedula,{$afiliado->id}",
            'direccion'       => 'required|string',
            'email'           => 'nullable|email',
            'telefono'        => 'required|string',
            'meses_mora'      => 'required|integer|min:0',
            'observaciones'   => 'nullable|string',
            'foto'            => 'nullable|file|image|max:2048',
            'copia_cedula'    => 'nullable|file|max:4096',
        ]);

        if ($request->hasFile('foto')) {
            if ($afiliado->foto) Storage::disk('public')->delete($afiliado->foto);
            $data['foto'] = $request->file('foto')->store('afiliados/fotos', 'public');
        }
        if ($request->hasFile('copia_cedula')) {
            if ($afiliado->copia_cedula) Storage::disk('public')->delete($afiliado->copia_cedula);
            $data['copia_cedula'] = $request->file('copia_cedula')->store('afiliados/cedulas', 'public');
        }

        $afiliado->update($data);
        $afiliado->actualizarEstado();

        return redirect()->route('afiliados.show', $afiliado)->with('success', 'Afiliado actualizado correctamente.');
    }

    public function destroy(Afiliado $afiliado)
    {
        $afiliado->delete();
        return redirect()->route('afiliados.index')->with('success', 'Afiliado eliminado.');
    }
}
