<template>
	<aside
		class="border-r border-r-border h-full bg-white/5 flex flex-col justify-between"
	>
		<div>
			<NuxtLink
				to="/"
				class="flex items-center gap-2.5 p-11 border-b border-b-border"
			>
				<GanttChartSquare class="text-primary" :size="38" />
				<span class="text-2xl font-bold relative">
					Evic
					<span
						class="absolute -top-1 -right-6 text-xs opacity-40 rotate-[18deg] font-normal"
					>
						beta
					</span>
				</span>
			</NuxtLink>
			<div class="p-3 relative">
				<SidebarMenuItem link="/app" name="Dashboard" />
				<SidebarMenuItem link="/app/tasks" name="Tasks" />
				<SidebarMenuItem link="/app/timer" name="Pomodoro" />
				<SidebarMenuItem link="/app/time-blocking" name="Time blocking" />
			</div>
		</div>
		<footer class="text-xs opacity-40 font-normal text-center p-11">
			2024 &copy; With love from{{ ' ' }}
			<a
				href="https://github.com/Envo1d"
				target="_blank"
				rel="noreferrer"
				class="hover:text-foreground/90 text-indigo-500 transition-colors"
			>
				Envoid
			</a>
			. <br />
			All rights reserved.
		</footer>
	</aside>
</template>

<script setup lang="ts">
import { GanttChartSquare } from 'lucide-vue-next'
</script>
