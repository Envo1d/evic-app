"use client"

import { ClipboardList, HelpCircle, User2, UserRound } from "lucide-react"
import Link from "next/link"

import { FormPopover } from "@/components/form-popover"
import { Hint } from "@/components/hint"
import { Skeleton } from "@/components/ui/skeleton"

import { useProjectsList } from "@/hooks/projects"
import { useGetActiveTeam } from "@/hooks/teams"

export function BoardList() {
	const { data: team } = useGetActiveTeam()
	const { data: projects, isLoading } = useProjectsList()

	return (
		<div className="space-y-4">
			<div className="flex items-center font-semibold text-lg text-neutral-700">
				<User2 className="h-6 w-6 mr-2" /> Your boards
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
				{projects?.map(board => (
					<Link
						key={board.id}
						href={`/board/${board.id}`}
						className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
						style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
					>
						<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
						<div className="flex flex-col justify-between h-full w-full">
							<p className="relative font-semibold text-white">{board.name}</p>
							<div className="flex flex-row justify-between text-white font-semibold">
								<span className="flex flex-row">
									<UserRound className="mr-1.5" />
									<p>{board.members?.length}</p>
								</span>
								<span className="flex flex-row">
									<ClipboardList className="mr-1.5" />
									<p>{board.tasks?.length}</p>
								</span>
							</div>
						</div>
					</Link>
				))}
				<FormPopover
					sideOffset={10}
					side="right"
					teamId={team?.activeTeamId!}
					teamMemberId={team?.activeTeamMemberId!}
				>
					<div
						role="button"
						className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
					>
						<p className="text-sm font-semibold">Create new board</p>
						<span className="text-xs">5 remaining</span>
						<Hint
							sideOffset={40}
							description={`Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this team`}
						>
							<HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
						</Hint>
					</div>
				</FormPopover>
			</div>
		</div>
	)
}

BoardList.Skeleton = function SkeletonBoardList() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols gap-4">
			<Skeleton className="aspect-video h-full w-full p-2" />
			<Skeleton className="aspect-video h-full w-full p-2" />
			<Skeleton className="aspect-video h-full w-full p-2" />
			<Skeleton className="aspect-video h-full w-full p-2" />
			<Skeleton className="aspect-video h-full w-full p-2" />
			<Skeleton className="aspect-video h-full w-full p-2" />
			<Skeleton className="aspect-video h-full w-full p-2" />
			<Skeleton className="aspect-video h-full w-full p-2" />
		</div>
	)
}
