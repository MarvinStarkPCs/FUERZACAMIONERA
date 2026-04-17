import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v ?? 0);

export default function Index({ gastos, categorias, filters, total_mes }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);
    const [categoria, setCategoria] = useState(filters.categoria ?? '');
    const [mes, setMes] = useState(filters.mes ?? '');

    function filtrar(e) {
        e.preventDefault();
        router.get(route('gastos.index'), { categoria, mes }, { preserveState: true, replace: true });
    }

    function eliminar(id) {
        if (!confirm('¿Eliminar este gasto?')) return;
        router.delete(route('gastos.destroy', id));
    }

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-navy-800">Gastos de la Asociacion</h2>
                {can('gastos.crear') && (
                    <Link href={route('gastos.create')}
                        className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition">
                        + Nuevo gasto
                    </Link>
                )}
            </div>
        }>
            <Head title="Gastos" />
            <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">{flash.success}</div>
                )}

                {/* Total */}
                <div className="bg-navy-900 text-white rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-navy-300 uppercase tracking-wider">Total del periodo</p>
                        <p className="text-3xl font-extrabold mt-1 text-red-400">{COP(total_mes)}</p>
                    </div>
                    <div className="text-navy-400 text-right text-sm">{gastos.total} registros</div>
                </div>

                {/* Filtros */}
                <form onSubmit={filtrar} className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
                        <select value={categoria} onChange={e => setCategoria(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option value="">Todas las categorias</option>
                            {Object.entries(categorias).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Mes</label>
                        <input type="month" value={mes} onChange={e => setMes(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
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
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Concepto</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Categoria</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Cuenta</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Valor</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {gastos.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Sin gastos registrados.</td></tr>
                            )}
                            {gastos.data.map(g => (
                                <tr key={g.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-500">{g.fecha}</td>
                                    <td className="px-4 py-3 font-medium text-navy-800">{g.concepto}</td>
                                    <td className="px-4 py-3 text-gray-600">{categorias[g.categoria]}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{g.cuenta_origen ?? '—'}</td>
                                    <td className="px-4 py-3 text-right font-bold text-red-600">{COP(g.valor)}</td>
                                    <td className="px-4 py-3 text-right">
                                        {can('gastos.eliminar') && (
                                            <button onClick={() => eliminar(g.id)}
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

                {gastos.last_page > 1 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                        {gastos.links.map((link, i) => (
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
