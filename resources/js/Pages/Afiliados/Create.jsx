import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '', cedula: '', direccion: '', email: '', telefono: '',
        fecha_afiliacion: new Date().toISOString().split('T')[0],
        observaciones: '',
        foto: null, copia_cedula: null,
        // vehiculo
        placa: '', tarjeta_propiedad: '', marca: '', modelo: '', anio: '', color: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('afiliados.store'), { forceFormData: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Nuevo afiliado</h2>}>
            <Head title="Nuevo afiliado" />

            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6">

                    {/* Datos personales */}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numero de cedula *</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion de residencia *</label>
                                <input type="text" value={data.direccion} onChange={e => setData('direccion', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.direccion && <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de afiliacion *</label>
                                <input type="date" value={data.fecha_afiliacion} onChange={e => setData('fecha_afiliacion', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.fecha_afiliacion && <p className="mt-1 text-xs text-red-600">{errors.fecha_afiliacion}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto tipo documento</label>
                                <input type="file" accept="image/*" onChange={e => setData('foto', e.target.files[0])}
                                    className="w-full text-sm text-gray-600" />
                                {errors.foto && <p className="mt-1 text-xs text-red-600">{errors.foto}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Copia cedula</label>
                                <input type="file" accept="image/*,application/pdf" onChange={e => setData('copia_cedula', e.target.files[0])}
                                    className="w-full text-sm text-gray-600" />
                                {errors.copia_cedula && <p className="mt-1 text-xs text-red-600">{errors.copia_cedula}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                <textarea rows={2} value={data.observaciones} onChange={e => setData('observaciones', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Vehiculo (opcional) */}
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b pb-2">Vehiculo <span className="text-gray-400 font-normal">(opcional)</span></h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                                <input type="text" value={data.placa} onChange={e => setData('placa', e.target.value.toUpperCase())}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.placa && <p className="mt-1 text-xs text-red-600">{errors.placa}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tarjeta de propiedad</label>
                                <input type="text" value={data.tarjeta_propiedad} onChange={e => setData('tarjeta_propiedad', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                <input type="text" value={data.marca} onChange={e => setData('marca', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                <input type="text" value={data.modelo} onChange={e => setData('modelo', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                <input type="number" value={data.anio} onChange={e => setData('anio', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <input type="text" value={data.color} onChange={e => setData('color', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Registrar afiliado'}
                        </button>
                        <Link href={route('afiliados.index')} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
