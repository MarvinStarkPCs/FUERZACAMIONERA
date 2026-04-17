import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ noticias, normativa }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);

    function eliminar(id) {
        if (!confirm('¿Eliminar esta publicacion?')) return;
        router.delete(route('noticias.destroy', id));
    }

    function Tabla({ items, titulo }) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3.5 bg-navy-900 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="h-0.5 w-4 bg-brand-500 rounded" />
                        {titulo}
                    </h3>
                </div>
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Titulo</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inicio</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimiento</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.data.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Sin publicaciones.</td></tr>
                        )}
                        {items.data.map(n => (
                            <tr key={n.id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 font-semibold text-navy-800">{n.titulo}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{n.fecha_inicio}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{n.fecha_vencimiento ?? 'Permanente'}</td>
                                <td className="px-4 py-3">
                                    {n.activo
                                        ? <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Activa</span>
                                        : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Inactiva</span>
                                    }
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        {can('noticias.editar') && (
                                            <Link href={route('noticias.edit', n.id)}
                                                className="text-xs text-amber-600 hover:underline font-medium">Editar</Link>
                                        )}
                                        {can('noticias.eliminar') && (
                                            <button onClick={() => eliminar(n.id)}
                                                className="text-xs text-red-500 hover:text-red-700 hover:underline">Eliminar</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-navy-800">Noticias y Normativa</h2>
                {can('noticias.crear') && (
                    <Link href={route('noticias.create')}
                        className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition">
                        + Nueva publicacion
                    </Link>
                )}
            </div>
        }>
            <Head title="Noticias" />
            <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">{flash.success}</div>
                )}
                <Tabla items={noticias} titulo="Noticias" />
                <Tabla items={normativa} titulo="Normativa vigente" />
            </div>
        </AuthenticatedLayout>
    );
}
