import { Plus } from "lucide-react"

import { Logo } from "@/components/logo"
import { Profile } from "@/components/profile"
import { Button } from "@/components/ui/button"

export function Navbar() {
	return (
		<nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
			<div className="flex items-center gap-x-4">
				<div className="hidden md:flex">
					<Logo />
				</div>
				<Button
					variant="primary"
					size="sm"
					className="rounded-cm hidden md:block h-auto py-1.5 px-2"
				>
					Create
				</Button>
				<Button
					variant="primary"
					className="rounded-sm block md:hidden"
					size="sm"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			<div className="ml-auto flex items-center gap-x-2">
				<p>Organization switcher</p>
				<Profile />
			</div>
		</nav>
	)
}
