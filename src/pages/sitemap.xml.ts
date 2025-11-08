/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSidePropsContext } from 'next';

// --- Your Site's Configuration ---

// This is your live, production domain.
const BASE_URL = 'https://www.sheet2bill.com';

// This is a list of all your static, public pages that you want Google to index.
// We are intentionally leaving out all the private app pages like /dashboard, /clients, etc.
const STATIC_PAGES = [
    '', // This represents the Homepage ('/')
    'pricing',
    'privacy-policy',
    'terms-of-service',
    'login',
    'signup',
    'forgot-password',
    'blog'
];

// --- End of Configuration ---

/**
 * Generates the sitemap.xml content.
 */
const generateSitemapXml = (staticPages: string[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // 1. Add all your static pages (Homepage, Pricing, etc.)
    staticPages.forEach(page => {
        const url = `${BASE_URL}/${page}`;
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    // 2. (Future-Proof) Add dynamic pages, like blog posts
    // When you add a blog, you will fetch your posts and loop through them here.
    // blogPosts.forEach(post => {
    //   xml += `
    //   <url>
    //     <loc>${BASE_URL}/blog/${post.slug}</loc>
    //     <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    //     <priority>0.6</priority>
    //   </url>
    // `;
    // });

    xml += `</urlset>`;
    return xml;
};

/**
 * This is the special Next.js function that runs on the server
 * when a crawler (like Google) requests /sitemap.xml
 */
export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
    // --- Future Step: Fetch your dynamic content here ---
    // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    // const { data: blogPosts } = await supabase.from('blog').select('slug, updated_at');

    // const allBlogPosts: any[] = []; // Placeholder

    // Generate the sitemap XML string
    const sitemap = generateSitemapXml(STATIC_PAGES);

    // Set the response headers to tell the browser it's an XML file.
    res.setHeader('Content-Type', 'text/xml');
    // Send the XML to the browser
    res.write(sitemap);
    res.end();

    // We return an empty props object because this page is not a React component.
    return {
        props: {},
    };
};

// This is just a placeholder export. The real work is done in getServerSideProps.
const SitemapPage = () => { };
export default SitemapPage;