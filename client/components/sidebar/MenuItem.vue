<template>
	<div>
		<NuxtLink
			:to="link"
			class="flex gap-2.5 items-center py-1.5 mt-2 px-9 transition-colors hover:bg-primary rounded-lg"
		>
			{{ icon }}
			<span>{{ name }}</span>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps({
	link: String,
	icon: Icon,
	name: String,
})
</script>
