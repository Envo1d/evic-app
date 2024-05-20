"use client"

import { useEffect, useState } from "react"

import { CardModal } from "@/components/card-modal"

export function ModalProvider() {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) return null

	return (
		<>
			<CardModal />
		</>
	)
}
