import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ tipos, afiliados, propietarios, contactos, empresas, generadores, juridicos }) {
    const { data, setData, post, processing, errors } = useForm({
        fecha_apertura: new Date().toISOString().split('T')[0],
        tipo_proceso: 'cobro_manifiesto',
        afiliado_id: '', propietario_id: '', contacto_id: '',
        empresa_transporte_id: '', generador_carga_id: '', responsable_juridico_id: '',
        valor_reclamado: '', valor_apertura: '', observaciones: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('juridico.store'));
    }

    const campo = (label, key, list, labelKey = 'nombre') => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select value={data[key]} onChange={e => setData(key, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">— Ninguno —</option>
                {list.map(i => <option key={i.id} value={i.id}>{i[labelKey] ?? i.nombre} {i.cedula ? `— ${i.cedula}` : ''} {i.nit ? `(NIT: ${i.nit})` : ''}</option>)}
            </select>
        </div>
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Nuevo caso juridico</h2>}>
            <Head title="Nuevo caso" />
            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6">

                    {/* Informacion basica */}
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b pb-2">Informacion del caso</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de proceso *</label>
                                <select value={data.tipo_proceso} onChange={e => setData('tipo_proceso', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                    {Object.entries(tipos).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de apertura *</label>
                                <input type="date" value={data.fecha_apertura} onChange={e => setData('fecha_apertura', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor reclamado *</label>
                                <input type="number" value={data.valor_reclamado} onChange={e => setData('valor_reclamado', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                {errors.valor_reclamado && <p className="mt-1 text-xs text-red-600">{errors.valor_reclamado}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor apertura (pago inicial)</label>
                                <input type="number" value={data.valor_apertura} onChange={e => setData('valor_apertura', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Partes */}
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b pb-2">Partes involucradas</h3>
                        {campo('Afiliado', 'afiliado_id', afiliados)}
                        {campo('Propietario', 'propietario_id', propietarios)}
                        {campo('Contacto solicitante', 'contacto_id', contactos)}
                        {campo('Empresa de transporte', 'empresa_transporte_id', empresas, 'razon_social')}
                        {campo('Generador de carga', 'generador_carga_id', generadores, 'razon_social')}
                        {campo('Responsable juridico', 'responsable_juridico_id', juridicos, 'name')}
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <textarea rows={3} value={data.observaciones} onChange={e => setData('observaciones', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Crear caso'}
                        </button>
                        <Link href={route('juridico.index')} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
