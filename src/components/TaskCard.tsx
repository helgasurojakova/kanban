import { useState } from 'react'
import type { ItemUuid, Task } from '../types/kanban'

type Props = {
  task: Task
  deleteTask: (uuid: ItemUuid) => void
  updateTask: (uuid: ItemUuid, content: string) => void
}

export const TaskCard: React.FC<Props> = ({ task, deleteTask, updateTask }) => {
  const [isMouseOver, setMouseIsOver] = useState(false)
  const [isEditMode, setEditMode] = useState(false)

  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
    setMouseIsOver(false)
  }

  if (isEditMode && task.content) {
    return (
      <div className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-700 cursor-grab relative">
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              toggleEditMode()
            }
          }}
          onChange={(e) => updateTask(task.uuid, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div
      onClick={toggleEditMode}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-700 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {isMouseOver && (
        <button
          onClick={() => deleteTask(task.uuid)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          Delete
        </button>
      )}
    </div>
  )
}
