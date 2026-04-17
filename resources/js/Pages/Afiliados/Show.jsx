import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v ?? 0);

const ESTADO_COLORS = {
    afiliado:    'bg-emerald-100 text-emerald-800',
    suspendido:  'bg-amber-100 text-amber-800',
    no_afiliado: 'bg-red-100 text-red-800',
};

const PAGO_ESTADO = {
    pagado:   'bg-emerald-100 text-emerald-700',
    pendiente:'bg-amber-100 text-amber-700',
    anulado:  'bg-red-100 text-red-700',
};

function Campo({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-semibold text-navy-800 mt-0.5">{value || '—'}</p>
        </div>
    );
}

export default function Show({ afiliado, estados, tiposPago }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <div>
                    <span className="text-xs font-mono text-gray-400">{afiliado.codigo}</span>
                    <h2 className="text-xl font-bold text-navy-800">{afiliado.nombre}</h2>
                </div>
                <div className="flex gap-2">
                    {can('pagos.crear') && (
                        <Link href={`${route('pagos.create')}?afiliado_id=${afiliado.id}`}
                            className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition">
                            + Registrar pago
                        </Link>
                    )}
                    {can('afiliados.editar') && (
                        <Link href={route('afiliados.edit', afiliado.id)}
                            className="px-4 py-2 bg-navy-800 text-white text-sm font-semibold rounded-lg hover:bg-navy-700 transition">
                            Editar
                        </Link>
                    )}
                    <Link href={route('afiliados.index')}
                        className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                        Volver
                    </Link>
                </div>
            </div>
        }>
            <Head title={afiliado.nombre} />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">{flash.success}</div>
                )}

                {/* Estado y deuda */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-navy-900 text-white rounded-xl p-4">
                        <p className="text-xs text-navy-300 uppercase tracking-wider mb-1">Estado</p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${ESTADO_COLORS[afiliado.estado]}`}>
                            {estados[afiliado.estado]}
                        </span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Afiliado desde</p>
                        <p className="text-sm font-semibold text-navy-800 mt-0.5">{afiliado.fecha_afiliacion || '—'}</p>
                    </div>
                    <div className={`rounded-xl p-4 ${afiliado.meses_mora > 0 ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Mora</p>
                        <p className={`text-sm font-bold mt-0.5 ${afiliado.meses_mora > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                            {afiliado.meses_mora > 0 ? `${afiliado.meses_mora} mes(es)` : 'Al dia'}
                        </p>
                    </div>
                    <div className={`rounded-xl p-4 ${afiliado.deuda_total > 0 ? 'bg-orange-50 border border-orange-100' : 'bg-white border border-gray-100'}`}>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Deuda total</p>
                        <p className={`text-sm font-bold mt-0.5 ${afiliado.deuda_total > 0 ? 'text-brand-700' : 'text-gray-500'}`}>
                            {COP(afiliado.deuda_total)}
                        </p>
                    </div>
                </div>

                {/* Datos personales */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                        <span className="h-0.5 w-4 bg-brand-500 rounded" />
                        Datos personales
                    </h3>
                    <div className="flex items-start gap-6">
                        {afiliado.foto && (
                            <img src={`/storage/${afiliado.foto}`} alt="Foto"
                                className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100 shadow-sm" />
                        )}
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-5">
                            <Campo label="Cedula"    value={afiliado.cedula} />
                            <Campo label="Telefono"  value={afiliado.telefono} />
                            <Campo label="Correo"    value={afiliado.email} />
                            <Campo label="Direccion" value={afiliado.direccion} />
                            <Campo label="Ultimo pago" value={afiliado.fecha_ultimo_pago} />
                            <Campo label="Observaciones" value={afiliado.observaciones} />
                        </div>
                    </div>
                </div>

                {/* Vehiculos */}
                {afiliado.vehiculos?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-brand-500 rounded" />
                            Vehiculos ({afiliado.vehiculos.length})
                        </h3>
                        <div className="space-y-2">
                            {afiliado.vehiculos.map(v => (
                                <div key={v.id} className="flex flex-wrap gap-6 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <span className="font-mono font-bold text-navy-800 text-base">{v.placa}</span>
                                    <span className="text-gray-700">{v.marca} {v.modelo} {v.anio}</span>
                                    <span className="text-gray-400">{v.color}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Historial de pagos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                        <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-brand-500 rounded" />
                            Historial de pagos ({afiliado.pagos?.length ?? 0})
                        </h3>
                        {can('pagos.crear') && (
                            <Link href={`${route('pagos.create')}?afiliado_id=${afiliado.id}`}
                                className="text-xs text-brand-600 hover:underline font-medium">
                                + Registrar pago
                            </Link>
                        )}
                    </div>
                    {(!afiliado.pagos || afiliado.pagos.length === 0) ? (
                        <p className="text-sm text-gray-400 text-center py-4">Sin pagos registrados.</p>
                    ) : (
                        <div className="space-y-2">
                            {afiliado.pagos.map(p => (
                                <div key={p.id} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <div>
                                        <span className="font-semibold text-navy-800">{tiposPago[p.tipo] ?? p.tipo}</span>
                                        {p.periodo && <span className="ml-2 text-gray-400 text-xs">({p.periodo})</span>}
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="text-gray-400 text-xs">{p.fecha}</span>
                                        <span className="font-bold text-navy-800">{COP(p.valor)}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PAGO_ESTADO[p.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {p.estado}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
