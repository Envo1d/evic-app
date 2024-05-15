import type { PropsWithChildren } from "react"

import { Navbar } from "./_componets/navbar"

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="h-full">
			<Navbar />
			{children}
		</div>
	)
}
