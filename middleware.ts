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
  // 暂时禁用基于中间件的语言重定向，避免开发环境下静态资源404
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}



