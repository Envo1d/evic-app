import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GeneralSettings } from "./general-settings"
import { RolesTable } from "./roles-table"

export function SettingsTab() {
	// TODO: add role creation

	return (
		<Tabs
			defaultValue="general"
			className="w-full"
		>
			<TabsList className="flex flex-row items-start justify-start gap-x-5 bg-transparent">
				<TabsTrigger
					value="general"
					className="text-lg"
				>
					General
				</TabsTrigger>
				<TabsTrigger
					value="roles"
					className="text-lg"
				>
					Roles
				</TabsTrigger>
			</TabsList>
			<Separator className="mt-1" />
			<TabsContent value="general">
				<GeneralSettings />
			</TabsContent>
			<TabsContent value="roles">
				<RolesTable />
			</TabsContent>
		</Tabs>
	)
}
