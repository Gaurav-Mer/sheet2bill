// pages/signup.tsx
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { FormEvent, ReactElement } from 'react'


export default function SignUpPage() {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const email = event.currentTarget.email.value
        const password = event.currentTarget.password.value

        const { error } = await supabaseClient.auth.signUp({ email, password })
        if (!error) {
            // You might want to show a "Check your email to confirm" message
            alert('Sign up successful! Please check your email to confirm.')
            router.push('/login')
        } else {
            alert(error.message)
        }
    }

    return (
        <div className="container mx-auto max-w-sm mt-10">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required className="w-full p-2 border rounded text-black" />
                </div>
                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required className="w-full p-2 border rounded text-black" />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Sign Up</button>
            </form>
        </div>
    )
}


SignUpPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};