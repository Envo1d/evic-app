<template>
	<div v-if="isFetching || isMutating" class="fixed top-2 right-10 z-50">
		<UiLoader />
	</div>
</template>

<script setup lang="ts">
import { useIsFetching, useIsMutating } from '@tanstack/vue-query'

const isMutating = useIsMutating()
const isFetching = useIsFetching()
</script>
