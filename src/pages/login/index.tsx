// pages/login.tsx
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, ReactElement, useState } from 'react';

export default function LoginPage() {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMsg('');
        setLoading(true);

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

        setLoading(false);

        if (!error) {
            router.push('/dashboard');
        } else {
            setErrorMsg(error.message);
        }
    }

    return (
        <div className="min-h-dvh flex items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-secondary ">
            <Head>
                <title>Login - Sheet2Bill</title>
                <meta name="description" content="Log in to your Sheet2Bill account to manage your clients and invoices." />
            </Head>
            <div className="w-full max-w-md rounded-2xl shadow-md border border-white/20 p-8 pt-0 px-0 bg-white">
                <div className='mx-auto flex flex-col items-center justify-center bg-primary rounded-t-xl rounded-b-[45%] w-full'>
                    <div className='mt-2'>
                        <Logo className="h-10 w-10 mb-0 " />
                    </div>
                    <p className='font-semibold text-white mb-2'>Sheet2Bill</p>
                </div>
                <div className="text-center my-6">
                    <h1 className="text-3xl font-bold ">Welcome Back 👋</h1>
                    <p className=" mt-2">Log in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6 pb-0">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-red-400 text-sm text-center">{errorMsg}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>

                <p className="text-center  text-sm mt-6">
                    Don’t have an account?{' '}
                    <Link href="/signup" className=" font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>

                <p className="text-center  text-sm mt-6">
                    Forgot password?{' '}
                    <Link href="/forgot-password" className=" font-semibold hover:underline">
                        forgot password
                    </Link>
                </p>
            </div>
        </div>
    );
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};
