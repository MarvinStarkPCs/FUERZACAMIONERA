import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const COP = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v ?? 0);

function StatCard({ label, value, color, href }) {
    const content = (
        <div className={`${color} rounded-xl p-5 text-white shadow-sm hover:shadow-md transition-all`}>
            <p className="text-3xl font-extrabold tracking-tight">{value}</p>
            <p className="text-sm mt-1 font-medium opacity-85">{label}</p>
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : <div>{content}</div>;
}

function FinCard({ label, value, colorText, bg }) {
    return (
        <div className={`${bg} rounded-xl p-5 border border-gray-100 shadow-sm`}>
            <p className={`text-xl font-bold ${colorText} tracking-tight`}>{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
    );
}

export default function Dashboard({ afiliados, casos, gastos_mes, ingresos_mes }) {
    const { permissions = [] } = usePage().props.auth;
    const can = (p) => permissions.includes(p);

    const balance = (ingresos_mes ?? 0) - (gastos_mes ?? 0);

    return (
        <AuthenticatedLayout header={
            <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                Panel Principal
            </h2>
        }>
            <Head title="Dashboard" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Banner */}
                <div className="rounded-2xl bg-navy-900 text-white p-6 flex items-center justify-between shadow overflow-hidden relative">
                    <div className="absolute right-0 top-0 opacity-5">
                        <svg viewBox="0 0 200 120" className="h-40 w-auto" fill="white">
                            <rect x="5" y="30" width="110" height="70" rx="6"/>
                            <path d="M115 45h35l25 35v20H115V45z"/>
                            <circle cx="38" cy="105" r="14"/>
                            <circle cx="88" cy="105" r="14"/>
                            <circle cx="148" cy="105" r="14"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest">Bienvenido al sistema</p>
                        <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Asociacion Fuerza Camionera</h1>
                        <p className="text-navy-300 text-sm mt-1">Sistema Integral de Gestion</p>
                    </div>
                    <div className="hidden sm:block text-brand-500 opacity-80">
                        <svg viewBox="0 0 80 50" className="h-20 w-auto" fill="currentColor">
                            <rect x="2" y="12" width="44" height="28" rx="3"/>
                            <path d="M46 19h14l10 14v8H46V19z"/>
                            <circle cx="15" cy="42" r="6" fill="white"/>
                            <circle cx="35" cy="42" r="6" fill="white"/>
                            <circle cx="57" cy="42" r="6" fill="white"/>
                        </svg>
                    </div>
                </div>

                {/* Afiliados */}
                {can('afiliados.ver') && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-brand-500 rounded" />
                            Afiliados
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard label="Total afiliados"  value={afiliados?.total ?? 0}       color="bg-navy-800"         href="/afiliados" />
                            <StatCard label="Activos"          value={afiliados?.activos ?? 0}      color="bg-emerald-600"      href="/afiliados?estado=afiliado" />
                            <StatCard label="Suspendidos"      value={afiliados?.suspendidos ?? 0}  color="bg-amber-500"        href="/afiliados?estado=suspendido" />
                            <StatCard label="No afiliados"     value={afiliados?.no_afiliados ?? 0} color="bg-red-600"          href="/afiliados?estado=no_afiliado" />
                        </div>
                    </div>
                )}

                {/* Financiero */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="h-0.5 w-4 bg-brand-500 rounded" />
                        Financiero del mes
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <FinCard label="Ingresos del mes"    value={COP(ingresos_mes)}  colorText="text-emerald-700" bg="bg-emerald-50" />
                        <FinCard label="Gastos del mes"      value={COP(gastos_mes)}    colorText="text-red-700"     bg="bg-red-50" />
                        <FinCard label="Balance del mes"     value={COP(balance)}       colorText={balance >= 0 ? 'text-navy-800' : 'text-red-700'} bg="bg-blue-50" />
                        <FinCard label="Deuda total cartera" value={COP(afiliados?.deuda_total)} colorText="text-brand-700" bg="bg-orange-50" />
                    </div>
                </div>

                {/* Procesos juridicos */}
                {can('juridico.ver') && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-brand-500 rounded" />
                            Procesos Juridicos
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <FinCard label="Total casos"      value={casos?.total ?? 0}       colorText="text-gray-800"   bg="bg-gray-50" />
                            <FinCard label="En curso"         value={casos?.en_curso ?? 0}    colorText="text-amber-700"  bg="bg-amber-50" />
                            <FinCard label="Exitosos"         value={casos?.exitosos ?? 0}    colorText="text-emerald-700" bg="bg-emerald-50" />
                            <FinCard label="Recuperado total" value={COP(casos?.recuperado)}  colorText="text-purple-700" bg="bg-purple-50" />
                        </div>
                    </div>
                )}

                {/* Accesos rapidos */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="h-0.5 w-4 bg-brand-500 rounded" />
                        Accesos rapidos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {can('afiliados.ver') && (
                            <Link href="/afiliados" className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                                Afiliados
                            </Link>
                        )}
                        {can('juridico.ver') && (
                            <Link href="/juridico" className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                                Procesos Juridicos
                            </Link>
                        )}
                        {can('pagos.crear') && (
                            <Link href="/pagos/create" className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                                Registrar Pago
                            </Link>
                        )}
                        {can('gastos.ver') && (
                            <Link href="/gastos" className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                                Gastos
                            </Link>
                        )}
                        {can('gremial.ver') && (
                            <Link href="/gremial" className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                                Acciones Gremiales
                            </Link>
                        )}
                        {can('noticias.ver') && (
                            <Link href="/noticias" className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                                Noticias
                            </Link>
                        )}
                        {can('usuarios.ver') && (
                            <Link href="/users" className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                                Usuarios
                            </Link>
                        )}
                        <Link href="/consulta" className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold text-center py-3.5 rounded-xl transition shadow-sm">
                            Consulta QR
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
