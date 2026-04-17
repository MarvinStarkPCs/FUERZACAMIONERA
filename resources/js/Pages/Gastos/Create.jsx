import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormCard, { FormField, inputCls, selectCls, SubmitBtn } from '@/Components/FormCard';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ categorias, responsables }) {
    const { data, setData, post, processing, errors } = useForm({
        fecha: new Date().toISOString().split('T')[0],
        concepto: '', categoria: 'administracion', valor: '',
        medio_pago: '', cuenta_origen: '', responsable_id: '',
        observaciones: '', soporte: null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('gastos.store'), { forceFormData: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-navy-800">Registrar gasto</h2>}>
            <Head title="Nuevo gasto" />
            <div className="py-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-5">
                    <FormCard title="Datos del gasto">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Fecha *">
                                    <input type="date" value={data.fecha} onChange={e => setData('fecha', e.target.value)}
                                        className={inputCls} />
                                </FormField>
                                <FormField label="Categoria *">
                                    <select value={data.categoria} onChange={e => setData('categoria', e.target.value)}
                                        className={selectCls}>
                                        {Object.entries(categorias).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </FormField>
                            </div>

                            <FormField label="Concepto *" error={errors.concepto}>
                                <input type="text" value={data.concepto} onChange={e => setData('concepto', e.target.value)}
                                    placeholder="Describe el gasto..."
                                    className={inputCls} />
                            </FormField>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Valor *" error={errors.valor}>
                                    <input type="number" value={data.valor} onChange={e => setData('valor', e.target.value)}
                                        className={inputCls} />
                                </FormField>
                                <FormField label="Medio de pago">
                                    <input type="text" value={data.medio_pago} onChange={e => setData('medio_pago', e.target.value)}
                                        placeholder="Efectivo, transferencia..."
                                        className={inputCls} />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Cuenta de origen">
                                    <input type="text" value={data.cuenta_origen} onChange={e => setData('cuenta_origen', e.target.value)}
                                        className={inputCls} />
                                </FormField>
                                <FormField label="Responsable">
                                    <select value={data.responsable_id} onChange={e => setData('responsable_id', e.target.value)}
                                        className={selectCls}>
                                        <option value="">— Ninguno —</option>
                                        {responsables.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </FormField>
                            </div>

                            <FormField label="Soporte">
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
                        <SubmitBtn processing={processing} label="Registrar gasto" />
                        <Link href={route('gastos.index')}
                            className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
