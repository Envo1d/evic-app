<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	layout: false,
})

import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { toTypedSchema } from '@vee-validate/valibot'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import type { IAuthForm } from '~/types/auth.types'

const isLogin = ref(true)

const { $api } = useNuxtApp()
const { push } = useRouter()

const { errors, defineField, handleSubmit, resetForm } = useForm<IAuthForm>({
	validationSchema: toTypedSchema($api.auth.validationSchema),
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const { mutate } = useMutation({
	mutationKey: ['auth'],
	mutationFn: (data: IAuthForm) =>
		$api.auth.main(isLogin ? 'login' : 'register', data),
	onSuccess() {
		resetForm()
		toast.success('Successful login!')
		push('/app')
	},
})

const onSubmit = handleSubmit(data => {
	mutate(data)
})
const changeForm = () => {
	isLogin.value = !isLogin.value
	resetForm()
}
</script>

<template>
	<div class="wrapper">
		<form @submit="onSubmit" class="form">
			<UiHeading :title="isLogin ? 'Login' : 'Register'" class="mb-9" />
			<div class="field-wrapper">
				<GenFormField v-slot="{ componentField }" name="email">
					<GenFormItem v-auto-animate>
						<GenFormLabel class="text-base">Email</GenFormLabel>
						<GenFormControl>
							<GenInput
								type="email"
								placeholder="Email"
								v-bind="componentField"
							/>
						</GenFormControl>
						<GenFormMessage />
					</GenFormItem>
				</GenFormField>
				<GenFormField v-slot="{ componentField }" name="password">
					<GenFormItem v-auto-animate>
						<GenFormLabel class="text-base">Password</GenFormLabel>
						<GenFormControl>
							<GenInput
								type="password"
								placeholder="Password"
								v-bind="componentField"
							/>
						</GenFormControl>
						<GenFormMessage />
					</GenFormItem>
				</GenFormField>
			</div>
			<div class="buttons-wrapper">
				<GenButton
					type="submit"
					size="sm"
					class="text-base p-5"
					variant="outline"
					>Submit</GenButton
				>
				<div class="flex flex-row">
					<small class="mr-3 text-sm mt-2.5">{{
						isLogin ? "Don't have an account?" : 'Already have an account?'
					}}</small>
					<GenButton
						variant="ghost"
						size="sm"
						@click="changeForm"
						class="mt-0.5 text-primary"
					>
						{{ isLogin ? 'Register' : 'Login' }}
					</GenButton>
				</div>
			</div>
		</form>
	</div>
</template>

<style lang="postcss" scoped>
.wrapper {
	@apply flex min-h-screen;
}

.form {
	@apply w-1/4 m-auto bg-background border border-primary rounded-xl p-9;
}

.field-wrapper {
	@apply flex flex-col justify-center gap-7 mb-5;
}

.buttons-wrapper {
	@apply flex flex-col items-center gap-5 justify-center mt-10;
}

.password-suggestion-list {
	@apply pl-2 ml-2 mt-0 leading-5 list-disc;
}
</style>
