import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
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

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In - Nexus Study" />

            <div>
                <h2 className="text-center text-3xl font-bold text-gray-900">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to your account to continue
                </p>
            </div>

            {status && (
                <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 font-medium" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        autoComplete="username"
                        placeholder="your.email@example.com"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-medium" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="rounded border-gray-300 text-red-600 shadow-sm focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-red-600 hover:text-red-500 font-medium"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>

                <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="font-medium text-red-600 hover:text-red-500"
                        >
                            Create one here
                        </Link>
                    </span>
                </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500">
                    <p className="font-medium mb-2">Demo Accounts:</p>
                    <p className="text-xs">Student: john.mukamuri@example.com / password</p>
                    <p className="text-xs">Admin: admin@nexusstudy.com / password</p>
                </div>
            </div>
        </GuestLayout>
    );
}
