// pages/forgot-password.tsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FormEvent, ReactElement, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const supabaseClient = useSupabaseClient();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        const email = event.currentTarget.email.value;

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
        } else {
            // IMPORTANT: For security, always show a success message, even if the email doesn't exist.
            // This prevents attackers from guessing which emails are registered.
            setSuccessMsg('If an account with that email exists, a password reset link has been sent.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4  bg-gradient-to-b from-primary/10 to-secondary ">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to receive a reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                        </div>

                        {successMsg && <Alert><AlertDescription>{successMsg}</AlertDescription></Alert>}
                        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Remember your password?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};