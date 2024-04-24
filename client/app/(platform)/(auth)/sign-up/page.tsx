import type { Metadata } from "next"

import { NO_INDEX_PAGE } from "@/config/site"

import { Register } from "./register"

export const metadata: Metadata = {
	title: "Sign Up",
	...NO_INDEX_PAGE
}

export default function SignUpPage() {
	return (
		<div className="flex w-full h-screen">
			<div className="w-full lg:w-1/2 md:w-1/2 flex items-center justify-center">
				<Register />
			</div>

			<div className="hidden relative lg:flex bg-neutral-100 w-1/2 h-full items-center justify-center">
				<div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce" />
				<div className="w-full h-1/2 bg-white/10 backdrop-blur-lg absolute bottom-0" />
			</div>
		</div>
	)
}
