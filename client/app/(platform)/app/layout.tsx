import type { PropsWithChildren } from "react"

import { Navbar } from "./_components/navbar"

export default function AppLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="h-full">
			<Navbar />
			{children}
		</div>
	)
}
