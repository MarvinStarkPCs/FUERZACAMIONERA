import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v ?? 0);

export default function Edit({ caso, tipos, estados, afiliados, propietarios, contactos, empresas, generadores, juridicos }) {
    const { data, setData, put, processing, errors } = useForm({
        tipo_proceso:            caso.tipo_proceso ?? '',
        estado:                  caso.estado ?? 'abierto',
        afiliado_id:             caso.afiliado_id ?? '',
        propietario_id:          caso.propietario_id ?? '',
        contacto_id:             caso.contacto_id ?? '',
        empresa_transporte_id:   caso.empresa_transporte_id ?? '',
        generador_carga_id:      caso.generador_carga_id ?? '',
        responsable_juridico_id: caso.responsable_juridico_id ?? '',
        valor_reclamado:         caso.valor_reclamado ?? '',
        valor_recuperado:        caso.valor_recuperado ?? '',
        valor_no_recuperado:     caso.valor_no_recuperado ?? '',
        valor_anticipo:          caso.valor_anticipo ?? '',
        fecha_anticipo:          caso.fecha_anticipo ?? '',
        cuenta_anticipo:         caso.cuenta_anticipo ?? '',
        valor_saldo:             caso.valor_saldo ?? '',
        fecha_saldo:             caso.fecha_saldo ?? '',
        cuenta_saldo:            caso.cuenta_saldo ?? '',
        porcentaje_aplicado:     caso.porcentaje_aplicado ?? '',
        valor_asociacion:        caso.valor_asociacion ?? '',
        valor_juridicos:         caso.valor_juridicos ?? '',
        fecha_cierre:            caso.fecha_cierre ?? '',
        observaciones:           caso.observaciones ?? '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('juridico.update', caso.id));
    }

    const sel = (label, key, opts) => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <select value={data[key]} onChange={e => setData(key, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                {Object.entries(opts).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
        </div>
    );

    const selCatalogo = (label, key, list, labelKey = 'nombre') => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <select value={data[key]} onChange={e => setData(key, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">— Ninguno —</option>
                {list.map(i => (
                    <option key={i.id} value={i.id}>
                        {i[labelKey] ?? i.nombre}{i.cedula ? ` — ${i.cedula}` : ''}{i.nit ? ` (NIT: ${i.nit})` : ''}
                    </option>
                ))}
            </select>
        </div>
    );

    const num = (label, key) => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input type="number" value={data[key]} onChange={e => setData(key, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
        </div>
    );

    const txt = (label, key, type = 'text') => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input type={type} value={data[key]} onChange={e => setData(key, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
        </div>
    );

    function Section({ title, children, cols = 2 }) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <span className="h-0.5 w-4 bg-brand-500 rounded inline-block" />
                    {title}
                </h3>
                <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-4`}>{children}</div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout header={
            <div>
                <span className="text-xs text-gray-400 font-mono">{caso.numero_caso}</span>
                <h2 className="text-xl font-bold text-navy-800">Editar caso juridico</h2>
            </div>
        }>
            <Head title={`Editar ${caso.numero_caso}`} />

            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6">

                    <Section title="Informacion del caso" cols={2}>
                        {sel('Tipo de proceso *', 'tipo_proceso', tipos)}
                        {sel('Estado *', 'estado', estados)}
                    </Section>

                    <Section title="Partes involucradas" cols={2}>
                        {selCatalogo('Afiliado', 'afiliado_id', afiliados)}
                        {selCatalogo('Propietario', 'propietario_id', propietarios)}
                        {selCatalogo('Contacto solicitante', 'contacto_id', contactos)}
                        {selCatalogo('Empresa de transporte', 'empresa_transporte_id', empresas, 'razon_social')}
                        {selCatalogo('Generador de carga', 'generador_carga_id', generadores, 'razon_social')}
                        {selCatalogo('Responsable juridico', 'responsable_juridico_id', juridicos, 'name')}
                    </Section>

                    <Section title="Valores reclamados" cols={2}>
                        {num('Valor reclamado *', 'valor_reclamado')}
                        {num('Valor recuperado', 'valor_recuperado')}
                        {num('Valor no recuperado', 'valor_no_recuperado')}
                        {num('% aplicado (comision)', 'porcentaje_aplicado')}
                        {num('Valor asociacion', 'valor_asociacion')}
                        {num('Valor juridicos', 'valor_juridicos')}
                    </Section>

                    <Section title="Anticipo" cols={3}>
                        {num('Valor anticipo', 'valor_anticipo')}
                        {txt('Fecha anticipo', 'fecha_anticipo', 'date')}
                        {txt('Cuenta destino anticipo', 'cuenta_anticipo')}
                    </Section>

                    <Section title="Saldo" cols={3}>
                        {num('Valor saldo', 'valor_saldo')}
                        {txt('Fecha saldo', 'fecha_saldo', 'date')}
                        {txt('Cuenta destino saldo', 'cuenta_saldo')}
                    </Section>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-brand-500 rounded inline-block" />
                            Cierre y observaciones
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {txt('Fecha de cierre', 'fecha_cierre', 'date')}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Observaciones</label>
                                <textarea rows={3} value={data.observaciones}
                                    onChange={e => setData('observaciones', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-50 transition">
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        <Link href={route('juridico.show', caso.id)}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
