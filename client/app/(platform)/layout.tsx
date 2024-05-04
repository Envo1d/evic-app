import type { PropsWithChildren } from "react"

import { Toaster } from "@/components/ui/sonner"

import { TanstackQueryClientProvider } from "@/providers/query-client.provider"
import { AppStoreProvider } from "@/providers/store-provider"

export default function PlatformLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryClientProvider>
			<AppStoreProvider>{children}</AppStoreProvider>
			<Toaster />
		</TanstackQueryClientProvider>
	)
}
