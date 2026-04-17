import { Head, Link, router, useForm } from '@inertiajs/react';

const ESTADO_COLOR = {
    afiliado:    'bg-emerald-50 text-emerald-800 border-emerald-300',
    suspendido:  'bg-amber-50 text-amber-800 border-amber-300',
    no_afiliado: 'bg-red-50 text-red-800 border-red-300',
};

const ESTADO_BADGE = {
    afiliado:    'bg-emerald-500',
    suspendido:  'bg-amber-500',
    no_afiliado: 'bg-red-500',
};


export default function Publica({ afiliado, estados, buscado }) {
    const { data, setData, processing } = useForm({ cedula: buscado ?? '' });

    function buscar(e) {
        e.preventDefault();
        router.get(route('consulta.publica'), { cedula: data.cedula });
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{
            background: 'linear-gradient(160deg, #0a1035 0%, #1a2a7f 40%, #0a1035 70%, #7c2d12 100%)'
        }}>
            <Head title="Consulta Afiliado — Fuerza Camionera" />

            {/* Barra top naranja */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-brand-500" />

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="bg-white rounded-full w-36 h-36 flex items-center justify-center shadow-lg shadow-black/20">
                        <img src="/image/logo.png" alt="Fuerza Camionera" className="w-36 h-36 object-contain" />
                    </div>
                </div>

                {/* Formulario */}
                <div className="bg-navy-800 border border-navy-700 rounded-2xl shadow-2xl p-6 mb-4">
                    <form onSubmit={buscar} className="flex gap-2">
                        <input
                            type="text"
                            value={data.cedula}
                            onChange={e => setData('cedula', e.target.value)}
                            placeholder="Numero de cedula..."
                            className="flex-1 bg-navy-900 border border-navy-600 text-white placeholder-navy-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                        />
                        <button type="submit" disabled={processing}
                            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg disabled:opacity-50 transition shadow-sm shadow-brand-500/20">
                            {processing ? '...' : 'Consultar'}
                        </button>
                    </form>
                </div>

                {/* Sin resultados */}
                {buscado && !afiliado && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-center text-red-300 text-sm mb-4">
                        No se encontro ningun afiliado con cedula <strong className="text-red-200">{buscado}</strong>.
                    </div>
                )}

                {/* Resultado */}
                {afiliado && (
                    <div className={`border-2 rounded-2xl p-6 text-center mb-4 ${ESTADO_COLOR[afiliado.estado]}`}>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-3 ${ESTADO_BADGE[afiliado.estado]}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-white/70 inline-block" />
                            {estados[afiliado.estado]}
                        </div>
                        <p className="font-mono text-xs opacity-60 mb-1">{afiliado.codigo}</p>
                        <p className="text-2xl font-extrabold mb-1">{afiliado.nombre}</p>
                        <p className="text-sm opacity-70">CC: {afiliado.cedula}</p>
                        {afiliado.fecha_afiliacion && (
                            <p className="text-xs opacity-50 mt-2">Afiliado desde: {afiliado.fecha_afiliacion}</p>
                        )}
                    </div>
                )}

                {/* Links */}
                <div className="mt-4 text-center space-y-2">
                    <div>
                        <Link href={route('consulta.privada')}
                            className="text-sm text-brand-400 hover:text-brand-300 transition">
                            Acceder a mi cuenta privada →
                        </Link>
                    </div>
                    <div>
                        <Link href="/"
                            className="text-xs text-navy-500 hover:text-navy-400 transition">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-navy-600 text-xs">
                &copy; {new Date().getFullYear()} Asociacion Fuerza Camionera
            </p>
        </div>
    );
}
