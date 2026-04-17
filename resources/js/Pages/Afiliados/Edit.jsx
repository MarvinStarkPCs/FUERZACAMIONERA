import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ afiliado }) {
    const { data, setData, post, processing, errors } = useForm({
        _method:       'PUT',
        nombre:        afiliado.nombre,
        cedula:        afiliado.cedula,
        direccion:     afiliado.direccion,
        email:         afiliado.email ?? '',
        telefono:      afiliado.telefono,
        meses_mora:    afiliado.meses_mora,
        observaciones: afiliado.observaciones ?? '',
        foto:          null,
        copia_cedula:  null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('afiliados.update', afiliado.id), { forceFormData: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Editar afiliado</h2>}>
            <Head title="Editar afiliado" />

            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b pb-2">Datos personales</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                                <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cedula *</label>
                                <input type="text" value={data.cedula} onChange={e => setData('cedula', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.cedula && <p className="mt-1 text-xs text-red-600">{errors.cedula}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                                <input type="text" value={data.telefono} onChange={e => setData('telefono', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion *</label>
                                <input type="text" value={data.direccion} onChange={e => setData('direccion', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.direccion && <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meses en mora</label>
                                <input type="number" min="0" value={data.meses_mora} onChange={e => setData('meses_mora', parseInt(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.meses_mora && <p className="mt-1 text-xs text-red-600">{errors.meses_mora}</p>}
                                <p className="mt-1 text-xs text-gray-400">0=Afiliado · 1-2=Suspendido · 3+=No afiliado</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva foto <span className="text-gray-400 font-normal">(opcional)</span></label>
                                <input type="file" accept="image/*" onChange={e => setData('foto', e.target.files[0])}
                                    className="w-full text-sm text-gray-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva copia cedula <span className="text-gray-400 font-normal">(opcional)</span></label>
                                <input type="file" accept="image/*,application/pdf" onChange={e => setData('copia_cedula', e.target.files[0])}
                                    className="w-full text-sm text-gray-600" />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                <textarea rows={2} value={data.observaciones} onChange={e => setData('observaciones', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        <Link href={route('afiliados.show', afiliado.id)} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
