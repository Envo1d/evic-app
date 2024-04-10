<script setup lang="ts">
defineProps({
	label: String,
	value: Number,
})
</script>

<template>
	<div class="wrapper">
		<div class="text-xl">{{ label }}</div>
		<div class="text-3xl font-semibold">{{ value }}</div>
	</div>
</template>

<style lang="postcss">
.wrapper {
	@apply bg-primary/25 rounded px-1 py-6 text-center hover:-translate-y-3 transition-transform duration-500;
}
</style>
