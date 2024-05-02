import type { PropsWithChildren } from "react"

import { TanstackQueryClientProvider } from "@/providers/query-client.provider"
import { AppStoreProvider } from "@/providers/store-provider"

export default function PlatformLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryClientProvider>
			<AppStoreProvider>{children}</AppStoreProvider>
		</TanstackQueryClientProvider>
	)
}
