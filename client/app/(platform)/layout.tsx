import type { PropsWithChildren } from "react"

import { Providers } from "./providers"

export default function PlatformLayout({
	children
}: PropsWithChildren<unknown>) {
	return <Providers>{children}</Providers>
}
