import { NextRequest, NextResponse } from 'next/server'

import { DASHBOARD_PAGES } from './config/pages-url.config'
import { EnumToken } from './repository/modules/token.module'

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request

	const refreshToken = cookies.get(EnumToken.REFRESH_TOKEN)

	const isAuthPage = url.includes('/auth')

	if (isAuthPage && refreshToken)
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))

	if (isAuthPage) return NextResponse.next()

	if (!refreshToken) {
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/app/:path*', '/auth/:path']
}
