import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ESTADO_COLOR = {
    radicado:   'bg-blue-100 text-blue-800',
    en_tramite: 'bg-amber-100 text-amber-800',
    respondido: 'bg-emerald-100 text-emerald-800',
    vencido:    'bg-red-100 text-red-800',
};

export default function Index({ acciones, tipos, estados, filters }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);
    const [tipo,   setTipo]   = useState(filters.tipo ?? '');
    const [estado, setEstado] = useState(filters.estado ?? '');

    function filtrar(e) {
        e.preventDefault();
        router.get(route('gremial.index'), { tipo, estado }, { preserveState: true, replace: true });
    }

    function eliminar(id) {
        if (!confirm('¿Eliminar esta accion?')) return;
        router.delete(route('gremial.destroy', id));
    }

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-navy-800">Acciones Gremiales</h2>
                {can('gremial.crear') && (
                    <Link href={route('gremial.create')}
                        className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition">
                        + Nueva accion
                    </Link>
                )}
            </div>
        }>
            <Head title="Acciones Gremiales" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">{flash.success}</div>
                )}

                <form onSubmit={filtrar} className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option value="">Todos los tipos</option>
                            {Object.entries(tipos).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                        <select value={estado} onChange={e => setEstado(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option value="">Todos los estados</option>
                            {Object.entries(estados).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <button type="submit"
                        className="px-4 py-2 bg-navy-800 text-white text-sm rounded-lg hover:bg-navy-700 transition">
                        Filtrar
                    </button>
                </form>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead className="bg-navy-900 text-navy-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Entidad</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Asunto</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Radicado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Vencimiento</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {acciones.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">Sin acciones registradas.</td></tr>
                            )}
                            {acciones.data.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-700">{tipos[a.tipo]}</td>
                                    <td className="px-4 py-3 font-semibold text-navy-800">{a.entidad}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{a.asunto}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{a.fecha_radicacion}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{a.fecha_vencimiento ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLOR[a.estado]}`}>
                                            {estados[a.estado]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {can('gremial.editar') && (
                                                <Link href={route('gremial.edit', a.id)}
                                                    className="text-xs text-amber-600 hover:underline font-medium">Editar</Link>
                                            )}
                                            {can('gremial.eliminar') && (
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

                {acciones.last_page > 1 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                        {acciones.links.map((link, i) => (
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
