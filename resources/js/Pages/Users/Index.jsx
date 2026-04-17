import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_COLORS = {
    administrador: 'bg-red-100 text-red-800',
    auxiliar:      'bg-blue-100 text-blue-800',
    juridico:      'bg-purple-100 text-purple-800',
    coordinador:   'bg-amber-100 text-amber-800',
    afiliado:      'bg-emerald-100 text-emerald-800',
};

export default function Index({ usuarios, roles, filters }) {
    const { flash, auth } = usePage().props;
    const can = (p) => (auth.permissions ?? []).includes(p);
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole]     = useState(filters.role ?? '');

    function aplicarFiltros(e) {
        e.preventDefault();
        router.get(route('users.index'), { search, role }, { preserveState: true, replace: true });
    }

    function eliminar(id) {
        if (!confirm('¿Eliminar este usuario?')) return;
        router.delete(route('users.destroy', id));
    }

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-navy-800">Usuarios del sistema</h2>
                {can('usuarios.crear') && (
                    <Link href={route('users.create')}
                        className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition">
                        + Nuevo usuario
                    </Link>
                )}
            </div>
        }>
            <Head title="Usuarios" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm">{flash.error}</div>
                )}

                <form onSubmit={aplicarFiltros} className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Nombre o correo..."
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Rol</label>
                        <select value={role} onChange={e => setRole(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                            <option value="">Todos los roles</option>
                            {Object.entries(roles).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
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
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Correo</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Rol</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usuarios.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">No se encontraron usuarios.</td>
                                </tr>
                            )}
                            {usuarios.data.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-5 py-3.5 font-semibold text-navy-800">{u.name}</td>
                                    <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {roles[u.role] ?? u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {u.activo
                                            ? <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Activo</span>
                                            : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Inactivo</span>
                                        }
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {can('usuarios.editar') && (
                                                <Link href={route('users.edit', u.id)}
                                                    className="text-xs text-amber-600 hover:underline font-medium">Editar</Link>
                                            )}
                                            {can('usuarios.eliminar') && (
                                                <button onClick={() => eliminar(u.id)}
                                                    className="text-xs text-red-500 hover:text-red-700 hover:underline">Eliminar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {usuarios.last_page > 1 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                        {usuarios.links.map((link, i) => (
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
