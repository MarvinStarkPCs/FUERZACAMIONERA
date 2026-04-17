<?php

namespace App\Http\Controllers;

use App\Models\ActuacionCaso;
use App\Models\CasoJuridico;
use App\Models\User;
use Illuminate\Http\Request;

class ActuacionCasoController extends Controller
{
    const TIPOS_LABEL = [
        'poder_general'             => 'Poder general',
        'poder_superintendencia'    => 'Poder para superintendencia',
        'poder_tutela'              => 'Poder para tutela',
        'contrato_servicios'        => 'Contrato de prestacion de servicios',
        'cuenta_cobro'              => 'Cuenta de cobro',
        'denuncia_supertransporte'  => 'Denuncia ante supertransporte',
        'denuncia_superintendencia' => 'Denuncia ante superintendencia',
        'derecho_peticion'          => 'Derecho de peticion',
        'verificacion_vencimiento'  => 'Verificacion de vencimiento',
        'tutela'                    => 'Tutela',
        'solicitud_audiencia'       => 'Solicitud de audiencia',
        'audiencia_conciliacion'    => 'Audiencia de conciliacion',
        'demanda'                   => 'Demanda',
        'otro'                      => 'Otro',
    ];

    public function store(Request $request, CasoJuridico $juridico)
    {
        $data = $request->validate([
            'fecha'          => 'required|date',
            'tipo'           => 'required|string',
            'descripcion'    => 'required|string',
            'responsable_id' => 'nullable|exists:users,id',
            'fecha_limite'   => 'nullable|date',
            'alerta_activa'  => 'boolean',
            'estado'         => 'required|in:pendiente,completada,vencida',
            'observaciones'  => 'nullable|string',
            'documento'      => 'nullable|file|max:5120',
        ]);

        if ($request->hasFile('documento')) {
            $data['documento'] = $request->file('documento')->store('casos/actuaciones', 'public');
        }

        $data['caso_juridico_id'] = $juridico->id;
        ActuacionCaso::create($data);

        return back()->with('success', 'Actuacion registrada.');
    }

    public function update(Request $request, ActuacionCaso $actuacion)
    {
        $data = $request->validate([
            'estado'       => 'required|in:pendiente,completada,vencida',
            'observaciones'=> 'nullable|string',
        ]);

        $actuacion->update($data);
        return back()->with('success', 'Actuacion actualizada.');
    }
}
