import type { PropsWithChildren } from "react"

import { Footer } from "./_components/footer"
import { Navbar } from "./_components/navbar"

export default function MarketingLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<div className="h-full bg-slate-100">
			<Navbar />
			<main className="pt-40 pb-20 bg-slate-100">{children}</main>
			<Footer />
		</div>
	)
}
