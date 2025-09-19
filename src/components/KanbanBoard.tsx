import { useState } from 'react'
import { DEFAULT_COLUMN_LIST, DEFAULT_TASK_LIST } from '../data/kanban'
import { type Column, type Task } from '../types/kanban'
import { ColumnContainer } from './ColumnContainer'
import { generateUuid } from '../utils'

export const KanbanBoard: React.FC = () => {
  const [columnList, setColumnList] = useState(DEFAULT_COLUMN_LIST)
  const [taskList, setTaskList] = useState(DEFAULT_TASK_LIST)

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
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
}
