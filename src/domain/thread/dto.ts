import { ThreadCommentDto } from '../threadComment/dto'

export interface ThreadDto {
  id: string
  title: string
  description: string
  publishedDate: Date | null
  status: string
  AuthorId: string
  author: {
    id: string
    fullname: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ThreadDetailDto {
  id: string
  title: string
  description: string
  publishedDate: Date | null
  status: string
  AuthorId: string
  author: {
    id: string
    fullname: string
  }
  threadComment: ThreadCommentDto[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateThreadDto {
  title: string
  description: string
  publishedDate: Date | null
  status: string
  AuthorId: string
}

export interface UpdateThreadDto {
  title: string
  description: string
  publishedDate: Date | null
  status: string
}

export interface ThreadQueryFilterDto {
  title: string
  description: string
  status: string
  AuthorId: string
}
