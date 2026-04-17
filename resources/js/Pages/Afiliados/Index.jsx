import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ESTADO_COLORS = {
    afiliado:    'bg-emerald-100 text-emerald-800',
    suspendido:  'bg-amber-100 text-amber-800',
    no_afiliado: 'bg-red-100 text-red-800',
};

export default function Index({ afiliados, estados, filters, resumen }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);
    const [search, setSearch] = useState(filters.search ?? '');
    const [estado, setEstado] = useState(filters.estado ?? '');

    function filtrar(e) {
        e.preventDefault();
        router.get(route('afiliados.index'), { search, estado }, { preserveState: true, replace: true });
    }

    function eliminar(id) {
        if (!confirm('¿Eliminar este afiliado?')) return;
        router.delete(route('afiliados.destroy', id));
    }

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-navy-800">Afiliados</h2>
                {can('afiliados.crear') && (
                    <Link href={route('afiliados.create')}
                        className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition">
                        + Nuevo afiliado
                    </Link>
                )}
            </div>
        }>
            <Head title="Afiliados" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">{flash.success}</div>
                )}

                {/* Resumen */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-navy-900 text-white rounded-xl p-4">
                        <p className="text-2xl font-extrabold">{resumen.total}</p>
                        <p className="text-xs text-navy-300 mt-0.5 uppercase tracking-wider">Total</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-2xl font-extrabold text-emerald-700">{resumen.afiliados}</p>
                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">Afiliados</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-2xl font-extrabold text-amber-700">{resumen.suspendidos}</p>
                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">Suspendidos</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <p className="text-2xl font-extrabold text-red-700">{resumen.no_afiliados}</p>
                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">No afiliados</p>
                    </div>
                </div>

                {/* Filtros */}
                <form onSubmit={filtrar} className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Nombre, cedula o codigo..."
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                        <select value={estado} onChange={e => setEstado(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none">
                            <option value="">Todos</option>
                            {Object.entries(estados).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <button type="submit"
                        className="px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg hover:bg-navy-700 transition">
                        Filtrar
                    </button>
                    {(search || estado) && (
                        <button type="button"
                            onClick={() => { setSearch(''); setEstado(''); router.get(route('afiliados.index')); }}
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
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Codigo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Cedula</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Telefono</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mora</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Vehiculos</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {afiliados.data.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Sin resultados.</td></tr>
                            )}
                            {afiliados.data.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.codigo}</td>
                                    <td className="px-4 py-3 font-semibold text-navy-800">{a.nombre}</td>
                                    <td className="px-4 py-3 text-gray-600">{a.cedula}</td>
                                    <td className="px-4 py-3 text-gray-600">{a.telefono}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[a.estado]}`}>
                                            {estados[a.estado]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {a.meses_mora > 0
                                            ? <span className="text-red-600 font-semibold">{a.meses_mora} mes(es)</span>
                                            : <span className="text-emerald-600 font-medium">Al dia</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-center">{a.vehiculos?.length ?? 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={route('afiliados.show', a.id)}
                                                className="text-xs text-navy-600 hover:text-brand-600 font-medium hover:underline">Ver</Link>
                                            {can('afiliados.editar') && (
                                                <Link href={route('afiliados.edit', a.id)}
                                                    className="text-xs text-amber-600 hover:underline font-medium">Editar</Link>
                                            )}
                                            {can('afiliados.eliminar') && (
                                                <button onClick={() => eliminar(a.id)}
                                                    className="text-xs text-red-500 hover:text-red-700 hover:underline">Eliminar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginacion */}
                {afiliados.last_page > 1 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                        {afiliados.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                                    link.active ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
