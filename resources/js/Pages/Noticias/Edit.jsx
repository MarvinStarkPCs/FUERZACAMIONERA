import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ noticia }) {
    const { data, setData, patch, processing, errors } = useForm({
        titulo: noticia.titulo, contenido: noticia.contenido, tipo: noticia.tipo,
        fecha_inicio: noticia.fecha_inicio, fecha_vencimiento: noticia.fecha_vencimiento ?? '',
        activo: noticia.activo,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('noticias.update', noticia.id));
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Editar publicacion</h2>}>
            <Head title="Editar publicacion" />
            <div className="py-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                                <select value={data.tipo} onChange={e => setData('tipo', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                    <option value="noticia">Noticia</option>
                                    <option value="normativa">Normativa</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-2 pb-1">
                                <input type="checkbox" id="activo" checked={data.activo} onChange={e => setData('activo', e.target.checked)}
                                    className="rounded border-gray-300" />
                                <label htmlFor="activo" className="text-sm text-gray-700">Activa</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
                            <input type="text" value={data.titulo} onChange={e => setData('titulo', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                            <textarea rows={5} value={data.contenido} onChange={e => setData('contenido', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                                <input type="date" value={data.fecha_inicio} onChange={e => setData('fecha_inicio', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha vencimiento</label>
                                <input type="date" value={data.fecha_vencimiento} onChange={e => setData('fecha_vencimiento', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                            <Link href={route('noticias.index')} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-md">Cancelar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
