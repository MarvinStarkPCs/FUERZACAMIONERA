import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';


function NavDropdown({ label, active, items }) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition duration-150 ease-in-out focus:outline-none ${
                    active
                        ? 'bg-brand-500 text-white'
                        : 'text-navy-100 hover:bg-navy-700 hover:text-white'
                }`}>
                    {label}
                    <svg className="h-3.5 w-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content align="left" contentClasses="py-1 bg-navy-800 rounded-md shadow-xl border border-navy-700">
                {items.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block w-full px-4 py-2 text-sm text-navy-100 hover:bg-brand-500 hover:text-white transition"
                    >
                        {item.label}
                    </Link>
                ))}
            </Dropdown.Content>
        </Dropdown>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { user, permissions = [], roles = [] } = usePage().props.auth;
    const flash = usePage().props.flash ?? {};
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const cur = (name) => route().current(name);
    const can = (permission) => permissions.includes(permission);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Barra superior naranja */}
            <div className="bg-brand-500 h-1 w-full" />

            <nav className="bg-navy-900 border-b border-navy-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo + menu */}
                        <div className="flex items-center">
                            {/* Logo */}
                            <Link href="/" className="flex items-center shrink-0 mr-4">
                                <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center shadow">
                                    <img src="/image/logo.png" alt="Fuerza Camionera" className="w-14 h-14 object-contain" />
                                </div>
                            </Link>

                            {/* Separador */}
                            <div className="hidden sm:block w-px h-8 bg-navy-600 mr-4" />

                            {/* Menu escritorio */}
                            <div className="hidden sm:flex sm:items-center sm:gap-0.5">
                                <Link
                                    href={route('dashboard')}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                                        cur('dashboard')
                                            ? 'bg-brand-500 text-white'
                                            : 'text-navy-100 hover:bg-navy-700 hover:text-white'
                                    }`}
                                >
                                    Inicio
                                </Link>

                                {(can('afiliados.ver') || can('pagos.ver')) && (() => {
                                    const items = [
                                        can('afiliados.ver') && { href: route('afiliados.index'), label: 'Listado de afiliados' },
                                        can('afiliados.crear') && { href: route('afiliados.create'), label: 'Nuevo afiliado' },
                                        can('pagos.crear') && { href: route('pagos.create'), label: 'Registrar pago' },
                                        can('pagos.ver') && { href: route('pagos.index'), label: 'Historial de pagos' },
                                    ].filter(Boolean);
                                    return items.length > 0 && (
                                        <NavDropdown
                                            label="Afiliados"
                                            active={cur('afiliados.*') || cur('pagos.*')}
                                            items={items}
                                        />
                                    );
                                })()}

                                {can('juridico.ver') && (() => {
                                    const items = [
                                        { href: route('juridico.index'), label: 'Procesos juridicos' },
                                        can('juridico.crear') && { href: route('juridico.create'), label: 'Nuevo caso' },
                                    ].filter(Boolean);
                                    return (
                                        <NavDropdown label="Juridico" active={cur('juridico.*')} items={items} />
                                    );
                                })()}

                                {can('gremial.ver') && (
                                    <Link
                                        href={route('gremial.index')}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                                            cur('gremial.*')
                                                ? 'bg-brand-500 text-white'
                                                : 'text-navy-100 hover:bg-navy-700 hover:text-white'
                                        }`}
                                    >
                                        Gremial
                                    </Link>
                                )}

                                {can('gastos.ver') && (() => {
                                    const items = [
                                        { href: route('gastos.index'), label: 'Gastos' },
                                        can('gastos.crear') && { href: route('gastos.create'), label: 'Registrar gasto' },
                                    ].filter(Boolean);
                                    return (
                                        <NavDropdown label="Finanzas" active={cur('gastos.*')} items={items} />
                                    );
                                })()}

                                {can('noticias.ver') && (() => {
                                    const items = [
                                        { href: route('noticias.index'), label: 'Noticias y normativa' },
                                        can('noticias.crear') && { href: route('noticias.create'), label: 'Nueva publicacion' },
                                    ].filter(Boolean);
                                    return (
                                        <NavDropdown label="Contenido" active={cur('noticias.*')} items={items} />
                                    );
                                })()}

                                {can('usuarios.ver') && (() => {
                                    const items = [
                                        { href: route('users.index'), label: 'Usuarios del sistema' },
                                        can('usuarios.crear') && { href: route('users.create'), label: 'Nuevo usuario' },
                                        { href: route('consulta.publica'), label: 'Consulta publica QR' },
                                    ].filter(Boolean);
                                    return (
                                        <NavDropdown label="Admin" active={cur('users.*')} items={items} />
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Usuario */}
                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-navy-100 hover:bg-navy-700 hover:text-white transition">
                                        <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                                            {user?.name?.charAt(0) ?? 'U'}
                                        </div>
                                        <span>{user?.name}</span>
                                        <svg className="h-3.5 w-3.5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" contentClasses="py-1 bg-navy-800 rounded-md shadow-xl border border-navy-700">
                                    <div className="px-4 py-2 text-xs text-navy-300 border-b border-navy-700">
                                        <div className="font-medium text-white">{user?.name}</div>
                                        <div className="mt-0.5">{user?.email}</div>
                                    </div>
                                    <Link href={route('profile.edit')} className="block w-full px-4 py-2 text-sm text-navy-100 hover:bg-brand-500 hover:text-white transition">
                                        Mi perfil
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-sm text-navy-100 hover:bg-red-600 hover:text-white transition">
                                        Cerrar sesion
                                    </Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Hamburguesa movil */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-navy-300 hover:bg-navy-700 hover:text-white focus:outline-none transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu movil */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-navy-800'}>
                    <div className="space-y-0.5 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={cur('dashboard')}>Inicio</ResponsiveNavLink>

                        {(can('afiliados.ver') || can('pagos.ver')) && (
                            <>
                                <div className="px-4 py-1 text-xs font-semibold text-navy-400 uppercase tracking-wider">Afiliados</div>
                                {can('afiliados.ver') && <ResponsiveNavLink href={route('afiliados.index')} active={cur('afiliados.*')}>Listado de afiliados</ResponsiveNavLink>}
                                {can('afiliados.crear') && <ResponsiveNavLink href={route('afiliados.create')}>Nuevo afiliado</ResponsiveNavLink>}
                                {can('pagos.crear') && <ResponsiveNavLink href={route('pagos.create')}>Registrar pago</ResponsiveNavLink>}
                                {can('pagos.ver') && <ResponsiveNavLink href={route('pagos.index')}>Historial de pagos</ResponsiveNavLink>}
                            </>
                        )}

                        {can('juridico.ver') && (
                            <>
                                <div className="px-4 py-1 text-xs font-semibold text-navy-400 uppercase tracking-wider">Juridico</div>
                                <ResponsiveNavLink href={route('juridico.index')} active={cur('juridico.*')}>Procesos juridicos</ResponsiveNavLink>
                                {can('juridico.crear') && <ResponsiveNavLink href={route('juridico.create')}>Nuevo caso</ResponsiveNavLink>}
                            </>
                        )}

                        {(can('gremial.ver') || can('gastos.ver') || can('noticias.ver')) && (
                            <div className="px-4 py-1 text-xs font-semibold text-navy-400 uppercase tracking-wider">Otros</div>
                        )}
                        {can('gremial.ver') && <ResponsiveNavLink href={route('gremial.index')} active={cur('gremial.*')}>Acciones gremiales</ResponsiveNavLink>}
                        {can('gastos.ver') && <ResponsiveNavLink href={route('gastos.index')} active={cur('gastos.*')}>Gastos</ResponsiveNavLink>}
                        {can('noticias.ver') && <ResponsiveNavLink href={route('noticias.index')} active={cur('noticias.*')}>Noticias</ResponsiveNavLink>}
                        {can('usuarios.ver') && <ResponsiveNavLink href={route('users.index')} active={cur('users.*')}>Usuarios</ResponsiveNavLink>}
                        <ResponsiveNavLink href={route('consulta.publica')}>Consulta QR</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-navy-700 pb-1 pt-4">
                        <div className="flex items-center px-4 gap-3">
                            <div className="h-9 w-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold uppercase">
                                {user?.name?.charAt(0) ?? 'U'}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">{user?.name}</div>
                                <div className="text-xs text-navy-400">{user?.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-0.5">
                            <ResponsiveNavLink href={route('profile.edit')}>Mi perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Cerrar sesion</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-3">
                        <div className="h-1 w-6 bg-brand-500 rounded" />
                        {header}
                    </div>
                </header>
            )}

            {flash.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {flash.error}
                    </div>
                </div>
            )}
            {flash.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-700 text-sm flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}
            <main>{children}</main>
        </div>
    );
}
