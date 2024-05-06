"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

import { useAppStore } from "@/providers/store-provider"

import {
	ITeamDeleteInviteForm,
	ITeamInvitationsTable
} from "@/types/team.types"
import { IUser } from "@/types/user.types"

import api from "@/api"

export function InvitationsTable() {
	const { activeTeamId } = useAppStore(state => state)

	const {
		data: invitations,
		refetch,
		isLoading
	} = useQuery({
		queryKey: ["invitations"],
		queryFn: () => api.team.getTeamInvitations(activeTeamId)
	})

	const { mutate: invite } = useMutation({
		mutationKey: ["invite user"],
		mutationFn: () =>
			api.team.inviteMember({
				teamId: activeTeamId,
				candidateEmail: searchData
			}),
		onSuccess(res) {
			toast.success(`${searchData} invited!`)
			refetch()
		}
	})

	const { mutate: deleteInv } = useMutation({
		mutationKey: ["delete invite"],
		mutationFn: (data: ITeamDeleteInviteForm) => api.team.deleteInvite(data),
		onSuccess() {
			refetch()
		}
	})

	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [data, setData] = useState<ITeamInvitationsTable[]>([])
	const [searchData, setSearchData] = useState<string>("")

	const columns: ColumnDef<ITeamInvitationsTable>[] = [
		{
			accessorKey: "candidate",
			header: "Candidate",
			cell: ({ row }) => {
				const data: IUser = row.getValue("candidate")

				return (
					<div className="flex flex-row items-center gap-x-1.5">
						<Avatar>
							<AvatarImage src="/default" />
							<AvatarFallback className="bg-violet-500 text-white font-medium text-xl capitalize">
								{data?.nickname?.charAt(0) ||
									data?.firstName?.charAt(0) ||
									data?.email.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-row items-center gap-x-1">
							<p className="font-semibold text-base">
								{data?.nickname ||
									(data.firstName && `${data?.firstName} ${data?.lastName}`) ||
									data?.email}
							</p>
						</div>
					</div>
				)
			}
		},
		{
			accessorKey: "invitationId",
			header: "Invitation Id",
			cell: ({ row }) => {
				const data: string = row.getValue("invitationId")

				return (
					<div className="flex flex-row items-center gap-x-1.5">{data}</div>
				)
			}
		},
		{
			id: "actions",
			header: "Actions",
			enableHiding: false,
			cell: ({ row }) => {
				const id: string = row.getValue("invitationId")
				const candidate: IUser = row.getValue("candidate")

				return (
					<div>
						<Button
							variant="destructive"
							onClick={() =>
								deleteInv({
									teamId: activeTeamId,
									invitationId: id,
									candidateId: candidate.id
								})
							}
						>
							Delete
						</Button>
					</div>
				)
			}
		}
	]

	useEffect(() => {
		if (!isLoading && invitations) {
			const items: ITeamInvitationsTable[] = invitations.map(item => ({
				invitationId: item.id,
				candidateId: item.candidateId,
				candidate: {
					id: item.candidate?.id,
					email: item.candidate?.email,
					nickname: item.candidate?.nickname,
					firstName: item.candidate?.firstName,
					lastName: item.candidate?.lastName,
					avatarPath: item.candidate?.avatarPath
				}
			}))
			setData([...items])
		}
	}, [invitations])

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}
	})

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<Input
					placeholder="Find user..."
					value={searchData}
					onChange={event => setSearchData(event.target.value)}
					className="max-w-sm"
				/>
				<Button
					className="ml-3"
					variant="primary"
					disabled={searchData.length <= 0}
					onClick={() => invite()}
				>
					Invite
				</Button>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
