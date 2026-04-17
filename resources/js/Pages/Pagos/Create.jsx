import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormCard, { FormField, inputCls, selectCls, SubmitBtn } from '@/Components/FormCard';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ afiliados, tipos, afiliado }) {
    const { data, setData, post, processing, errors } = useForm({
        afiliado_id:    afiliado?.id ?? '',
        tipo:           'mensualidad',
        valor:          30000,
        fecha:          new Date().toISOString().split('T')[0],
        periodo:        new Date().toISOString().substring(0, 7),
        estado:         'pagado',
        cuenta_destino: '',
        observaciones:  '',
        soporte:        null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('pagos.store'), { forceFormData: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-navy-800">Registrar pago</h2>}>
            <Head title="Registrar pago" />
            <div className="py-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-5">
                    <FormCard title="Datos del pago">
                        <div className="space-y-4">
                            <FormField label="Afiliado *" error={errors.afiliado_id}>
                                <select value={data.afiliado_id} onChange={e => setData('afiliado_id', e.target.value)}
                                    className={selectCls}>
                                    <option value="">Seleccionar afiliado...</option>
                                    {afiliados.map(a => (
                                        <option key={a.id} value={a.id}>{a.nombre} — {a.cedula} ({a.codigo})</option>
                                    ))}
                                </select>
                            </FormField>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Tipo de pago *">
                                    <select value={data.tipo} onChange={e => setData('tipo', e.target.value)} className={selectCls}>
                                        {Object.entries(tipos).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Estado *">
                                    <select value={data.estado} onChange={e => setData('estado', e.target.value)} className={selectCls}>
                                        <option value="pagado">Pagado</option>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="anulado">Anulado</option>
                                    </select>
                                </FormField>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Valor *" error={errors.valor}>
                                    <input type="number" value={data.valor} onChange={e => setData('valor', e.target.value)}
                                        className={inputCls} />
                                </FormField>
                                <FormField label="Fecha *">
                                    <input type="date" value={data.fecha} onChange={e => setData('fecha', e.target.value)}
                                        className={inputCls} />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Periodo">
                                    <input type="month" value={data.periodo} onChange={e => setData('periodo', e.target.value)}
                                        className={inputCls} />
                                </FormField>
                                <FormField label="Cuenta destino">
                                    <input type="text" value={data.cuenta_destino} onChange={e => setData('cuenta_destino', e.target.value)}
                                        placeholder="Banco, numero de cuenta..."
                                        className={inputCls} />
                                </FormField>
                            </div>

                            <FormField label="Soporte (PDF o imagen)">
                                <input type="file" onChange={e => setData('soporte', e.target.files[0])}
                                    className="w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-navy-800 file:text-white file:text-xs file:font-medium file:cursor-pointer" />
                            </FormField>

                            <FormField label="Observaciones">
                                <textarea rows={2} value={data.observaciones} onChange={e => setData('observaciones', e.target.value)}
                                    className={inputCls} />
                            </FormField>
                        </div>
                    </FormCard>

                    <div className="flex gap-3">
                        <SubmitBtn processing={processing} label="Registrar pago" />
                        <Link href={route('afiliados.index')}
                            className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
