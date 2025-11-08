
import { GetServerSideProps } from 'next';

const Sitemap = () => {
  // This component will not be rendered, as we are returning a sitemap.xml file
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://sheet2bill.com/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>https://sheet2bill.com/pricing</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>https://sheet2bill.com/login</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>https://sheet2bill.com/signup</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>https://sheet2bill.com/privacy-policy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>https://sheet2bill.com/term-condition</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
       <url>
        <loc>https://sheet2bill.com/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>

        <url>
        <loc>https://sheet2bill.com/blog/freelance-invoice-essentials</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>

         <url>
        <loc>https://sheet2bill.com/blog/stop-sending-invoice</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>

        <url>
        <loc>https://sheet2bill.com/blog/ways-to-bill</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
