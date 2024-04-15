<template>
	<div class="absolute top-9 right-9">
		<GenDropdownMenu>
			<GenDropdownMenuTrigger>
				<div v-if="!isLoading" class="flex items-center">
					<div class="text-right mr-3">
						<p class="font-bold -mb-1">
							{{ data?.user.nickname }}
						</p>
						<div v-if="data?.user.firstName" class="flex justify-between">
							<p v-if="data?.user.firstName" class="text-sm opacity-40">
								{{ data?.user.firstName }}
							</p>
							<p v-if="data?.user.lastName" class="text-sm opacity-40">
								{{ data?.user.lastName }}
							</p>
						</div>
						<p class="text-sm opacity-40">
							{{ data?.user.email }}
						</p>
					</div>

					<div
						class="w-10 h-10 flex justify-center items-center text-2xl text-foreground bg-white/20 rounded uppercase border border-primary"
					>
						{{
							data?.user.nickname?.charAt(0) ||
							data?.user.firstName?.charAt(0) ||
							data?.user.email.charAt(0)
						}}
					</div>
				</div>
			</GenDropdownMenuTrigger>
			<GenDropdownMenuContent class="w-56">
				<GenDropdownMenuItem>
					<Settings class="mr-2 h-4 w-4" />
					<NuxtLink to="/app/settings">Settings</NuxtLink>
					<GenDropdownMenuShortcut>⌘S</GenDropdownMenuShortcut>
				</GenDropdownMenuItem>
				<GenDropdownMenuSeparator />
				<GenDropdownMenuItem @click="mutate()">
					<LogOut class="mr-2 h-4 w-4" />
					<span>Log out</span>
					<GenDropdownMenuShortcut>⇧⌘Q</GenDropdownMenuShortcut>
				</GenDropdownMenuItem>
			</GenDropdownMenuContent>
		</GenDropdownMenu>
	</div>
</template>

<script setup lang="ts">
import { LogOut, Settings } from 'lucide-vue-next'

const { $api } = useNuxtApp()
const { push } = useRouter()

const { data, isLoading } = useQuery({
	queryKey: ['profile'],
	queryFn: () => $api.user.getProfile(),
})

const { mutate } = useMutation({
	mutationKey: ['logout'],
	mutationFn: () => $api.auth.logout(),
	onSuccess: () => {
		push('/auth')
	},
})
</script>
