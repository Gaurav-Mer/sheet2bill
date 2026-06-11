// pages/api/auth/[...supabase].ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
    const { code, next } = req.query

    if (code) {
        const supabase = createPagesServerClient({ req, res })
        await supabase.auth.exchangeCodeForSession(String(code))
    }

    const redirectTo = typeof next === 'string' && next.startsWith('/') ? next : '/dashboard'
    res.redirect(redirectTo)
}

export default handler