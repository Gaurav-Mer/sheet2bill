// pages/signup.tsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { FormEvent, ReactElement, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Head from 'next/head';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function SignUpPage() {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        const { error, data } = await supabaseClient.auth.signUp({ email, password });

        setLoading(false);

        if (error) {
            setErrorMsg(error.message); // This will correctly say "User already exists" if they are confirmed
            return;
        }
        if (data.user) {
            setSuccessMsg('Confirmation email sent! Please check your inbox (and spam folder) to activate your account.');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary flex items-center justify-center bg-white px-4">
            <Head>
                <title>Sign Up - Sheet2Bill</title>
                <meta name="description" content="Create a new Sheet2Bill account to start managing your clients and invoices." />
            </Head>
            <Card className="w-full max-w-md shadow-md border border-white pt-0 border-t-0 ">
                <div className='mx-auto flex flex-col items-center justify-center bg-primary rounded-t-xl rounded-b-[45%] w-full'>
                    <div className='mt-2'>
                        <Logo className="h-10 w-10 mb-0" />
                    </div>
                    <p className='font-semibold text-white mb-2'>Sheet2Bill</p>
                </div>
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold text-neutral-900">
                        Create Your Account
                    </CardTitle>
                    <p className="text-sm text-neutral-500">
                        Sign up to get started with your billing dashboard
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="bg-white"
                            />
                        </div>

                        {errorMsg && (
                            <Alert variant="destructive">
                                <AlertDescription>{errorMsg}</AlertDescription>
                            </Alert>
                        )}

                        {successMsg && (
                            <Alert>
                                <AlertDescription>{successMsg}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl  font-semibold"
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-neutral-600 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

SignUpPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};
