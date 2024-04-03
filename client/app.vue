<template>
	<div>
		<NuxtPage />

		<VueQueryDevtools v-if="nodeEnv === 'development'" />
	</div>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

const nodeEnv = useRuntimeConfig().public.node
</script>
