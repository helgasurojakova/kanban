import { useMemo, useState } from 'react'
import { DEFAULT_COLUMN_LIST, DEFAULT_TASK_LIST } from '../data/kanban'
import { type Column, type Task } from '../types/kanban'
import { ColumnContainer } from './ColumnContainer'
import { generateUuid } from '../utils'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { COLUMN, TASK } from './constants'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { TaskCard } from './TaskCard'

export const KanbanBoard: React.FC = () => {
  const [columnList, setColumnList] = useState(DEFAULT_COLUMN_LIST)
  const columnListUuids = useMemo(
    () => columnList.map((column) => column.uuid),
    [columnList]
  )
  const [taskList, setTaskList] = useState(DEFAULT_TASK_LIST)
  const [activeColumn, setActiveColumn] = useState<Column | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnListUuids}>
              {columnList.map((column) => (
                <ColumnContainer
                  key={column.uuid}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  taskList={taskList.filter(
                    (task) => task.columnUuid === column?.uuid
                  )}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn()
            }}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor p-4 ring-blue-700 hover:ring-2 flex gap-2"
          >
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                taskList={taskList.filter(
                  (task) => task.columnUuid === activeColumn.uuid
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )

  function createNewColumn(): void {
    const columnToAdd: Column = {
      uuid: generateUuid(),
      title: `Column ${columnList.length + 1}`,
    }

    setColumnList([...columnList, columnToAdd])
  }

  function deleteColumn(uuid: string): void {
    const filteredColumnList = columnList.filter(
      (column) => column.uuid !== uuid
    )
    setColumnList(filteredColumnList)

    const filteredTaskList = taskList.filter((task) => task.columnUuid !== uuid)
    setTaskList(filteredTaskList)
  }

  function updateColumn(uuid: string, title: string): void {
    const newColumnList = columnList.map((column) => {
      if (column.uuid !== uuid) return column
      return { ...column, title }
    })
    setColumnList(newColumnList)
  }

  function createTask(columnUuid: string): void {
    const newTask: Task = {
      uuid: generateUuid(),
      content: `Task ${taskList.length + 1}`,
      columnUuid,
    }

    setTaskList([newTask, ...taskList])
  }

  function deleteTask(uuid: string): void {
    const filteredTaskList = taskList.filter((task) => task.uuid !== uuid)
    setTaskList(filteredTaskList)
  }

  function updateTask(uuid: string, content: string): void {
    const newTaskList = taskList.map((task) =>
      task.uuid !== uuid ? task : { ...task, content }
    )
    setTaskList(newTaskList)
  }

  function onDragStart(event: DragStartEvent): void {
    if (event.active.data.current?.type === COLUMN) {
      return setActiveColumn(event.active.data.current.column)
    }

    if (event.active.data.current?.type === TASK) {
      return setActiveTask(event.active.data.current.task)
    }
  }

  function onDragEnd(event: DragEndEvent): void {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeUuid = active.id
    const overUuid = over.id

    if (activeUuid === overUuid) return

    setColumnList((columns) => {
      const isActiveColumnIndex = columns.findIndex(
        (col) => col.uuid === activeUuid
      )
      const overColumnIndex = columns.findIndex((col) => col.uuid === overUuid)
      return arrayMove(columns, isActiveColumnIndex, overColumnIndex)
    })
  }

  function onDragOver(event: DragOverEvent): null | undefined {
    const { active, over } = event
    if (!over) return null
    const activeUuid = active.id
    const overUuid = over.id
    if (activeUuid === overUuid) return null
    const isActiveATask = active.data.current?.type === TASK
    const isOverATask = over.data.current?.type === TASK
    if (!isActiveATask) return null
    if (isActiveATask && isOverATask) {
      setTaskList((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.uuid === activeUuid)
        const overIndex = tasks.findIndex((task) => task.uuid === overUuid)
        tasks[activeIndex].columnUuid = tasks[overIndex].columnUuid
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === COLUMN
    if (isActiveATask && isOverAColumn) {
      setTaskList((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.uuid === activeUuid)
        tasks[activeIndex].columnUuid = `${overUuid}`
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }
}
