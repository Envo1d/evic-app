'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/gen/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/gen/form'
import { Input } from '@/components/gen/input'
import { Heading } from '@/components/ui/Heading'

import { IAuthForm } from '@/types/auth.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import api from '@/api'

export function Auth() {
	const form = useForm<IAuthForm>({
		mode: 'onChange',
		resolver: valibotResolver(api.auth.validationSchema)
	})

	const [parent] = useAutoAnimate()

	const [isLogin, setIsLogin] = useState(true)

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			api.auth.main(isLogin ? 'login' : 'register', data),
		onSuccess() {
			toast.success('Successfully login!')
			form.reset()
			push(DASHBOARD_PAGES.HOME)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	const changeForm = () => {
		setIsLogin(!isLogin)
		form.reset()
	}

	return (
		<div className='flex min-h-screen'>
			<Form {...form}>
				<form
					className='w-1/4 m-auto shadow bg-secondary rounded-xl p-11'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<Heading title={isLogin ? 'Login' : 'Register'} />
					<div className='flex flex-col justify-center gap-5 mb-5 mt-5'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder='Email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex flex-col items-center gap-5 justify-center mt-10'>
						<Button
							type='submit'
							variant='outline'
							size='sm'
							className='text-base p-5'
						>
							Submit
						</Button>
						<div className='flex flex-row'>
							<small className='mr-3 text-sm mt-2.5'>
								{isLogin
									? "Don't have an account?"
									: 'Already have an account?'}
							</small>
							<Button
								variant='ghost'
								size='sm'
								className='mt-0.5 text-primary'
								onClick={() => changeForm()}
							>
								{isLogin ? 'Register' : 'Login'}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}
