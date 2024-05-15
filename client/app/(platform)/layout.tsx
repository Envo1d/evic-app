import type { PropsWithChildren } from "react"

import { Toaster } from "@/components/ui/sonner"

import { TanstackQueryClientProvider } from "@/providers/query-client.provider"

export default function PlatformLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryClientProvider>
			{children}
			<Toaster />
		</TanstackQueryClientProvider>
	)
}
