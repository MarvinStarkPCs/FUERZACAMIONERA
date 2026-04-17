import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ accion, tipos, estados, responsables }) {
    const { data, setData, patch, processing, errors } = useForm({
        tipo: accion.tipo, entidad: accion.entidad, asunto: accion.asunto,
        fecha_radicacion: accion.fecha_radicacion, fecha_vencimiento: accion.fecha_vencimiento ?? '',
        responsable_id: accion.responsable_id ?? '', estado: accion.estado,
        respuesta: accion.respuesta ?? '', fecha_respuesta: accion.fecha_respuesta ?? '',
        observaciones: accion.observaciones ?? '',
    });

    function submit(e) {
        e.preventDefault();
        patch(route('gremial.update', accion.id));
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Editar accion gremial</h2>}>
            <Head title="Editar accion" />
            <div className="py-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select value={data.tipo} onChange={e => setData('tipo', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                {Object.entries(tipos).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entidad *</label>
                            <input type="text" value={data.entidad} onChange={e => setData('entidad', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Asunto *</label>
                            <input type="text" value={data.asunto} onChange={e => setData('asunto', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Radicacion</label>
                                <input type="date" value={data.fecha_radicacion} onChange={e => setData('fecha_radicacion', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                                <input type="date" value={data.fecha_vencimiento} onChange={e => setData('fecha_vencimiento', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                                <select value={data.estado} onChange={e => setData('estado', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                    {Object.entries(estados).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha respuesta</label>
                                <input type="date" value={data.fecha_respuesta} onChange={e => setData('fecha_respuesta', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta recibida</label>
                            <textarea rows={3} value={data.respuesta} onChange={e => setData('respuesta', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                            <textarea rows={2} value={data.observaciones} onChange={e => setData('observaciones', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                            <Link href={route('gremial.index')} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-md">Cancelar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
