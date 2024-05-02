import { NextRequest, NextResponse } from "next/server"

import { DASHBOARD_PAGES } from "./config/pages-url.config"
import { EnumToken } from "./repository/modules/token.module"

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request

	const refreshToken = cookies.get(EnumToken.REFRESH_TOKEN)

	const isAuthPage = url.includes("/sign-in") || url.includes("/sign-up")

	//TODO: to env
	const isLandingPage = url === "http://localhost:3000/"

	if (isAuthPage && refreshToken)
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))

	if (isAuthPage) return NextResponse.next()

	if (isLandingPage && refreshToken)
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, url))

	if (isLandingPage) return NextResponse.next()

	if (!refreshToken) {
		return NextResponse.redirect(new URL("/sign-in", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		"/:path",
		"/team/:path*",
		"/sign-in/:path",
		"/sign-up/:path",
		"/team-selection/:path"
	]
}
