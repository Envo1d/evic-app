<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
})

const { $api } = useNuxtApp()

const { data, isLoading } = useQuery({
	queryKey: ['profile'],
	queryFn: () => $api.user.getProfile(),
})
</script>

<template>
	<div v-if="!isLoading">
		<UiHeading title="Statistics" />
		<div class="grid grid-cols-4 gap-12 mt-7">
			<div
				v-if="data?.statistics.length"
				v-for="item in data.statistics"
				:key="item.label"
			>
				<UiStatisticBlock :label="item.label" :value="item.value" />
			</div>
			<div v-else>Statistics not loaded!</div>
		</div>
	</div>
</template>
