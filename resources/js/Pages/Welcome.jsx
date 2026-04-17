import { Head, Link } from '@inertiajs/react';

const features = [
    { icon: '👥', title: 'Gestion de Afiliados', desc: 'Control completo del registro, estado y cartera de afiliados con generacion de credenciales QR.' },
    { icon: '⚖️', title: 'Procesos Juridicos', desc: 'Seguimiento de casos, actuaciones, cobros de manifiesto y recuperacion de valores.' },
    { icon: '💰', title: 'Control Financiero', desc: 'Registro de pagos, gastos, ingresos y balance mensual de la asociacion.' },
    { icon: '📢', title: 'Acciones Gremiales', desc: 'Organizacion de paros, marchas, reuniones y actividades del sindicato.' },
    { icon: '📰', title: 'Noticias y Normativa', desc: 'Publicacion de resoluciones, decretos y noticias relevantes para el sector.' },
    { icon: '🔐', title: 'Control de Accesos', desc: 'Roles y permisos diferenciados para administradores, coordinadores y personal juridico.' },
];

export default function Welcome({ canLogin }) {
    return (
        <>
            <Head title="Asociacion Fuerza Camionera" />

            <div className="min-h-screen text-white" style={{
                background: 'linear-gradient(160deg, #0a1035 0%, #1a2a7f 40%, #0a1035 70%, #7c2d12 100%)'
            }}>
                {/* Barra naranja top */}
                <div className="h-1 bg-brand-500" />

                {/* Patron de puntos decorativo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.08) 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />

                {/* Header */}
                <header className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                        <img src="/image/logo.png" alt="Fuerza Camionera" className="w-14 h-14 object-contain" />
                    </div>
                    {canLogin && (
                        <Link href={route('login')}
                            className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg transition shadow-lg">
                            Ingresar
                        </Link>
                    )}
                </header>

                {/* Hero */}
                <section className="relative max-w-2xl mx-auto px-6 py-16 text-center">
                    {/* Logo grande */}
                    <div className="flex justify-center mb-10">
                        <div className="bg-white rounded-full w-56 h-56 flex items-center justify-center shadow-2xl" style={{ boxShadow: '0 0 60px rgba(249,115,22,0.25), 0 20px 40px rgba(0,0,0,0.4)' }}>
                            <img src="/image/logo.png" alt="Fuerza Camionera" className="w-56 h-56 object-contain" />
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
                        Asociacion Fuerza Camionera
                    </h1>
                    <p className="text-navy-300 text-sm max-w-md mx-auto mb-10">
                        Sistema integral de gestion para afiliados, procesos juridicos,
                        finanzas y actividades gremiales del sector transportador de Colombia.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        {canLogin && (
                            <Link href={route('login')}
                                className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition shadow-lg text-sm">
                                Ingresar al sistema
                            </Link>
                        )}
                        <Link href={route('consulta.publica')}
                            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition text-sm backdrop-blur-sm">
                            Consulta publica
                        </Link>
                    </div>
                </section>

                {/* Modulos */}
                <section className="relative max-w-7xl mx-auto px-6 pb-20">
                    <div className="text-center mb-8">
                        <span className="inline-block text-xs font-bold text-brand-400 uppercase tracking-widest border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 rounded-full">
                            Modulos del sistema
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map(f => (
                            <div key={f.title}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-brand-500/40 transition group">
                                <div className="text-3xl mb-3">{f.icon}</div>
                                <h3 className="font-bold text-white mb-2 group-hover:text-brand-400 transition text-sm">{f.title}</h3>
                                <p className="text-navy-400 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="relative border-t border-white/10 py-6 text-center">
                    <p className="text-navy-500 text-xs">
                        &copy; {new Date().getFullYear()} Asociacion Fuerza Camionera de Colombia — Todos los derechos reservados
                    </p>
                </footer>
            </div>
        </>
    );
}
