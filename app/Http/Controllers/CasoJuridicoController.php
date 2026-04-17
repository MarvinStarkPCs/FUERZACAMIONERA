<?php

namespace App\Http\Controllers;

use App\Models\Afiliado;
use App\Models\CasoJuridico;
use App\Models\ContactoSolicitante;
use App\Models\EmpresaTransporte;
use App\Models\GeneradorCarga;
use App\Models\Propietario;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CasoJuridicoController extends Controller
{
    private function catalogos(): array
    {
        return [
            'afiliados'   => Afiliado::orderBy('nombre')->get(['id','nombre','cedula','codigo']),
            'propietarios'=> Propietario::orderBy('nombre')->get(['id','nombre','cedula']),
            'contactos'   => ContactoSolicitante::orderBy('nombre')->get(['id','nombre','cedula']),
            'empresas'    => EmpresaTransporte::orderBy('razon_social')->get(['id','razon_social','nit']),
            'generadores' => GeneradorCarga::orderBy('razon_social')->get(['id','razon_social','nit']),
            'juridicos'   => User::where('role','juridico')->orderBy('name')->get(['id','name']),
            'tipos'       => CasoJuridico::TIPOS,
            'estados'     => CasoJuridico::ESTADOS,
        ];
    }

    public function index(Request $request)
    {
        $casos = CasoJuridico::with(['afiliado','responsableJuridico'])
            ->when($request->tipo, fn($q) => $q->where('tipo_proceso', $request->tipo))
            ->when($request->estado, fn($q) => $q->where('estado', $request->estado))
            ->when($request->search, fn($q) => $q->where('numero_caso', 'like', "%{$request->search}%"))
            ->orderByDesc('fecha_apertura')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Juridico/Index', [
            'casos'   => $casos,
            'tipos'   => CasoJuridico::TIPOS,
            'estados' => CasoJuridico::ESTADOS,
            'filters' => $request->only(['search','tipo','estado']),
            'resumen' => [
                'total'    => CasoJuridico::count(),
                'abiertos' => CasoJuridico::whereIn('estado',['abierto','en_proceso','conciliacion'])->count(),
                'exitosos' => CasoJuridico::where('estado','cerrado_exitoso')->count(),
                'valor_recuperado' => CasoJuridico::sum('valor_recuperado'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Juridico/Create', $this->catalogos());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'fecha_apertura'         => 'required|date',
            'tipo_proceso'           => 'required|in:' . implode(',', array_keys(CasoJuridico::TIPOS)),
            'afiliado_id'            => 'nullable|exists:afiliados,id',
            'propietario_id'         => 'nullable|exists:propietarios,id',
            'contacto_id'            => 'nullable|exists:contactos_solicitantes,id',
            'empresa_transporte_id'  => 'nullable|exists:empresas_transporte,id',
            'generador_carga_id'     => 'nullable|exists:generadores_carga,id',
            'responsable_juridico_id'=> 'nullable|exists:users,id',
            'valor_reclamado'        => 'required|numeric|min:0',
            'valor_apertura'         => 'nullable|numeric|min:0',
            'observaciones'          => 'nullable|string',
        ]);

        $data['numero_caso'] = CasoJuridico::generarNumero();
        $data['estado'] = 'abierto';

        $caso = CasoJuridico::create($data);

        return redirect()->route('juridico.show', $caso)->with('success', 'Caso juridico creado: ' . $caso->numero_caso);
    }

    public function show(CasoJuridico $juridico)
    {
        $juridico->load([
            'afiliado','propietario','contacto','empresaTransporte',
            'generadorCarga','responsableJuridico','actuaciones.responsable','reuniones',
        ]);

        return Inertia::render('Juridico/Show', [
            'caso'    => $juridico,
            'tipos'   => CasoJuridico::TIPOS,
            'estados' => CasoJuridico::ESTADOS,
            'tiposActuacion' => ActuacionCasoController::TIPOS_LABEL,
        ]);
    }

    public function edit(CasoJuridico $juridico)
    {
        return Inertia::render('Juridico/Edit', array_merge(
            ['caso' => $juridico],
            $this->catalogos()
        ));
    }

    public function update(Request $request, CasoJuridico $juridico)
    {
        $data = $request->validate([
            'estado'                 => 'required|in:' . implode(',', array_keys(CasoJuridico::ESTADOS)),
            'tipo_proceso'           => 'required|in:' . implode(',', array_keys(CasoJuridico::TIPOS)),
            'afiliado_id'            => 'nullable|exists:afiliados,id',
            'propietario_id'         => 'nullable|exists:propietarios,id',
            'contacto_id'            => 'nullable|exists:contactos_solicitantes,id',
            'empresa_transporte_id'  => 'nullable|exists:empresas_transporte,id',
            'generador_carga_id'     => 'nullable|exists:generadores_carga,id',
            'responsable_juridico_id'=> 'nullable|exists:users,id',
            'valor_reclamado'        => 'required|numeric|min:0',
            'valor_recuperado'       => 'nullable|numeric|min:0',
            'valor_no_recuperado'    => 'nullable|numeric|min:0',
            'valor_anticipo'         => 'nullable|numeric|min:0',
            'fecha_anticipo'         => 'nullable|date',
            'cuenta_anticipo'        => 'nullable|string',
            'valor_saldo'            => 'nullable|numeric|min:0',
            'fecha_saldo'            => 'nullable|date',
            'cuenta_saldo'           => 'nullable|string',
            'porcentaje_aplicado'    => 'nullable|numeric|min:0|max:100',
            'valor_asociacion'       => 'nullable|numeric|min:0',
            'valor_juridicos'        => 'nullable|numeric|min:0',
            'observaciones'          => 'nullable|string',
            'fecha_cierre'           => 'nullable|date',
        ]);

        $juridico->update($data);

        return redirect()->route('juridico.show', $juridico)->with('success', 'Caso actualizado.');
    }

    public function destroy(CasoJuridico $juridico)
    {
        $juridico->delete();
        return redirect()->route('juridico.index')->with('success', 'Caso eliminado.');
    }
}
