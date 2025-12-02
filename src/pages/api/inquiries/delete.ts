/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Ensure Correct Method
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const supabase = createPagesServerClient({ req, res });

    // 2. Check Authentication
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // 3. Get Inquiry ID from Query or Body
    const { id } = req.query; // Assuming DELETE /api/inquiries/delete?id=123

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Inquiry ID is required' });
    }

    try {
        // 4. Perform Delete
        // We explicitly check 'freelancer_id' to ensure they can only delete THEIR own leads.
        // (RLS also handles this, but this is double security).
        const { error } = await supabase
            .from('inquiries')
            .delete()
            .eq('id', id)
            .eq('freelancer_id', user.id);

        if (error) throw error;

        return res.status(200).json({ message: 'Inquiry deleted successfully' });

    } catch (error: any) {
        console.error("Error deleting inquiry:", error);
        return res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
}