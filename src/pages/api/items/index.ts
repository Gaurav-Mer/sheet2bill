import { checkUserLimit } from '@/lib/server-limit';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const ITEMS_PER_PAGE = 50; // We can show more items at once here

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    // --- HANDLE FETCHING A LIST OF ITEMS (GET) ---
    if (req.method === 'GET') {
        const page = parseInt(req.query.page as string, 10) || 1;
        const searchQuery = req.query.q as string || '';
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE - 1;

        let query = supabase
            .from('items')
            .select('*', { count: 'exact' })
            .eq('user_id', session.user.id);

        if (searchQuery) {
            query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(startIndex, endIndex);

        if (error) {
            console.error("Error fetching items:", error);
            return res.status(500).json({ message: "Error fetching items", error });
        }

        return res.status(200).json({
            items: data || [],
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        });
    }

    // --- HANDLE CREATING A NEW ITEM (POST) ---
    if (req.method === 'POST') {
        const { name, description, default_price } = req.body;

        const limitCheck = await checkUserLimit(supabase, session?.user.id, 'add_item');

        if (!limitCheck.allowed) {
            // Return 402 (Payment Required) so the frontend knows to show the Pricing Modal
            return res.status(402).json({ message: limitCheck.message });
        }

        if (!name) {
            return res.status(400).json({ message: 'Item name is required.' });
        }

        const { data, error } = await supabase
            .from('items')
            .insert({
                user_id: session.user.id,
                name,
                description,
                default_price: default_price || 0,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating item:", error);
            return res.status(500).json({ message: 'Error creating item', error });
        }

        return res.status(201).json(data);
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}