import { Building, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { useAppStore } from "@/providers/store-provider"

interface ITeamCard {
	name: string
	id: string
}

export function TeamCard({ name, id }: ITeamCard) {
	const { setActiveTeamId } = useAppStore(state => state)

	const { push } = useRouter()

	const click = () => {
		setActiveTeamId(id)
		push("/team")
	}

	return (
		<div className="bg-slate-100 p-2 rounded-lg shadow-md hover:translate-x-1 hover:bg-slate-200 transition-all flex flex-row justify-between items-center hover:shadow-xl mb-3">
			<Building
				className="bg-gradient-to-tr from-violet-500 to-blue-500 w-11 h-11 rounded-md p-1 text-white"
				size={35}
			/>
			<p className="font-semibold">{name}</p>
			<ChevronRight
				className="rounded-full hover:bg-white hover:opacity-100 opacity-40 cursor-pointer transition-all"
				onClick={() => click()}
			/>
		</div>
	)
}
