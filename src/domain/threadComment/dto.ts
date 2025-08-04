import { ThreadDto } from '../thread/dto'

export interface ThreadCommentDto {
  id: string
  message: string
  ThreadId: string
  UserId: string
  user: {
    id: string
    fullname: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ThreadCommentDetailDto {
  id: string
  message: string
  ThreadId: string
  UserId: string
  user: {
    id: string
    fullname: string
  }
  thread: ThreadDto
  createdAt: Date
  updatedAt: Date
}

export interface CreateThreadCommentDto {
  message: string
  ThreadId: string
  UserId: string
}

export interface UpdateThreadCommentDto {
  message: string
}

export interface ThreadCommentQueryFilterDto {
  message: string
  ThreadId: string
  UserId: string
}
