/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const locales = ['zh-CN','zh-TW','en','ja','ko','es','fr','de','ru']
const defaultLocale = 'zh-CN'

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  defaultLocale,
  locales,
  alternateRefs: locales.map((lng) => ({ href: `${siteUrl}/${lng}`, hreflang: lng })),
  transform: async (config, path) => {
    // Inject alternateRefs for each localized path
    const entries = []
    for (const lng of locales) {
      const loc = path === '/' ? `/${lng}` : `/${lng}${path}`
      entries.push({
        loc,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString(),
        alternateRefs: locales.map((l) => ({ href: `${siteUrl}/${l}${path === '/' ? '' : path}`, hreflang: l })),
      })
    }
    return entries
  },
}



