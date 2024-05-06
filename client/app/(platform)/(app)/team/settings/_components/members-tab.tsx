"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { InvitationsTable } from "./invitations-table"
import { MembersTable } from "./members-table"

export function MembersTab() {
	return (
		<Tabs
			defaultValue="members"
			className="w-full"
		>
			<TabsList className="flex flex-row items-start justify-start gap-x-5 bg-transparent">
				<TabsTrigger
					value="members"
					className="text-lg"
				>
					Members
				</TabsTrigger>
				<TabsTrigger
					value="invitations"
					className="text-lg"
				>
					Invitations
				</TabsTrigger>
			</TabsList>
			<Separator className="mt-1" />
			<TabsContent value="members">
				<MembersTable />
			</TabsContent>
			<TabsContent value="invitations">
				<InvitationsTable />
			</TabsContent>
		</Tabs>
	)
}
