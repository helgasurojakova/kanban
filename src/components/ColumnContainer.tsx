import { useMemo, useState } from 'react'
import type { Column, ItemUuid, Task } from '../types/kanban'
import { TaskCard } from './TaskCard'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { COLUMN } from './constants'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  taskList: Task[]
  column: Column
  deleteColumn: (uuid: ItemUuid) => void
  updateColumn: (uuid: ItemUuid, title: string) => void
  deleteTask: (uuid: ItemUuid) => void
  updateTask: (uuid: ItemUuid, content: string) => void
  createTask: (columnUuid: ItemUuid) => void
}

export const ColumnContainer: React.FC<Props> = ({
  taskList,
  column,
  deleteColumn,
  updateColumn,
  createTask,
  updateTask,
  deleteTask,
}) => {
  const [isEditMode, setEditMode] = useState(false)
  const taskListUuids = useMemo(
    () => taskList.map((task) => task.uuid),
    [taskList]
  )

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.uuid,
    data: {
      type: COLUMN,
      column,
    },
    disabled: isEditMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="w-[350px] h-[500px] bg-columnBackgroundColor flex flex-col opacity-40 border-2 border-blue-500 max-h-[500px] rounded-md"
        style={style}
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col bg-columnBackgroundColor"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={(event) => {
          // @ts-ignore
          if (event.target.nodeName === 'DIV') setEditMode(true)
        }}
        className="text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold p-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          {!isEditMode && column.title}
          {isEditMode && (
            <input
              className="bg-white focus:border-blue-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.uuid, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false)
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                setEditMode(false)
              }}
            />
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              deleteColumn(column.uuid)
            }}
            className="px-1 py-2 text-gray-500 hover:text-blue-500 rounded"
          >
            Delete
          </button>
          <button
            className="flex gap-2 text-gray-500 items-center rounded-md hover:text-blue-500"
            onClick={() => {
              createTask(column.uuid)
            }}
          >
            Add task
          </button>
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskListUuids}>
          {taskList.map((task) => (
            <TaskCard
              key={task.uuid}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
