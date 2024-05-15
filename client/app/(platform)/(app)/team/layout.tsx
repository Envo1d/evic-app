import type { PropsWithChildren } from "react"

import { Sidebar } from "./_components/sidebar"

export default function AppLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-2xl mx-auto">
			<div className="flex gap-x-7">
				<div className="w-64 shrink-0 hidden md:block">
					<Sidebar />
				</div>
				{children}
			</div>
		</main>
	)
}
