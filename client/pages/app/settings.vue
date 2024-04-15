<template>
	<div>
		<UiHeading title="Settings" />
		<div>
			<form @submit="onSubmit" class="form">
				<div class="grid grid-cols-2 gap-10">
					<div class="flex flex-col gap-y-8">
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

						<GenFormField v-slot="{ componentField }" name="nickname">
							<GenFormItem v-auto-animate>
								<GenFormLabel class="text-base">Nickname</GenFormLabel>
								<GenFormControl>
									<GenInput
										type="text"
										placeholder="Nickname"
										v-bind="componentField"
									/>
								</GenFormControl>
								<GenFormMessage />
							</GenFormItem>
						</GenFormField>

						<GenFormField v-slot="{ componentField }" name="firstName">
							<GenFormItem v-auto-animate>
								<GenFormLabel class="text-base">First name</GenFormLabel>
								<GenFormControl>
									<GenInput
										type="text"
										placeholder="First name"
										v-bind="componentField"
									/>
								</GenFormControl>
								<GenFormMessage />
							</GenFormItem>
						</GenFormField>

						<GenFormField v-slot="{ componentField }" name="lastName">
							<GenFormItem v-auto-animate>
								<GenFormLabel class="text-base">Last name</GenFormLabel>
								<GenFormControl>
									<GenInput
										type="text"
										placeholder="Last name"
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

					<div class="flex flex-col gap-y-8">
						<GenFormField v-slot="{ componentField }" name="workInterval">
							<GenFormItem v-auto-animate>
								<GenFormLabel class="text-base"
									>Work interval (min)</GenFormLabel
								>
								<GenFormControl>
									<GenInput
										type="number"
										placeholder="Work interval (min)"
										v-bind="componentField"
									/>
								</GenFormControl>
								<GenFormMessage />
							</GenFormItem>
						</GenFormField>

						<GenFormField v-slot="{ componentField }" name="breakInterval">
							<GenFormItem v-auto-animate>
								<GenFormLabel class="text-base"
									>Break interval (min)</GenFormLabel
								>
								<GenFormControl>
									<GenInput
										type="number"
										placeholder="Break interval (min)"
										v-bind="componentField"
									/>
								</GenFormControl>
								<GenFormMessage />
							</GenFormItem>
						</GenFormField>

						<GenFormField v-slot="{ componentField }" name="intervalsCount">
							<GenFormItem v-auto-animate>
								<GenFormLabel class="text-base"
									>Intervals count (max 10)</GenFormLabel
								>
								<GenFormControl>
									<GenInput
										type="number"
										placeholder="Intervals count (max 10)"
										v-bind="componentField"
									/>
								</GenFormControl>
								<GenFormMessage />
							</GenFormItem>
						</GenFormField>
					</div>
				</div>

				<GenButton
					class="mt-5"
					type="submit"
					:disabled="isPending"
					variant="outline"
					>Save</GenButton
				>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
})

import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { toTypedSchema } from '@vee-validate/valibot'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import type { TypeUserForm } from '~/types/user.types'

const { $api } = useNuxtApp()
const queryClient = useQueryClient()
const { handleSubmit, resetForm } = useForm<TypeUserForm>({
	validationSchema: toTypedSchema($api.user.settingsValidationSchema),
})

const { data: queryData, isSuccess } = useQuery({
	queryKey: ['profile'],
	queryFn: () => $api.user.getProfile(),
})

const { mutate, isPending } = useMutation({
	mutationKey: ['update profile'],
	mutationFn: (data: TypeUserForm) => $api.user.update(data),
	onSuccess(data) {
		toast.success('Successfully update profile!')
		queryClient.invalidateQueries({ queryKey: ['profile'] })
		resetForm({
			values: {
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
				nickname: data.nickname,
				breakInterval: data.breakInterval,
				intervalsCount: data.intervalsCount,
				workInterval: data.workInterval,
			},
		})
	},
})

const onSubmit = handleSubmit(data => {
	const { password, ...rest } = data

	mutate({
		...rest,
		password: password || undefined,
	})
})

watch(
	isSuccess,
	() => {
		if (isSuccess.value === true && queryData) {
			resetForm({
				values: {
					email: queryData.value?.user.email,
					firstName: queryData.value?.user.firstName,
					lastName: queryData.value?.user.lastName,
					nickname: queryData.value?.user.nickname,
					breakInterval: queryData.value?.user.breakInterval,
					intervalsCount: queryData.value?.user.intervalsCount,
					workInterval: queryData.value?.user.workInterval,
				},
			})
		}
	},
	{
		immediate: true,
	}
)
</script>
