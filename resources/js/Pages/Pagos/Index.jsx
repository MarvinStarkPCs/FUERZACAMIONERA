import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v ?? 0);

const ESTADO_COLOR = {
    pagado:   'bg-emerald-100 text-emerald-800',
    pendiente:'bg-yellow-100 text-yellow-800',
    anulado:  'bg-red-100 text-red-800',
};

export default function Index({ pagos, tipos, filters }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);

    const [tipo, setTipo] = useState(filters.tipo ?? '');

    function filtrar(e) {
        e.preventDefault();
        router.get(route('pagos.index'), { tipo }, { preserveState: true, replace: true });
    }

    function eliminar(id) {
        if (confirm('¿Eliminar este pago?')) router.delete(route('pagos.destroy', id));
    }

    // Calcular totales de la pagina actual
    const totalPagina = pagos.data
        .filter(p => p.estado === 'pagado')
        .reduce((s, p) => s + Number(p.valor), 0);

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-navy-800">Historial de Pagos</h2>
                {can('pagos.crear') && (
                    <Link href={route('pagos.create')}
                        className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition">
                        + Registrar pago
                    </Link>
                )}
            </div>
        }>
            <Head title="Pagos" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">{flash.success}</div>
                )}

                {/* Resumen pagina actual */}
                <div className="bg-navy-900 text-white rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-navy-300 uppercase tracking-wider">Total pagado (pagina actual)</p>
                        <p className="text-3xl font-extrabold mt-1">{COP(totalPagina)}</p>
                    </div>
                    <div className="text-brand-400 text-right">
                        <p className="text-sm text-navy-300">{pagos.total} registros totales</p>
                        <p className="text-xs text-navy-400 mt-1">Pagina {pagos.current_page} de {pagos.last_page}</p>
                    </div>
                </div>

                {/* Filtros */}
                <form onSubmit={filtrar} className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de pago</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option value="">Todos los tipos</option>
                            {Object.entries(tipos).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <button type="submit"
                        className="px-4 py-2 bg-navy-800 text-white text-sm rounded-lg hover:bg-navy-700 transition">
                        Filtrar
                    </button>
                    {tipo && (
                        <button type="button" onClick={() => { setTipo(''); router.get(route('pagos.index')); }}
                            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                            Limpiar
                        </button>
                    )}
                </form>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead className="bg-navy-900 text-navy-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Afiliado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Periodo</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Valor</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Cuenta</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pagos.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                                        Sin pagos registrados.
                                    </td>
                                </tr>
                            )}
                            {pagos.data.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-600">{p.fecha}</td>
                                    <td className="px-4 py-3">
                                        {p.afiliado ? (
                                            <Link href={route('afiliados.show', p.afiliado_id)}
                                                className="font-medium text-navy-800 hover:text-brand-600">
                                                {p.afiliado.nombre}
                                            </Link>
                                        ) : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{tipos[p.tipo] ?? p.tipo}</td>
                                    <td className="px-4 py-3 text-gray-500">{p.periodo || '—'}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-navy-800">{COP(p.valor)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLOR[p.estado]}`}>
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{p.cuenta_destino || '—'}</td>
                                    <td className="px-4 py-3 text-right">
                                        {can('pagos.eliminar') && (
                                            <button onClick={() => eliminar(p.id)}
                                                className="text-xs text-red-500 hover:text-red-700 hover:underline">
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginacion */}
                {pagos.last_page > 1 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                        {pagos.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                                    link.active
                                        ? 'bg-navy-800 text-white border-navy-800'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
