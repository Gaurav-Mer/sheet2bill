import { GetServerSidePropsContext } from 'next';

// --- Your Site's Configuration ---

// This is your live, production domain.
const BASE_URL = 'https://www.sheet2bill.com';

// This is a list of all your static, public pages that you want Google to index.
// We are intentionally leaving out all the private app pages like /dashboard, /clients, etc.
interface SitemapEntry {
    path: string;
    priority: string;
    changefreq?: string;
}

const STATIC_PAGES: SitemapEntry[] = [
    { path: '',                             priority: '1.0', changefreq: 'weekly'  },
    { path: 'pricing',                      priority: '0.9', changefreq: 'monthly' },
    { path: 'how-it-works',                 priority: '0.8', changefreq: 'monthly' },
    { path: 'blog',                         priority: '0.8', changefreq: 'weekly'  },
    { path: 'tools/rate-calculator',        priority: '0.8', changefreq: 'monthly' },
    { path: 'tools/contract-generator',     priority: '0.8', changefreq: 'monthly' },
    { path: 'contact-us',                   priority: '0.6', changefreq: 'yearly'  },
    { path: 'privacy-policy',               priority: '0.4', changefreq: 'yearly'  },
    { path: 'terms-of-service',             priority: '0.4', changefreq: 'yearly'  },
    { path: 'refund-policy',                priority: '0.3', changefreq: 'yearly'  },
    { path: 'login',                        priority: '0.5', changefreq: 'yearly'  },
    { path: 'signup',                       priority: '0.6', changefreq: 'yearly'  },
    { path: 'forgot-password',              priority: '0.3', changefreq: 'yearly'  },
];

const BLOG_POSTS: SitemapEntry[] = [
    { path: 'blog/freelance-invoice-essentials', priority: '0.7', changefreq: 'yearly' },
    { path: 'blog/stop-sending-invoice',         priority: '0.7', changefreq: 'yearly' },
    { path: 'blog/ways-to-bill',                 priority: '0.7', changefreq: 'yearly' },
];

// --- End of Configuration ---

/**
 * Generates the sitemap.xml content.
 */
const generateSitemapXml = (pages: SitemapEntry[]) => {
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    pages.forEach(({ path, priority, changefreq }) => {
        const url = path ? `${BASE_URL}/${path}` : BASE_URL;
        xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq ?? 'monthly'}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
    });

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
    const sitemap = generateSitemapXml([...STATIC_PAGES, ...BLOG_POSTS]);

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