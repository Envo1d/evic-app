import { NextRequest, NextResponse } from "next/server"

import { DASHBOARD_PAGES } from "./config/pages-url.config"
import { EnumToken } from "./repository/modules/token.module"

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies, headers, nextUrl } = request

	const requestHeaders = new Headers(headers)
	requestHeaders.set("x-next-pathname", nextUrl.pathname)

	const refreshToken = cookies.get(EnumToken.REFRESH_TOKEN)

	const isAuthPage = url.includes("/sign-in") || url.includes("/sign-up")

	const isLandingPage =
		!url.includes("/sign-in") &&
		!url.includes("/sign-up") &&
		!url.includes("/team") &&
		!url.includes("/board") &&
		!url.includes("/team-selection")

	if (isAuthPage && refreshToken)
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))

	if (isAuthPage)
		return NextResponse.next({
			request: {
				headers: requestHeaders
			}
		})

	if (isLandingPage && refreshToken)
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))

	if (!refreshToken) {
		if (isLandingPage)
			return NextResponse.next({
				request: {
					headers: requestHeaders
				}
			})
		return NextResponse.redirect(new URL("/sign-in", request.url))
	}

	return NextResponse.next({
		request: {
			headers: requestHeaders
		}
	})
}

export const config = {
	matcher: [
		"/:path",
		"/team/:path*",
		"/sign-in/:path",
		"/sign-up/:path",
		"/board/:path",
		"/team-selection/:path"
	]
}
