import type { PropsWithChildren } from "react"

export default function AuthLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="h-full flex items-center justify-center">{children}</div>
	)
}
