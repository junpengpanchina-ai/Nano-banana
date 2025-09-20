import { NextResponse, type NextRequest } from 'next/server'

const SUPPORTED = ['zh-CN','zh-TW','en','ja','ko','es','fr','de','ru'] as const
const DEFAULT_LOCALE = 'zh-CN'

function negotiate(req: NextRequest): string {
  const header = req.headers.get('accept-language') || ''
  const parts = header.split(',').map(s => s.trim())
  for (const p of parts) {
    const code = p.split(';')[0]
    // normalize e.g. en-US -> en, zh-CN -> zh-CN
    if (SUPPORTED.includes(code as any)) return code
    const short = code.split('-')[0]
    const found = SUPPORTED.find(l => l.toLowerCase().startsWith(short))
    if (found) return found
  }
  return DEFAULT_LOCALE
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Ignore static, api, and already localized paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const hasLocale = SUPPORTED.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (!hasLocale) {
    const locale = negotiate(req)
    const url = req.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}



