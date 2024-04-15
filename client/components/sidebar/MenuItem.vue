<template>
	<div>
		<NuxtLink
			:to="link"
			class="flex gap-2.5 items-center py-1.5 mt-2 px-9 transition-colors hover:bg-primary rounded-lg"
		>
			<LayoutDashboard v-if="name === 'Dashboard'" />
			<KanbanSquare v-if="name === 'Tasks'" />
			<Timer v-if="name === 'Timer' || name === 'Pomodoro'" />
			<CalendarRange v-if="name === 'Time blocking'" />
			<span>{{ name }}</span>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import {
	CalendarRange,
	KanbanSquare,
	LayoutDashboard,
	Timer,
} from 'lucide-vue-next'

defineProps({
	link: String,
	name: String,
})
</script>
