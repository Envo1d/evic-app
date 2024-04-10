<template>
	<div
		class="grid min-h-screen 2xl:grid-cols-[1.1fr_6fr] grid-cols-[1.2fr_6fr]"
	>
		<UiSidebar v-if="route.fullPath.includes('/app')" />

		<main class="p-6 overflow-x-hidden max-h-screen relative">
			<UiHeader />
			<slot />
		</main>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
