import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesion" />

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400">{status}</div>
            )}

            <h2 className="text-lg font-bold text-white mb-6">Iniciar sesion</h2>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-navy-300 mb-1.5 uppercase tracking-wider">
                        Correo electronico
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={e => setData('email', e.target.value)}
                        className="w-full bg-navy-900 border border-navy-600 text-white placeholder-navy-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                        placeholder="usuario@fuerzacamionera.com"
                    />
                    <InputError message={errors.email} className="mt-1.5 !text-red-400" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-medium text-navy-300 mb-1.5 uppercase tracking-wider">
                        Contrasena
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={e => setData('password', e.target.value)}
                        className="w-full bg-navy-900 border border-navy-600 text-white placeholder-navy-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-1.5 !text-red-400" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="rounded border-navy-600 bg-navy-900 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="text-sm text-navy-400">Recordarme</span>
                    </label>

                    {canResetPassword && (
                        <Link href={route('password.request')}
                            className="text-sm text-brand-400 hover:text-brand-300 transition">
                            Olvide mi contrasena
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-lg disabled:opacity-50 transition shadow-lg shadow-brand-500/20"
                >
                    {processing ? 'Ingresando...' : 'Ingresar al sistema'}
                </button>
            </form>
        </GuestLayout>
    );
}
