import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Make changes to your account here. Click save when you're done.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								defaultValue="Pedro Duarte"
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								defaultValue="@peduarte"
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save changes</Button>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="invitations">
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>
							Change your password here. After saving, you'll be logged out.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="current">Current password</Label>
							<Input
								id="current"
								type="password"
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor="new">New password</Label>
							<Input
								id="new"
								type="password"
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save password</Button>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
