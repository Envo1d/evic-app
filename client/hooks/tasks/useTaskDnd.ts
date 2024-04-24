import { DropResult } from '@hello-pangea/dnd'

import { useUpdateTask } from './useUpdateTask'
import { FILTERS } from '@/app/app/tasks/columns.data'

export function useTaskDnd() {
	const { updateTask } = useUpdateTask()

	const onDragEnd = (res: DropResult) => {
		if (!res.destination) return

		const destinationColumnId = res.destination.droppableId

		if (destinationColumnId === res.source.droppableId) return

		if (destinationColumnId === 'completed') {
			updateTask({
				id: res.draggableId,
				data: {
					status: true
				}
			})

			return
		}

		const newCreatedAt = FILTERS[destinationColumnId].format()

		updateTask({
			id: res.draggableId,
			data: {
				createdAt: newCreatedAt,
				status: false
			}
		})
	}

	return { onDragEnd }
}
