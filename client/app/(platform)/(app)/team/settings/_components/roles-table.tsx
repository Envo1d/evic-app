"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { AtSign, ChevronDown, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import MultipleSelector, { Option } from "@/components/ui/multiselect"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"

import {
	EnumTeamRights,
	ITeamCreateRoleForm,
	ITeamRoleTableData
} from "@/types/team.types"

import { useCreateRole, useDeleteRole, useTeamRoles } from "@/hooks/teams"

import api from "@/api"
import { cn } from "@/lib/utils"

export function RolesTable() {
	const [sorting, setSorting] = useState<SortingState>([])

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [parent] = useAutoAnimate()

	const selectOptions: Option[] = (
		Object.keys(EnumTeamRights) as Array<keyof typeof EnumTeamRights>
	).map(item => {
		return {
			label: item,
			value: item
		}
	})

	const [selectValue, setSelectValue] = useState<Option[]>([])

	const form = useForm<ITeamCreateRoleForm>({
		mode: "onChange",
		resolver: zodResolver(api.team.createRoleValidationSchema),
		defaultValues: {
			name: "",
			rights: []
		}
	})

	const onSubmit: SubmitHandler<ITeamCreateRoleForm> = data => {
		createRole(data)
		setSelectValue([])
		form.setValue("name", "")
	}

	const { roles } = useTeamRoles()
	const { deleteRole } = useDeleteRole()
	const { createRole } = useCreateRole()

	const [data, setData] = useState<ITeamRoleTableData[]>([])

	const columns: ColumnDef<ITeamRoleTableData>[] = [
		{
			accessorKey: "name",
			header: "Title",
			cell: ({ row }) => {
				const data: string = row.getValue("name")

				return (
					<div className="flex flex-row items-center gap-x-1.5 w-full">
						<AtSign className="w-3 h-3" />
						<p className="cursor-default font-semibold">{data}</p>
					</div>
				)
			}
		},
		{
			accessorKey: "rights",
			enableHiding: true,
			header: "Rights",
			cell: ({ row }) => {
				const rights: EnumTeamRights[] = row.getValue("rights")

				return (
					<div className="flex flex-row items-center gap-x-1.5 w-full">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<p className="cursor-pointer font-semibold">Hover</p>
								</TooltipTrigger>
								<TooltipContent
									className={cn(
										"grid gap-1",
										rights.length > 3
											? "grid-cols-3"
											: rights.length > 1
												? "grid-cols-2"
												: ""
									)}
								>
									{rights.map(item => (
										<Badge
											variant="primary"
											className="pointer-events-none flex items-center justify-center"
											key={item}
										>
											<p>{item}</p>
										</Badge>
									))}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)
			}
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const data: string = row.getValue("name")
				const id = roles?.find(item => item.name === data)?.id!

				if (data !== "Admin" && data !== "Member")
					return (
						<div className="flex justify-end items-end">
							<Button
								variant="destructive"
								className="h-8 w-8 p-0"
								onClick={() => deleteRole(id)}
							>
								<Trash className="h-4 w-4" />
							</Button>
						</div>
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
		initialState: {
			pagination: {
				pageSize: 5
			}
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}
	})

	useEffect(() => {
		if (roles !== undefined) {
			const rolesData: ITeamRoleTableData[] = roles?.map(role => ({
				roleId: role.id,
				name: role.name,
				rights: role.rights
			}))

			if (rolesData) setData(rolesData)
		}
	}, [roles])

	useEffect(() => {
		if (selectValue.length > 0) {
			form.setValue(
				"rights",
				selectValue.map(item => item.value)
			)
		}
	}, [selectValue])

	return (
		<div className="w-full">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="rounded-sm border p-3"
				>
					<div className="flex flex-row justify-between items-center">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="text-xs font-medium">
										Role Name
									</FormLabel>
									<FormControl>
										<Input
											className="rounded-xl p-4 bg-transparent"
											type="text"
											placeholder="Create new role..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="mt-7">Create role</Button>
					</div>
					<FormField
						name="rights"
						render={({ field }) => (
							<FormItem ref={parent}>
								<FormLabel className="text-xs font-medium mt-3">
									Role Rights
								</FormLabel>
								<MultipleSelector
									hidePlaceholderWhenSelected
									placeholder="Select role rights."
									value={selectValue}
									onChange={setSelectValue}
									className="w-full"
									defaultOptions={selectOptions}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter roles..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("name")?.setFilterValue(event.target.value)
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
									className="w-full"
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
