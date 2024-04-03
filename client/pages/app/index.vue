<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
})

const { $api } = useNuxtApp()

const { data } = useQuery({
	queryKey: ['user'],
	queryFn: () => $api.user.getProfile(),
})
</script>

<template>
	<div>
		<div v-if="data">{{ data.user.email }}</div>
		<div v-else>None</div>
	</div>
</template>
