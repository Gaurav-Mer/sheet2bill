// pages/reset-password.tsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { FormEvent, ReactElement, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // This effect listens for the special password recovery event from Supabase
    useEffect(() => {
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                // The user is in the password recovery flow. You can add logic here if needed.
            }
        });
        return () => subscription.unsubscribe();
    }, [supabaseClient]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        const { error } = await supabaseClient.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg("Password reset successfully! You can now log in.");
            setTimeout(() => router.push('/login'), 2000);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4  bg-gradient-to-b from-primary/10 to-secondary ">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Set a New Password</CardTitle>
                    <CardDescription>Enter and confirm your new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        {successMsg && <Alert><AlertDescription>{successMsg}</AlertDescription></Alert>}
                        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Saving...' : 'Save New Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

ResetPasswordPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};