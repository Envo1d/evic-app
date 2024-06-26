"use client"

import { useMutation } from "@tanstack/react-query"
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { FetchError } from "ofetch"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

import {
	ITeamMember,
	ITeamMemberTableData,
	ITeamRemoveMemberForm,
	ITeamRoleResponse
} from "@/types/team.types"

import { useTeam, useTeamRoles, useUpdateMemberRole } from "@/hooks/teams"
import { useProfile } from "@/hooks/useProfile"

import api from "@/api"

export function MembersTable() {
	const [sorting, setSorting] = useState<SortingState>([])

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const { data: teamData, refetch } = useTeam()
	const { data: profile } = useProfile()

	const { mutate: deleteMember } = useMutation({
		mutationKey: ["delete team member"],
		mutationFn: (data: ITeamRemoveMemberForm) => api.team.removeMember(data),
		onSuccess() {
			refetch()
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	const { roles } = useTeamRoles()
	const { updateMemberRole, isError } = useUpdateMemberRole()

	const [data, setData] = useState<ITeamMemberTableData[]>([])

	const columns: ColumnDef<ITeamMemberTableData>[] = [
		{
			accessorKey: "user",
			header: "User",
			filterFn: (row, columnId, value: string) => {
				const data: ITeamMember = row.getValue("user")

				const res =
					data.email.includes(value.toLowerCase()) ||
					data.nickname?.toLowerCase().includes(value.toLowerCase()) ||
					data.firstName?.toLowerCase().includes(value.toLowerCase()) ||
					data.lastName?.toLowerCase().includes(value.toLowerCase())

				if (res === undefined) return false
				return res
			},
			cell: ({ row }) => {
				const data: ITeamMember = row.getValue("user")

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
						<div className="flex flex-row items-center gap-x-3 w-full">
							<div className="flex flex-col gap-y-px">
								{data.email && data.lastName && (
									<p className="font-semibold text-base">
										{data?.firstName} {data?.lastName}
									</p>
								)}
								<p className="font-light text-sm">{data?.email}</p>
								{data.nickname && <p className="">{data?.nickname}</p>}
							</div>
							{profile && data.id === profile.id && (
								<Badge
									className="cursor-default w-11 h-1/3 pointer-events-none"
									variant="primary"
								>
									you
								</Badge>
							)}
						</div>
					</div>
				)
			}
		},
		{
			accessorKey: "joined",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Joined
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => {
				const data = new Date(row.getValue("joined")).toLocaleDateString()

				return <div className="cursor-default">{data}</div>
			}
		},
		{
			accessorKey: "role",
			header: () => <div className="text-right">Role</div>,
			cell: ({ row }) => {
				const data: ITeamRoleResponse = row.getValue("role")
				const [role, setRole] = useState(data.id)
				const user: ITeamMember = row.getValue("user")

				const onValueChanged = (value: string) => {
					setRole(value)
					updateMemberRole({
						roleId: value,
						memberId: user.memberId!
					})
				}

				return (
					<div className="flex justify-end">
						<Select
							value={role}
							onValueChange={val => onValueChanged(val)}
						>
							<SelectTrigger className="w-46">
								<SelectValue
									placeholder="Select role"
									defaultValue={role}
								/>
							</SelectTrigger>
							<SelectContent>
								{roles?.map(item => (
									<SelectItem value={item.id}>{item.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)
			}
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const data: ITeamMember = row.getValue("user")

				if (data.id !== profile?.id && teamData?.creatorId !== data.id)
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="h-8 w-8 p-0"
								>
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() =>
										deleteMember({
											memberId: data.memberId!
										})
									}
								>
									Delete member
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)
			}
		}
	]

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

	useEffect(() => {
		refetch()
		if (teamData !== undefined) {
			const members = teamData?.members?.map(member => ({
				user: {
					id: member.user.id,
					email: member.user.email,
					nickname: member.user.nickname,
					firstName: member.user.firstName,
					lastName: member.user.lastName,
					avatarPath: member.user.avatarPath,
					memberId: member.id
				},
				joined: member.createdAt,
				role: {
					id: member.role.id,
					name: member.role.name
				}
			}))
			if (members) setData([...members])
		}
	}, [teamData])

	useEffect(() => {
		if (isError) {
			table.reset()
		}
	}, [isError])

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter users..."
					value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("user")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="ml-auto"
						>
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={value => column.toggleVisibility(!!value)}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
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
