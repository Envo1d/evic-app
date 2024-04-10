<script setup lang="ts">
defineProps({
	title: String,
})
</script>

<template>
	<div>
		<h1 class="text-3xl font-medium">{{ title }}</h1>
		<div class="my-3 h-0.5 bg-foreground w-full" />
	</div>
</template>
