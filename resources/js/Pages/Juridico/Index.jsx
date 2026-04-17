import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v);

const ESTADO_COLOR = {
    abierto:'bg-blue-100 text-blue-800', en_proceso:'bg-yellow-100 text-yellow-800',
    conciliacion:'bg-purple-100 text-purple-800', cerrado_exitoso:'bg-green-100 text-green-800',
    cerrado_sin_recuperar:'bg-red-100 text-red-800', cerrado_parcial:'bg-orange-100 text-orange-800',
};

export default function Index({ casos, tipos, estados, filters, resumen }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [tipo,   setTipo]   = useState(filters.tipo ?? '');
    const [estado, setEstado] = useState(filters.estado ?? '');

    function filtrar(e) {
        e.preventDefault();
        router.get(route('juridico.index'), { search, tipo, estado }, { preserveState: true, replace: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Procesos Juridicos</h2>}>
            <Head title="Juridico" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800 text-sm">{flash.success}</div>}

                {/* Resumen */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                        {label:'Total casos',      value: resumen.total,     color:'bg-blue-50 text-blue-700'},
                        {label:'En curso',         value: resumen.abiertos,  color:'bg-yellow-50 text-yellow-700'},
                        {label:'Exitosos',         value: resumen.exitosos,  color:'bg-green-50 text-green-700'},
                        {label:'Recuperado',       value: COP(resumen.valor_recuperado), color:'bg-purple-50 text-purple-700'},
                    ].map(c => (
                        <div key={c.label} className={`rounded-lg p-4 ${c.color}`}>
                            <p className="text-xl font-bold">{c.value}</p>
                            <p className="text-sm">{c.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <form onSubmit={filtrar} className="mb-5 flex flex-wrap gap-3 items-end">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Numero de caso..."
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-48" />
                    <select value={tipo} onChange={e => setTipo(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Todos los tipos</option>
                        {Object.entries(tipos).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={estado} onChange={e => setEstado(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Todos los estados</option>
                        {Object.entries(estados).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Filtrar</button>
                    <Link href={route('juridico.create')} className="ml-auto px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                        + Nuevo caso
                    </Link>
                </form>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Caso</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Afiliado</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Reclamado</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Recuperado</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Apertura</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {casos.data.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Sin casos registrados.</td></tr>
                            )}
                            {casos.data.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono font-semibold">{c.numero_caso}</td>
                                    <td className="px-4 py-3 text-gray-600">{tipos[c.tipo_proceso]}</td>
                                    <td className="px-4 py-3">{c.afiliado?.nombre ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLOR[c.estado]}`}>
                                            {estados[c.estado]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">{COP(c.valor_reclamado)}</td>
                                    <td className="px-4 py-3 text-right text-green-700 font-medium">{COP(c.valor_recuperado)}</td>
                                    <td className="px-4 py-3 text-gray-500">{c.fecha_apertura}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={route('juridico.show', c.id)} className="text-blue-600 hover:underline">Ver</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {casos.last_page > 1 && (
                    <div className="mt-4 flex gap-2 justify-center">
                        {casos.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1 rounded text-sm border ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
