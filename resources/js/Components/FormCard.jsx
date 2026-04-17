/**
 * Contenedor de seccion de formulario con estilo camionero.
 * Uso: <FormCard title="Datos basicos"><div>...</div></FormCard>
 */
export default function FormCard({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {title && (
                <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <span className="h-0.5 w-4 bg-brand-500 rounded inline-block" />
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}

export function FormField({ label, error, children }) {
    return (
        <div>
            {label && (
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    {label}
                </label>
            )}
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition";
export const selectCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition";

export function SubmitBtn({ processing, label = 'Guardar', loadingLabel = 'Guardando...' }) {
    return (
        <button type="submit" disabled={processing}
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg disabled:opacity-50 transition shadow-sm shadow-brand-500/20">
            {processing ? loadingLabel : label}
        </button>
    );
}
