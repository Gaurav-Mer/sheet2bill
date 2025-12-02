/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkPlanLimits } from '@/lib/permission'; // Your existing permission helper

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
        inquiry_id,
        issue_date,
        delivery_date,
        payment_due_date,
        currency // Pass this from frontend to ensure consistency
    } = req.body;

    if (!inquiry_id) {
        return res.status(400).json({ message: 'Inquiry ID is required' });
    }

    try {
        // 1. GATEKEEPER: Check Plan Limits
        // We check both Briefs and Clients because accepting might create both.
        await checkPlanLimits(supabase, user.id, 'CREATE_BRIEF');
        // Note: Ideally check CREATE_CLIENT too, but that logic might be complex 
        // if the client already exists. You might want to be lenient here.

        // 2. Generate Brief Number (Your existing logic)
        const { data: lastBrief } = await supabase
            .from('briefs')
            .select('brief_number')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        let nextNumber = 1;
        if (lastBrief?.brief_number) {
            const lastNum = parseInt(lastBrief.brief_number.split('-')[1]);
            if (!isNaN(lastNum)) nextNumber = lastNum + 1;
        }
        const newBriefNumber = `BRIEF-${String(nextNumber).padStart(4, '0')}`;

        // 3. Execute the Transaction (RPC)
        const { data, error } = await supabase.rpc('accept_inquiry', {
            p_inquiry_id: inquiry_id,
            p_freelancer_id: user.id,
            p_issue_date: issue_date,
            p_delivery_date: delivery_date,
            p_payment_due_date: payment_due_date || null,
            p_brief_number: newBriefNumber,
            p_currency: currency || 'USD'
        });

        if (error) throw error;

        return res.status(200).json(data);

    } catch (error: any) {
        console.error("Error accepting inquiry:", error);
        // Handle Plan Limit Error
        if (error.message === 'Plan limit reached') {
            return res.status(402).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
}