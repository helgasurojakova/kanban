export type ItemUuid = string

export type Column = {
  uuid: ItemUuid
  title: string
}

export type Task = {
  uuid: ItemUuid
  columnUuid: ItemUuid
  content: string
}
