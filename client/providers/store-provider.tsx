"use client"

import { type ReactNode, createContext, useContext, useRef } from "react"
import { type StoreApi, useStore } from "zustand"

import { AppStore, createAppStore } from "@/stores/app-store"

export const AppStoreContext = createContext<StoreApi<AppStore> | null>(null)

export interface AppStoreProviderProps {
	children: ReactNode
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
	const storeRef = useRef<StoreApi<AppStore>>()
	if (!storeRef.current) {
		storeRef.current = createAppStore()
	}

	return (
		<AppStoreContext.Provider value={storeRef.current}>
			{children}
		</AppStoreContext.Provider>
	)
}

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
	const appStoreContext = useContext(AppStoreContext)

	if (!appStoreContext) {
		throw new Error(`useAppStore must be use within AppStoreProvider`)
	}

	return useStore(appStoreContext, selector)
}
