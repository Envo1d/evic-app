<template>
	<header>
		<UiGlobalLoader />
		<div class="flex flex-row justify-between p-3">
			<HeaderThemeToggler v-if="token" />
			<div>
				<HeaderProfile v-if="token" />
				<NuxtLink v-else to="/auth">
					<GenButton variant="ghost">
						<LogIn :size="20" />
						<span class="sr-only">Log In</span>
					</GenButton>
				</NuxtLink>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { LogIn } from 'lucide-vue-next'
const { $api } = useNuxtApp()

const token = $api.token.getAccessToken()
</script>
