import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v ?? 0);

const ESTADO_COLOR = {
    abierto:'bg-blue-100 text-blue-800', en_proceso:'bg-yellow-100 text-yellow-800',
    conciliacion:'bg-purple-100 text-purple-800', cerrado_exitoso:'bg-green-100 text-green-800',
    cerrado_sin_recuperar:'bg-red-100 text-red-800', cerrado_parcial:'bg-orange-100 text-orange-800',
};

const ESTADO_ACTUACION = {
    pendiente:'bg-yellow-100 text-yellow-800',
    completada:'bg-green-100 text-green-800',
    vencida:'bg-red-100 text-red-800',
};

function Campo({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{value || '—'}</p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <span className="h-0.5 w-4 bg-brand-500 rounded inline-block" />
                {title}
            </h3>
            {children}
        </div>
    );
}

export default function Show({ caso, tipos, estados, tiposActuacion }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);
    const [showActuacion, setShowActuacion] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'otro',
        descripcion: '',
        fecha_limite: '',
        estado: 'pendiente',
        observaciones: '',
    });

    function submitActuacion(e) {
        e.preventDefault();
        post(route('actuaciones.store', caso.id), {
            forceFormData: true,
            onSuccess: () => { reset(); setShowActuacion(false); },
        });
    }

    function cambiarEstadoActuacion(actuacion, estado) {
        router.patch(route('actuaciones.update', actuacion.id), { estado }, { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <div>
                    <span className="text-xs text-gray-400 font-mono">{caso.numero_caso}</span>
                    <h2 className="text-xl font-bold text-navy-800">{tipos[caso.tipo_proceso]}</h2>
                </div>
                <div className="flex gap-2">
                    {can('juridico.editar') && (
                        <Link href={route('juridico.edit', caso.id)}
                            className="px-4 py-2 bg-navy-800 text-white text-sm rounded-lg hover:bg-navy-700 transition">
                            Editar caso
                        </Link>
                    )}
                    <Link href={route('juridico.index')}
                        className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                        Volver
                    </Link>
                </div>
            </div>
        }>
            <Head title={`Caso ${caso.numero_caso}`} />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {flash?.success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm">{flash.success}</div>
                )}

                {/* Estado y datos clave */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-navy-900 text-white rounded-xl p-4">
                        <p className="text-xs text-navy-300 uppercase">Estado</p>
                        <span className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${ESTADO_COLOR[caso.estado]}`}>
                            {estados[caso.estado]}
                        </span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase">Reclamado</p>
                        <p className="text-lg font-bold text-navy-800">{COP(caso.valor_reclamado)}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-xs text-gray-400 uppercase">Recuperado</p>
                        <p className="text-lg font-bold text-emerald-700">{COP(caso.valor_recuperado)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase">Apertura</p>
                        <p className="text-sm font-semibold text-navy-800">{caso.fecha_apertura}</p>
                        {caso.fecha_cierre && <p className="text-xs text-gray-400 mt-0.5">Cierre: {caso.fecha_cierre}</p>}
                    </div>
                </div>

                {/* Partes */}
                <Section title="Partes involucradas">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <Campo label="Afiliado" value={caso.afiliado ? `${caso.afiliado.nombre} (${caso.afiliado.codigo})` : null} />
                        <Campo label="Propietario" value={caso.propietario?.nombre} />
                        <Campo label="Contacto solicitante" value={caso.contacto?.nombre} />
                        <Campo label="Empresa de transporte" value={caso.empresa_transporte?.razon_social} />
                        <Campo label="Generador de carga" value={caso.generador_carga?.razon_social} />
                        <Campo label="Responsable juridico" value={caso.responsable_juridico?.name} />
                    </div>
                </Section>

                {/* Financiero */}
                <Section title="Informacion financiera">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                        <Campo label="Anticipo" value={caso.valor_anticipo ? COP(caso.valor_anticipo) : null} />
                        <Campo label="Saldo" value={caso.valor_saldo ? COP(caso.valor_saldo) : null} />
                        <Campo label="% aplicado" value={caso.porcentaje_aplicado ? `${caso.porcentaje_aplicado}%` : null} />
                        <Campo label="Valor asociacion" value={caso.valor_asociacion ? COP(caso.valor_asociacion) : null} />
                        <Campo label="Valor juridicos" value={caso.valor_juridicos ? COP(caso.valor_juridicos) : null} />
                        <Campo label="No recuperado" value={caso.valor_no_recuperado ? COP(caso.valor_no_recuperado) : null} />
                    </div>
                    {caso.observaciones && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-400 uppercase mb-1">Observaciones</p>
                            <p className="text-sm text-gray-700">{caso.observaciones}</p>
                        </div>
                    )}
                </Section>

                {/* Actuaciones */}
                <Section title={`Actuaciones (${caso.actuaciones?.length ?? 0})`}>
                    {can('juridico.crear') && (
                        <div className="mb-4">
                            <button onClick={() => setShowActuacion(!showActuacion)}
                                className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition">
                                {showActuacion ? 'Cancelar' : '+ Registrar actuacion'}
                            </button>
                        </div>
                    )}

                    {showActuacion && (
                        <form onSubmit={submitActuacion} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de actuacion *</label>
                                    <select value={data.tipo} onChange={e => setData('tipo', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                        {Object.entries(tiposActuacion).map(([k,v]) => (
                                            <option key={k} value={k}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Fecha *</label>
                                    <input type="date" value={data.fecha} onChange={e => setData('fecha', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Descripcion *</label>
                                <textarea rows={2} value={data.descripcion} onChange={e => setData('descripcion', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.descripcion && <p className="mt-1 text-xs text-red-600">{errors.descripcion}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Fecha limite</label>
                                    <input type="date" value={data.fecha_limite} onChange={e => setData('fecha_limite', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                                    <select value={data.estado} onChange={e => setData('estado', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                        <option value="pendiente">Pendiente</option>
                                        <option value="completada">Completada</option>
                                        <option value="vencida">Vencida</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" disabled={processing}
                                className="px-4 py-2 bg-navy-800 text-white text-sm rounded-lg hover:bg-navy-700 disabled:opacity-50 transition">
                                {processing ? 'Guardando...' : 'Guardar actuacion'}
                            </button>
                        </form>
                    )}

                    {(!caso.actuaciones || caso.actuaciones.length === 0) ? (
                        <p className="text-sm text-gray-400 text-center py-6">Sin actuaciones registradas.</p>
                    ) : (
                        <div className="space-y-3">
                            {caso.actuaciones.map(a => (
                                <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="mt-0.5">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_ACTUACION[a.estado]}`}>
                                            {a.estado}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-navy-800">{tiposActuacion[a.tipo] ?? a.tipo}</p>
                                        <p className="text-xs text-gray-500">{a.fecha}{a.fecha_limite ? ` · Limite: ${a.fecha_limite}` : ''}</p>
                                        <p className="text-sm text-gray-700 mt-1">{a.descripcion}</p>
                                        {a.responsable && <p className="text-xs text-gray-400 mt-0.5">Responsable: {a.responsable.name}</p>}
                                    </div>
                                    {can('juridico.editar') && a.estado === 'pendiente' && (
                                        <button onClick={() => cambiarEstadoActuacion(a, 'completada')}
                                            className="text-xs text-emerald-600 hover:underline whitespace-nowrap">
                                            Completar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Section>
            </div>
        </AuthenticatedLayout>
    );
}
