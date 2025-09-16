import type { Column, Task } from '../types/kanban'

export const DEFAULT_COLUMN_LIST: Column[] = [
  {
    uuid: '9pvshih8',
    title: 'Idea',
  },
  {
    uuid: '3jn1md1y',
    title: 'To Do',
  },
  {
    uuid: '7klm2n3p',
    title: 'In Progress',
  },
  {
    uuid: '4zxcv5qw',
    title: 'Done',
  },
]

export const DEFAULT_TASK_LIST: Task[] = [
  {
    uuid: '4sqtku27',
    columnUuid: '9pvshih8',
    content: 'Brainstorm new user profile customization options',
  },
  {
    uuid: '6yswr5oa',
    columnUuid: '9pvshih8',
    content: 'Research trending hashtags feature',
  },
  {
    uuid: '8pqr7tuv',
    columnUuid: '3jn1md1y',
    content: 'Implement user authentication system',
  },
  {
    uuid: '2abmn9xy',
    columnUuid: '3jn1md1y',
    content: 'Design post creation UI',
  },
  {
    uuid: '5hjkl3de',
    columnUuid: '7klm2n3p',
    content: 'Develop real-time chat functionality',
  },
  {
    uuid: '9rstu1fg',
    columnUuid: '7klm2n3p',
    content: 'Test notification system for new messages',
  },
  {
    uuid: '1vwxy4hi',
    columnUuid: '4zxcv5qw',
    content: 'Deploy initial version of news feed',
  },
  {
    uuid: '3klmn6op',
    columnUuid: '4zxcv5qw',
    content: 'Complete user profile page styling',
  },
]
