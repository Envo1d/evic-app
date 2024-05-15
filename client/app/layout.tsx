import type { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"

import { siteConfig } from "@/config/site"

import "./globals.scss"

const lato = Nunito_Sans({
	subsets: ["latin"],
	weight: ["200", "1000", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`
	},
	description: siteConfig.description,
	icons: [
		{
			url: "/logo.svg",
			href: "/logo.svg"
		}
	]
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={lato.className}>{children}</body>
		</html>
	)
}
