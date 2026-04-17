import { Head, useForm } from '@inertiajs/react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v ?? 0);

const ESTADO_COLOR = {
    afiliado:    'bg-green-100 text-green-800',
    suspendido:  'bg-yellow-100 text-yellow-800',
    no_afiliado: 'bg-red-100 text-red-800',
};

export default function Privada({ afiliado, estados, tiposPago, error }) {
    const { data, setData, post, processing } = useForm({ cedula: '', codigo: '' });

    function submit(e) {
        e.preventDefault();
        post(route('consulta.privada'));
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
            <Head title="Mi Cuenta" />

            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Asociacion Fuerza Camionera</h1>
                    <p className="text-gray-500 mt-1">Acceso privado del afiliado</p>
                </div>

                {!afiliado && (
                    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numero de cedula</label>
                                <input type="text" value={data.cedula} onChange={e => setData('cedula', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Codigo interno (ej: FC-00001)</label>
                                <input type="text" value={data.codigo} onChange={e => setData('codigo', e.target.value.toUpperCase())}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <button type="submit" disabled={processing}
                                className="w-full py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {processing ? 'Verificando...' : 'Ingresar'}
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <a href={route('consulta.publica')} className="text-sm text-blue-600 hover:underline">← Consulta publica por cedula</a>
                        </div>
                    </div>
                )}

                {afiliado && (
                    <div className="space-y-4">
                        {/* Datos */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500">{afiliado.codigo}</p>
                                    <p className="text-xl font-bold">{afiliado.nombre}</p>
                                    <p className="text-gray-500 text-sm">CC: {afiliado.cedula} | Tel: {afiliado.telefono}</p>
                                </div>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${ESTADO_COLOR[afiliado.estado]}`}>
                                    {estados[afiliado.estado]}
                                </span>
                            </div>
                            {afiliado.meses_mora > 0 && (
                                <div className="mt-3 bg-red-50 rounded-md p-3 text-sm text-red-700">
                                    Mora: <strong>{afiliado.meses_mora} mes(es)</strong> — Deuda total: <strong>{COP(afiliado.deuda_total)}</strong>
                                </div>
                            )}
                        </div>

                        {/* Vehiculos */}
                        {afiliado.vehiculos?.length > 0 && (
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Mis vehiculos</h3>
                                {afiliado.vehiculos.map(v => (
                                    <div key={v.id} className="text-sm border rounded-md p-3 flex gap-4">
                                        <span className="font-mono font-bold">{v.placa}</span>
                                        <span>{v.marca} {v.modelo} {v.anio}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagos */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="font-semibold text-gray-700 mb-3">Mis pagos</h3>
                            {afiliado.pagos?.length === 0 && <p className="text-sm text-gray-400">Sin pagos registrados.</p>}
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {afiliado.pagos?.map(p => (
                                    <div key={p.id} className="flex justify-between text-sm border rounded-md p-3">
                                        <div>
                                            <span className="font-medium">{tiposPago[p.tipo]}</span>
                                            {p.periodo && <span className="ml-2 text-gray-400">({p.periodo})</span>}
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <span className="text-gray-400">{p.fecha}</span>
                                            <span className="font-semibold text-green-700">{COP(p.valor)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <a href={route('consulta.privada')} className="text-sm text-blue-600 hover:underline">Cerrar sesion</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
