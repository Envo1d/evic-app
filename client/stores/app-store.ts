import { persist } from "zustand/middleware"
import { createStore } from "zustand/vanilla"

export type StoreState = {
	activeTeamId: string
}

export type StoreActions = {
	setActiveTeamId: (id: string) => void
}

export type AppStore = StoreState & StoreActions

export const createAppStore = () => {
	return createStore<AppStore>()(
		persist(
			set => ({
				activeTeamId: "0",
				setActiveTeamId: (id: string) => set({ activeTeamId: id })
			}),
			{
				name: "app-state"
			}
		)
	)
}
