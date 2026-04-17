import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const flash = usePage().props.flash ?? {};
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{
            background: 'linear-gradient(160deg, #0a1035 0%, #1a2a7f 40%, #0a1035 70%, #7c2d12 100%)'
        }}>
            {/* Barra top naranja */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-brand-500" />

            {/* Logo */}
            <div className="mb-8 text-center">
                <Link href="/">
                    <div className="bg-white rounded-full w-36 h-36 flex items-center justify-center shadow-lg shadow-black/20">
                        <img src="/image/logo.png" alt="Fuerza Camionera" className="w-36 h-36 object-contain" />
                    </div>
                </Link>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-navy-800 border border-navy-700 rounded-2xl shadow-2xl px-8 py-7">
                {flash.error && (
                    <div className="mb-4 rounded-lg bg-red-900/50 border border-red-500/40 p-3 text-red-300 text-sm flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {flash.error}
                    </div>
                )}
                {children}
            </div>

            <p className="mt-6 text-navy-500 text-xs">
                &copy; {new Date().getFullYear()} Asociacion Fuerza Camionera
            </p>
        </div>
    );
}
