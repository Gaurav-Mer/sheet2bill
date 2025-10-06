import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const ITEMS_PER_PAGE = 15; // Define how many items per page

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end('Method Not Allowed');
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    // --- Read Search & Pagination Parameters from URL ---
    const searchQuery = req.query.q as string || '';
    const page = parseInt(req.query.page as string, 10) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    // --- Build the Supabase Query ---
    let query = supabase
        .from('invoices')
        .select('*, clients(name)', { count: 'exact' }) // Fetch the total count for pagination
        .eq('user_id', session.user.id);

    // Apply search filter if a query is provided
    if (searchQuery) {
        // This searches the invoice_number and we can add more fields
        query = query.ilike('invoice_number', `%${searchQuery}%`);
    }

    // Apply sorting and pagination to the final query
    query = query
        .order('issue_date', { ascending: false })
        .range(startIndex, endIndex);

    // --- Execute the Query ---
    const { data, error, count } = await query;

    if (error) {
        console.error("Error fetching invoices:", error);
        return res.status(500).json({ message: "Error fetching invoices", error });
    }

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

    // --- Return the Paginated Response ---
    return res.status(200).json({
        data: data || [],
        pagination: {
            totalItems: count || 0,
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: ITEMS_PER_PAGE,
        }
    });
}