"use client"

import { Check, Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { forwardRef, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { UseFormSetValue } from "react-hook-form"

import { InputProps } from "@/components/ui/input"

import { defaultImages } from "@/constants/images"

import { IProjectCreateForm } from "@/types/project.types"

import { unsplash } from "@/lib/unsplash"
import { cn } from "@/lib/utils"

interface PickerProps extends InputProps {
	setPath: UseFormSetValue<IProjectCreateForm>
}

const FormPicker = forwardRef<HTMLInputElement, PickerProps>(
	({ id, className, setPath, ...props }, ref) => {
		const { pending } = useFormStatus()

		const [images, setImages] =
			useState<Array<Record<string, any>>>(defaultImages)
		const [isLoading, setIsLoading] = useState(true)
		const [selectImageId, setSelectedImageId] = useState(null)

		const onClickSetDefault = () => {
			setImages(defaultImages)
		}

		useEffect(() => {
			const fetchImages = async () => {
				try {
					const res = await unsplash.photos.getRandom({
						collectionIds: ["317099"],
						count: 9
					})

					if (res && res.response) {
						const newImages = res.response as Array<Record<string, any>>
						setImages(newImages)
					} else {
						console.error("Failed to get images from unsplash")
					}
				} catch (error) {
					console.error(error)
					setImages(defaultImages)
				} finally {
					setIsLoading(false)
				}
			}

			fetchImages()
		}, [])

		if (isLoading) {
			return (
				<div className="p-6 flex items-center justify-center">
					<Loader className="h-6 w-6 text-sky-700 animate-spin" />
				</div>
			)
		}

		return (
			<div className="relative">
				<div className="grid grid-cols-3 gap-2 mb-2">
					{images.map(img => (
						<div
							className={cn(
								"cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
								pending && "opacity-50 hover:opacity-50 cursor-auto"
							)}
							key={img.id}
							onClick={() => {
								if (pending) return
								setSelectedImageId(img.id)
								setPath(
									"imagePath",
									`${img.id}|${img.urls.thumb}|${img.urls.full}|${img.links.html}|${img.user.name}`
								)
							}}
						>
							<Image
								fill
								alt="Unsplash image"
								className="object-cover rounded-sm"
								src={img.urls.thumb}
							/>
							{selectImageId === img.id && (
								<div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
									<Check className="h-4 w-4 text-white" />
								</div>
							)}
							<Link
								href={img.links.html}
								target="_blank"
								className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
							>
								{img.user.name}
							</Link>
						</div>
					))}
				</div>
				<button
					className="text-xs hover:text-sky-700 transition"
					type="button"
					onClick={() => onClickSetDefault()}
				>
					set defaults
				</button>
			</div>
		)
	}
)

FormPicker.displayName = "FormPicker"

export { FormPicker }
