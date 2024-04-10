<script lang="ts" setup>
import { Label } from '@/components/gen/label'
import { cn } from '@/lib/utils'
import type { LabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { useFormField } from './useFormField'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const { error, formItemId } = useFormField()
</script>

<template>
	<Label :class="cn(error && 'text-red-700', props.class)" :for="formItemId">
		<slot />
	</Label>
</template>
